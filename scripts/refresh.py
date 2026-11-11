#!/usr/bin/env python3
"""Public metadata radar. Python stdlib only; no LLM, credentials, or quality claims."""
import argparse
import copy
from datetime import datetime, timedelta, timezone
import json
from pathlib import Path
import re
import sys
import time
from urllib.error import HTTPError
from urllib.parse import urlencode
from urllib.request import Request, urlopen
import xml.etree.ElementTree as ET

UTC = timezone.utc
DIRECTIONS = {
    'clinical': ('临床与心理健康 · Clinical & mental health', '如何验证心理支持的安全性与真实临床效益？'),
    'simulation': ('认知与社会行为 · Cognition & social behavior', '如何检验认知测量、社会行为研究与人类模拟的外部效度？'),
    'measurement': ('心理测量 · Psychometrics', '量表、人格与偏差测量是否具有构念效度？'),
    'methods': ('质性方法与可复现性 · Qualitative methods & reproducibility', '如何审计质性编码、数据泄漏和复现流程？'),
    'education': ('教育与发展 · Education & development', '学习与发展结果如何在真实环境中验证？'),
}
LLM = re.compile(r'\b(large language models?|LLMs?|ChatGPT|GPT[- ]?[345o]|generative (?:AI|artificial intelligence)|language model(?:s)?)\b', re.I)
TERMS = {
    'clinical': r'mental health|psychotherap|psychiatr|depressi|anxiety|suicid|\bPTSD\b|post[- ]?traumatic|psycholog.{0,20}(?:support|counsel)|counseling|counselling',
    'simulation': r'\bcogniti|social simulat|human behavio|theory of mind|social psycholog|decision.making|moral judgment',
    'measurement': r'psychometr|personality|big five|construct valid|psychological assess|psychological measur|psychological scale|response bias',
    'methods': r'qualitative|thematic analys|reproducib|replicab|research method|interview coding',
    'education': r'educati|learning outcome|student|child development|developmental psycholog|pedagog|tutor',
}
# Methods alone must still be grounded in psychology/human research.
SCREENING_VERSION = '1.1.0'
EDUCATION_PROCESS = re.compile(r'metacognit|self.regulat|motivat|cognitive load|learning (?:outcome|gain|perform|transfer|retention)|academic (?:achievement|perform)|learner autonomy|student (?:engagement|well.?being)|critical thinking|trust calibration|child development|developmental psycholog', re.I)
PSYCH = re.compile(r'psycholog|mental health|psychotherap|psychiatr|cogniti|social scien|human behavio|personality|psychometr|student|educati|child|interview|social research', re.I)


def stamp(value):
    if not value:
        return None
    try:
        value = str(value)
        if len(value) == 10:
            value += 'T00:00:00+00:00'
        dt = datetime.fromisoformat(value.replace('Z', '+00:00'))
        return dt.replace(tzinfo=dt.tzinfo or UTC).astimezone(UTC)
    except (TypeError, ValueError):
        return None


def iso(dt):
    return dt.astimezone(UTC).isoformat(timespec='seconds').replace('+00:00', 'Z')


def screening(record):
    title, abstract = record.get('title', ''), record.get('abstract', '')
    if not (LLM.search(title) or len(LLM.findall(abstract)) >= 2):
        return None, []
    text = title + ' ' + abstract
    signals = {key: sorted(set(m.group(0).lower() for m in re.finditer(pattern, text, re.I))) for key, pattern in TERMS.items()}
    if signals['methods'] and not PSYCH.search(text):
        signals['methods'] = []
    if signals['education'] and not EDUCATION_PROCESS.search(text):
        signals['education'] = []
    scores = {key: (3 * len(set(m.group(0).lower() for m in re.finditer(TERMS[key], title, re.I))) + min(len(values), 3)) if values else 0 for key, values in signals.items()}
    best = max(scores, key=scores.get)
    if not scores[best]:
        return None, []
    return best, ['LLM-primary:title' if LLM.search(title) else 'LLM-primary:abstract>=2'] + [best + ':' + value for value in signals[best]]


def classify(record):
    return screening(record)[0]

def normalize_title(title):
    return re.sub(r'[^\w]', '', title.casefold())


