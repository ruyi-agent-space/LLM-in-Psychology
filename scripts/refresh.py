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
from urllib.parse import urlencode
from urllib.request import Request, urlopen
import xml.etree.ElementTree as ET

UTC = timezone.utc
DIRECTIONS = {
    'clinical': ('临床与心理健康 · Clinical & mental health', '如何验证心理支持的安全性与真实临床效益？'),
    'simulation': ('认知与社会模拟 · Cognitive & social simulation', '模型模拟能否跨情境复现人类认知与社会行为？'),
    'measurement': ('心理测量 · Psychometrics', '量表、人格与偏差测量是否具有构念效度？'),
    'methods': ('质性方法与可复现性 · Qualitative methods & reproducibility', '如何审计质性编码、数据泄漏和复现流程？'),
    'education': ('教育与发展 · Education & development', '学习与发展结果如何在真实环境中验证？'),
}
LLM = re.compile(r'\b(large language models?|LLMs?|ChatGPT|GPT[- ]?[345o]|generative (?:AI|artificial intelligence)|language model(?:s)?)\b', re.I)
TERMS = {
    'clinical': r'mental health|psychotherap|psychiatr|depressi|anxiety|suicid|psycholog.{0,20}(?:support|counsel)|counseling|counselling',
    'simulation': r'cogniti|social simulat|human behavio|theory of mind|social psycholog|decision.making|moral judgment',
    'measurement': r'psychometr|personality|big five|construct valid|psychological assess|psychological measur|psychological scale|response bias',
    'methods': r'qualitative|thematic analys|reproducib|replicab|research method|interview coding',
    'education': r'educati|learning outcome|student|child development|developmental psycholog|pedagog|tutor',
}
# Methods alone must still be grounded in psychology/human research.
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


def classify(record):
    text = record.get('title', '') + ' ' + record.get('abstract', '')
    if not LLM.search(text):
        return None
    hits = {key: len(re.findall(pattern, text, re.I)) for key, pattern in TERMS.items()}
    if hits['methods'] and not PSYCH.search(text):
        hits['methods'] = 0
    best = max(hits, key=hits.get)
    return best if hits[best] else None


def normalize_title(title):
    return re.sub(r'[^\w]', '', title.casefold())


def deduplicate(records):
    """Union connected duplicate groups, including DOI/title bridge records."""
    groups = []
    for item in sorted(records, key=lambda r: (r.get('type') == 'preprint', r.get('id', ''))):
        doi = re.sub(r'^https?://(?:dx\.)?doi.org/', '', item.get('doi', '').lower()).strip()
        keys = {('title', normalize_title(item.get('title', ''))), ('id', item.get('id', ''))}
        if doi:
            keys.add(('doi', doi))
        keys = {k for k in keys if k[1]}
        matching = [g for g in groups if g[0] & keys]
        if matching:
            keep = matching[0]
            keep[0].update(keys)
            for group in matching[1:]:
                keep[0].update(group[0])
                groups.remove(group)
        else:
            groups.append([keys, item])
    return [g[1] for g in groups]