def deduplicate(records):
    """Merge retrieved versions before date filtering; retain earliest known date."""
    groups = []
    for item in sorted(records, key=lambda r: (r.get('type') == 'preprint', r.get('id', ''))):
        doi = re.sub(r'^https?://(?:dx\.)?doi.org/', '', item.get('doi', '').lower()).strip()
        keys = {('title', normalize_title(item.get('title', ''))), ('id', item.get('id', ''))}
        if doi:
            keys.add(('doi', doi))
        keys = {key for key in keys if key[1]}
        matching = [group for group in groups if group[0] & keys]
        if matching:
            keep = matching[0]
            keep[0].update(keys)
            keep[1].append(item)
            for group in matching[1:]:
                keep[0].update(group[0])
                keep[1].extend(group[1])
                groups.remove(group)
        else:
            groups.append([keys, [item]])
    output = []
    for _, members in groups:
        representative = dict(sorted(members, key=lambda row: (row.get('type') == 'preprint', row.get('id', '')))[0])
        representative['recordPublishedAt'] = representative.get('publishedAt')
        dates = [stamp(row.get('publishedAt')) for row in members]
        dates = [value for value in dates if value is not None]
        representative['publishedAt'] = iso(min(dates)) if dates else None
        representative['dateBasis'] = 'earliest_retrieved_version'
        versions = [{'id': row.get('id'), 'source': row.get('source'), 'url': row.get('url'), 'publishedAt': row.get('publishedAt'), 'type': row.get('type')} for row in members]
        representative['versions'] = list({(row['id'], row['publishedAt']): row for row in versions}.values())
        output.append(representative)
    return output

def eligible(records, now, days=90):
    accepted = []
    known = [row for row in records if stamp(row.get('publishedAt')) is not None and stamp(row.get('publishedAt')) <= now]
    for row in deduplicate(known):
        pub = stamp(row.get('publishedAt'))
        theme, signals = screening(row)
        if not pub or not now - timedelta(days=days) <= pub <= now or not theme:
            continue
        if not row.get('title') or not row.get('url', '').startswith(('https://', 'http://')):
            continue
        row = dict(row, theme=theme, publishedAt=iso(pub), matchedSignals=signals)
        updated = stamp(row.get('updatedAt'))
        row['updatedAt'] = iso(updated) if updated and pub <= updated <= now else None
        accepted.append(row)
    return accepted

def select_daily(rows, now):
    # Deterministic recency then title relevance. No citation/quality score.
    def score(row):
        age = (now - stamp(row['publishedAt'])).total_seconds() / 86400
        title_hits = len(re.findall(TERMS[row['theme']], row['title'], re.I))
        return (-(90 - age + min(title_hits, 3) * 3), row['id'])
    ordered = sorted(rows, key=score)
    chosen = []
    # One per direction first; fill remaining slots only if alternatives exhausted.
    for row in ordered:
        if row['theme'] not in {x['theme'] for x in chosen}:
            chosen.append(row)
        if len(chosen) == 3:
            break
    for row in ordered:
        if len(chosen) == 3:
            break
        if row not in chosen:
            chosen.append(row)
    return [{k: row.get(k) for k in ('id', 'title', 'url', 'publishedAt', 'recordPublishedAt', 'updatedAt', 'type', 'source', 'theme', 'dateBasis', 'versions', 'matchedSignals')} | {
        'reason': '公开元数据筛选：LLM为主要主题，并匹配心理学过程/任务；按样本内最早已知日期与标题相关信号排序，优先方向多样性。',
        'caution': '仅元数据筛选，不是质量评审；预印本可能未经同行评审，临床结论需独立验证。',
    } for row in chosen]


def fetch(url):
    error = None
    for attempt in range(3):
        try:
            with urlopen(Request(url, headers={'User-Agent': 'PsychologyResearchRadar/1.0 (public metadata)'}), timeout=35) as response:
                body = response.read(8_000_001)
                if len(body) > 8_000_000:
                    raise ValueError('Metadata response exceeds 8 MB limit')
                return body
        except HTTPError as exc:
            if exc.code == 429:
                raise
            error = exc
            if attempt < 2:
                time.sleep(2 ** attempt)
        except Exception as exc:
            error = exc
            if attempt < 2:
                time.sleep(2 ** attempt)
    raise RuntimeError(f'{type(error).__name__}: {error}')


def europe_pmc(now):
    start = (now - timedelta(days=90)).date().isoformat()
    end = now.date().isoformat()
    query = f'("large language model" OR "large language models" OR ChatGPT) AND (psychology OR mental OR cognitive OR personality OR education OR qualitative) AND FIRST_PDATE:[{start} TO {end}]'
    cursor, records = '*', []
    for _ in range(3):
        url = 'https://www.ebi.ac.uk/europepmc/webservices/rest/search?' + urlencode({'query': query, 'format': 'json', 'resultType': 'core', 'pageSize': 100, 'cursorMark': cursor, 'sort': 'FIRST_PDATE_D desc'})
        data = json.loads(fetch(url))
        if 'resultList' not in data or not isinstance(data['resultList'].get('result'), list):
            raise ValueError('Europe PMC response lacks resultList.result')
        for r in data.get('resultList', {}).get('result', []):
            doi = r.get('doi', '')
            records.append({'id': 'epmc:' + r.get('source', 'MED') + ':' + r['id'], 'title': r.get('title', ''), 'abstract': re.sub('<[^>]+>', ' ', r.get('abstractText', '')), 'doi': doi, 'url': 'https://doi.org/' + doi if doi else f"https://europepmc.org/article/{r.get('source', 'MED')}/{r['id']}", 'publishedAt': r.get('firstPublicationDate'), 'updatedAt': None, 'source': 'Europe PMC', 'type': 'preprint' if r.get('source') == 'PPR' else 'paper'})
        next_cursor = data.get('nextCursorMark')
        if not next_cursor or next_cursor == cursor:
            break
        cursor = next_cursor
    return records


def arxiv(now):
    query = '(all:"large language model" OR all:ChatGPT) AND (all:psychology OR all:"mental health" OR all:cognitive OR all:personality OR all:education OR all:qualitative)'
    url = 'https://export.arxiv.org/api/query?' + urlencode({'search_query': query, 'start': 0, 'max_results': 200, 'sortBy': 'submittedDate', 'sortOrder': 'descending'})
    root = ET.fromstring(fetch(url))
    if root.tag != '{http://www.w3.org/2005/Atom}feed':
        raise ValueError('arXiv response is not an Atom feed')
    ns = {'a': 'http://www.w3.org/2005/Atom', 'x': 'http://arxiv.org/schemas/atom'}
    rows = []
    for e in root.findall('a:entry', ns):
        def val(key):
            return ' '.join((e.findtext(key, '', ns) or '').split())
        url = val('a:id').replace('http://', 'https://')
        if '/abs/' not in url:
            raise ValueError('arXiv returned an error entry')
        rows.append({'id': 'arxiv:' + re.sub(r'v\d+$', '', url.rsplit('/', 1)[-1]), 'title': val('a:title'), 'abstract': val('a:summary'), 'doi': val('x:doi'), 'url': url, 'publishedAt': val('a:published'), 'updatedAt': val('a:updated'), 'source': 'arXiv', 'type': 'preprint'})
    return rows


METHODOLOGY = [
    "公开元数据样本：Europe PMC最多300条，arXiv最多200条；记录查询、条数上限及达到上限的状态；数据库覆盖有偏差，不是穷尽检索。",
    "LLM需在标题出现或摘要至少提及两次；教育主题另需元认知、学习结局等心理过程信号；认知/社会行为不自动等同于人类模拟。保留匹配词供审查。",
    "先按DOI、规范化标题或来源ID合并已检索版本，再取样本内最早已知日期；无法保证找全作品的旧版本。日报窗口90天，周报7天；缺失或未来日期排除。",
    "每日3条按90−样本内最早已知发表年龄+标题主题信号排序，优先方向多样性。分数不是质量、影响力或疗效。",
    "周报每周一更新，并在筛选规则变化时重算；五个预设方向按样本数排序，保留逐篇标题、链接、日期和匹配信号。零值不代表没有研究，不能称全领域前五。",
    "单源失败可更新足量候选，但标明覆盖不完整；全部失败或不足3条保留旧日报与日期。HTTP429停止即时重试并冷却24小时。",
    "来源全部可用只表示配置来源请求成功，不等于全领域完整覆盖。人工综述、挑战和图谱独立维护，自动任务不改写结论。"
]