def eligible(records, now, days=90):
    accepted = []
    for row in records:
        pub = stamp(row.get('publishedAt'))
        theme = classify(row)
        if not pub or not now - timedelta(days=days) <= pub <= now or not theme:
            continue
        if not row.get('title') or not row.get('url', '').startswith(('https://', 'http://')):
            continue
        row = dict(row, theme=theme, publishedAt=iso(pub))
        updated = stamp(row.get('updatedAt'))
        row['updatedAt'] = iso(updated) if updated and pub <= updated <= now else None
        accepted.append(row)
    return deduplicate(accepted)


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
    return [{k: row.get(k) for k in ('id', 'title', 'url', 'publishedAt', 'updatedAt', 'type', 'source', 'theme')} | {
        'reason': '公开元数据主题匹配；按发表新近性 + 标题关键词加分排序，并优先方向多样性。',
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
    '公开元数据样本：Europe PMC 最多 300 条、arXiv 最多 200 条；查询和覆盖有偏差，不代表穷尽检索或领域排名。',
    '必须同时匹配 LLM 与心理学相关主题；质性/复现方法还需心理学或人类研究语境。DOI、规范化标题或来源 ID 去重。',
    '日报仅纳入原始发表时间在过去 90 天内的项目；更新时间不刷新文献年龄，缺失或未来发表日期排除。',
    '每日 3 条：分数 = 90 − 发表年龄（天）+ 3 × 标题主题命中数（上限 3）；先选不同方向，再补齐。分数不是质量或影响力。',
    '周报每周一更新五个固定方向；数量是过去 7 天首次发表且通过筛选的公开样本，零值不表示没有研究；不是趋势增速或完整热度排名。',
    '任一来源失败时保留已有成功日报与周报及其时间戳；首次运行可展示足量的部分样本并明确警告。不足 3 条不编造日报。',
    '精选综述与图谱为独立人工策展输入；自动任务不覆盖 data/research.json 或 data/graph.json，不自动改写综述结论。',
]


def refresh(previous, now, providers=None, force_weekly=False):
    providers = providers or {'Europe PMC': europe_pmc, 'arXiv': arxiv}
    output = copy.deepcopy(previous)
    output.update(lastAttemptAt=iso(now), methodology=METHODOLOGY)
    output.setdefault('daily', [])
    output.setdefault('weekly', [])
    output.setdefault('dailyUpdatedAt', None)
    output.setdefault('weeklyUpdatedAt', None)
    records, results = [], []
    for name, provider in providers.items():
        try:
            rows = provider(now)
            records.extend(rows)
            results.append({'source': name, 'state': 'ok', 'count': len(rows), 'lastAttemptAt': iso(now)})
        except Exception as exc:
            results.append({'source': name, 'state': 'error', 'message': str(exc)[:500], 'lastAttemptAt': iso(now)})
    failures = any(r['state'] == 'error' for r in results)
    all_failed = all(r['state'] == 'error' for r in results)
    rows = eligible(records, now)
    daily = select_daily(rows, now)
    messages = []
    if failures:
        messages.append('来源失败，已有成功内容与时间戳保持不变；新样本覆盖不完整。')
    if len(daily) < 3:
        messages.append(f'90 天内合格样本仅 {len(daily)} 条，保留此前日报；不补造条目。')
    if len(daily) == 3 and not all_failed and (not failures or not previous.get('daily')):
        output.update(daily=daily, dailyUpdatedAt=iso(now))
    last_weekly = stamp(previous.get('weeklyUpdatedAt'))
    week_start = (now - timedelta(days=now.weekday())).replace(hour=0, minute=0, second=0, microsecond=0)
    due = force_weekly or not previous.get('weekly') or last_weekly is None or last_weekly < week_start
    if due and not all_failed and (not failures or not previous.get('weekly')):
        recent = [r for r in rows if stamp(r['publishedAt']) >= now - timedelta(days=7)]
        output['weekly'] = [{'id': key, 'title': title, 'question': question, 'signal': f'过去 7 天公开检索样本 {sum(r["theme"] == key for r in recent)} 条；非穷尽统计。' + (' 来源覆盖不完整。' if failures else ''), 'count': sum(r['theme'] == key for r in recent), 'sourceIds': [r['id'] for r in recent if r['theme'] == key]} for key, (title, question) in DIRECTIONS.items()]
        output['weeklyUpdatedAt'] = iso(now)
    output['status'] = {'state': 'error' if all_failed else 'warning' if messages else 'ok', 'message': ' '.join(messages) or '公开元数据刷新成功；精选综述独立维护。', 'sourceResults': results}
    return output


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument('--force-weekly', action='store_true')
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
    return 1 if result['status']['state'] != 'ok' else 0


if __name__ == '__main__':
    sys.exit(main())