def refresh(previous, now, providers=None, force_weekly=False):
    providers = providers or {'Europe PMC': europe_pmc, 'arXiv': arxiv}
    output = copy.deepcopy(previous)
    output.update(lastAttemptAt=iso(now), methodology=METHODOLOGY, screeningVersion=SCREENING_VERSION)
    output.setdefault('daily', [])
    output.setdefault('weekly', [])
    output.setdefault('dailyUpdatedAt', None)
    output.setdefault('weeklyUpdatedAt', None)
    for period in ('daily', 'weekly'):
        was_complete = previous.get('status', {}).get('state') == 'ok' and previous.get(period + 'UpdatedAt')
        output.setdefault(period + 'Coverage', 'complete' if was_complete else None)
        output.setdefault('lastComplete' + period.title() + 'At', previous.get(period + 'UpdatedAt') if was_complete else None)
    previous_results = {result['source']: result for result in previous.get('status', {}).get('sourceResults', [])}
    records, results = [], []
    for name, provider in providers.items():
        old = previous_results.get(name, {})
        retry_at = stamp(old.get('retryAfterAt'))
        legacy_429 = old.get('httpStatus') == 429 or bool(re.search(r'\b429\b', old.get('message', '')))
        if retry_at is None and legacy_429:
            attempted = stamp(old.get('lastAttemptAt')) or stamp(previous.get('lastAttemptAt')) or now
            retry_at = attempted + timedelta(hours=24)
        if retry_at and retry_at > now:
            results.append({'source': name, 'state': 'deferred', 'httpStatus': old.get('httpStatus', 429 if legacy_429 else None), 'message': '来源冷却期，未发起请求；覆盖不完整。', 'lastAttemptAt': old.get('lastAttemptAt'), 'checkedAt': iso(now), 'retryAfterAt': iso(retry_at)})
            continue
        try:
            rows = provider(now)
            records.extend(rows)
            results.append({'source': name, 'state': 'ok', 'count': len(rows), 'lastAttemptAt': iso(now)})
        except Exception as exc:
            result = {'source': name, 'state': 'error', 'message': str(exc)[:500], 'lastAttemptAt': iso(now)}
            if getattr(exc, 'code', None) == 429 or re.search(r'\b429\b', str(exc)):
                result.update(httpStatus=429, retryAfterAt=iso(now + timedelta(hours=24)))
            results.append(result)
    failures = any(r['state'] != 'ok' for r in results)
    all_failed = all(r['state'] != 'ok' for r in results)
    rows = eligible(records, now)
    coverage = {'recordsFetched': len(records), 'deduplicatedRecords': len(deduplicate(records)), 'eligibleRecords': len(rows), 'sourceLimits': {'Europe PMC': 300, 'arXiv': 200}, 'sourceResults': [{'source': r['source'], 'state': r['state'], 'count': r.get('count'), 'limitReached': r.get('count', 0) >= {'Europe PMC': 300, 'arXiv': 200}.get(r['source'], 10**9)} for r in results], 'dateBasis': 'earliest retrieved version; earlier unobserved versions may exist', 'windowStart': iso(now - timedelta(days=90)), 'windowEnd': iso(now), 'queries': {'Europe PMC': '(large language model OR large language models OR ChatGPT) AND (psychology OR mental OR cognitive OR personality OR education OR qualitative), FIRST_PDATE within 90 days', 'arXiv': '(large language model OR ChatGPT) AND (psychology OR mental health OR cognitive OR personality OR education OR qualitative), submittedDate descending'}}
    output['attemptCoverage'] = coverage
    daily = select_daily(rows, now)
    messages = []
    if failures:
        messages.append('部分来源失败或处于冷却期；可用来源继续更新，样本覆盖不完整。' if not all_failed else '全部来源不可用，保留此前内容与时间戳。')
    if len(daily) < 3:
        messages.append(f'90 天内合格样本仅 {len(daily)} 条，保留此前日报；不补造条目。')
    if len(daily) == 3 and not all_failed:
        output.update(daily=daily, dailyUpdatedAt=iso(now), dailyCoverage='partial' if failures else 'complete', dailyPolicyVersion=SCREENING_VERSION, dailySample=copy.deepcopy(coverage))
        if not failures:
            output['lastCompleteDailyAt'] = iso(now)
    last_weekly = stamp(previous.get('weeklyUpdatedAt'))
    week_start = (now - timedelta(days=now.weekday())).replace(hour=0, minute=0, second=0, microsecond=0)
    due = force_weekly or previous.get('weeklyPolicyVersion') != SCREENING_VERSION or previous.get('screeningVersion') != SCREENING_VERSION or not previous.get('weekly') or last_weekly is None or last_weekly < week_start
    if due and not all_failed:
        recent = [r for r in rows if stamp(r['publishedAt']) >= now - timedelta(days=7)]
        weekly = []
        for key, (title, question) in DIRECTIONS.items():
            matched = [row for row in recent if row['theme'] == key]
            papers = [{field: row.get(field) for field in ('id', 'title', 'url', 'publishedAt', 'recordPublishedAt', 'dateBasis', 'matchedSignals')} for row in matched]
            weekly.append({'id': key, 'title': title, 'question': question, 'signal': f'过去 7 天检索样本 {len(matched)} 条；仅在五个预设方向中按数量排序。' + (' 来源覆盖不完整。' if failures else ''), 'count': len(matched), 'sourceIds': [row['id'] for row in matched], 'papers': papers})
        output['weekly'] = sorted(weekly, key=lambda row: (-row['count'], row['id']))
        output['weeklySample'] = dict(coverage, windowStart=iso(now - timedelta(days=7)), weeklyRecords=len(recent), windowEnd=iso(now))
        output['weeklyUpdatedAt'] = iso(now)
        output['weeklyPolicyVersion'] = SCREENING_VERSION
        output['weeklyCoverage'] = 'partial' if failures else 'complete'
        if not failures:
            output['lastCompleteWeeklyAt'] = iso(now)
    output['status'] = {'state': 'error' if all_failed else 'warning' if len(daily) < 3 else 'partial' if failures else 'ok', 'message': ' '.join(messages) or '公开元数据刷新成功；精选综述独立维护。', 'sourceResults': results}
    return output


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument('--force-weekly', action='store_true')
    parser.add_argument('--summary', action='store_true', help='Print a public-metadata audit summary')
    args = parser.parse_args()
    # Validate read-only curated inputs; do not include their stale dates in the radar.
    for name in ('research.json', 'graph.json'):
        json.loads((args.root / 'data' / name).read_text())
    path = args.root / 'data/radar.json'
    previous = json.loads(path.read_text()) if path.exists() else {}
    result = refresh(previous, datetime.now(UTC), force_weekly=args.force_weekly)
    encoded = json.dumps(result, ensure_ascii=False, indent=2) + '\n'
    for target, content in [(path, encoded), (args.root / 'site/radar-data.js', 'window.RADAR_DATA = ' + encoded.rstrip() + ';\n')]:
        target.parent.mkdir(parents=True, exist_ok=True)
        tmp = target.with_suffix(target.suffix + '.tmp')
        tmp.write_text(content, encoding='utf-8')
        tmp.replace(target)
    print(result['status']['message'])
    if args.summary:
        print(json.dumps({'state': result['status']['state'], 'dailyUpdatedAt': result.get('dailyUpdatedAt'), 'dailyPolicyVersion': result.get('dailyPolicyVersion'), 'daily': result['daily'], 'weeklyUpdatedAt': result.get('weeklyUpdatedAt'), 'weeklyPolicyVersion': result.get('weeklyPolicyVersion'), 'weekly': [{'id': row['id'], 'count': row.get('count'), 'papers': row.get('papers')} for row in result['weekly']], 'coverage': result.get('attemptCoverage')}, ensure_ascii=False))
    return 0 if result['status']['state'] in ('ok', 'partial') else 1


if __name__ == '__main__':
    sys.exit(main())
