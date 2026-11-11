import importlib.util
from pathlib import Path
import unittest
from unittest.mock import patch, Mock
from urllib.error import HTTPError
import json
from datetime import datetime, timedelta, timezone

spec = importlib.util.spec_from_file_location('refresh', Path(__file__).resolve().parents[1] / 'scripts/refresh.py')
r = importlib.util.module_from_spec(spec)
spec.loader.exec_module(r)
NOW = datetime(2026, 11, 9, 12, tzinfo=timezone.utc)


def paper(i, title='Large language models for mental health', days=1, **extra):
    return {'id': str(i), 'title': title, 'url': 'https://example.org/' + str(i), 'publishedAt': r.iso(NOW - timedelta(days=days)), 'updatedAt': None, 'source': 'fixture', 'type': 'paper', **extra}


def fail(_):
    raise RuntimeError('fixture outage')


class RefreshTests(unittest.TestCase):
    def rows(self):
        return [paper(1), paper(2, 'ChatGPT for personality measurement'), paper(3, 'Large language models for student metacognition')]

    def test_europe_pmc_parser(self):
        payload = {'resultList': {'result': [{'id': '123', 'source': 'MED', 'title': 'LLM mental health', 'firstPublicationDate': '2026-11-08', 'doi': '10/example', 'abstractText': '<p>Psychology</p>'}]}}
        with patch.object(r, 'fetch', return_value=json.dumps(payload).encode()):
            rows = r.europe_pmc(NOW)
        self.assertEqual(rows[0]['url'], 'https://doi.org/10/example')
        self.assertIsNone(rows[0]['updatedAt'])
        with patch.object(r, 'fetch', return_value=b'{"error":"bad query"}'):
            self.assertRaises(ValueError, r.europe_pmc, NOW)

    def test_arxiv_parser(self):
        payload = b'<feed xmlns="http://www.w3.org/2005/Atom"><entry><id>http://arxiv.org/abs/2611.12345v2</id><title>LLM cognition</title><published>2026-11-07T01:00:00Z</published><updated>2026-11-08T01:00:00Z</updated></entry></feed>'
        with patch.object(r, 'fetch', return_value=payload):
            row = r.arxiv(NOW)[0]
        self.assertEqual(row['id'], 'arxiv:2611.12345')
        self.assertEqual(row['type'], 'preprint')
        self.assertNotEqual(row['publishedAt'], row['updatedAt'])
        with patch.object(r, 'fetch', return_value=b'<error/>'):
            self.assertRaises(ValueError, r.arxiv, NOW)

    def test_relevance(self):
        self.assertIsNone(r.classify(paper(1, 'Depression in adults')))
        self.assertIsNone(r.classify(paper(1, 'LLM reproducibility in code generation')))
        self.assertEqual(r.classify(paper(1, 'LLM qualitative interviews in psychology')), 'methods')
        for title, theme in [('LLM theory of mind', 'simulation'), ('LLM student metacognition', 'education'), ('LLM psychometrics', 'measurement'), ('LLM mental health', 'clinical')]:
            self.assertEqual(r.classify(paper(1, title)), theme)

    def test_dates(self):
        self.assertEqual(len(r.eligible([paper(1, 'LLM mental health future case', days=-1), paper(2, 'LLM mental health older case', days=91), paper(3, 'LLM mental health unknown case', publishedAt=None), paper(4, 'LLM mental health boundary case', days=90)], NOW)), 1)
        self.assertEqual(r.eligible([paper(1, updatedAt=r.iso(NOW + timedelta(days=1)))], NOW)[0]['updatedAt'], None)
        self.assertEqual(r.eligible([paper(1, days=95, updatedAt=r.iso(NOW))], NOW), [])

    def test_dedup(self):
        rows = [paper(1, doi='10.1/a'), paper(2, 'Different title', doi='https://doi.org/10.1/a'), paper(3, 'DIFFERENT TITLE!'), paper(4, 'New title', doi='10.1/b')]
        self.assertEqual(len(r.deduplicate(rows)), 2)
        self.assertEqual(len(r.deduplicate([paper(1), paper(1, 'Another title')])), 1)

    def test_bridge_dedup(self):
        self.assertEqual(len(r.deduplicate([paper('a', 'First title', doi='10/a'), paper('b', 'Second title', doi='10/b'), paper('c', 'Second title', doi='10/a')])), 1)

    def test_diversity(self):
        rows = self.rows() + [paper(4, 'ChatGPT and anxiety', days=0), paper(5, 'LLMs and depression', days=0)]
        chosen = r.select_daily(r.eligible(rows, NOW), NOW)
        self.assertEqual(len(chosen), 3)
        self.assertEqual(sum(x['theme'] == 'clinical' for x in chosen), 1)
        self.assertEqual(chosen, r.select_daily(r.eligible(list(reversed(rows)), NOW), NOW))

    def test_failure_preservation(self):
        previous = r.refresh({}, NOW, {'one': lambda _: self.rows()})
        result = r.refresh(previous, NOW + timedelta(days=7), {'one': fail})
        for key in ('daily', 'weekly', 'dailyUpdatedAt', 'weeklyUpdatedAt', 'lastCompleteDailyAt', 'lastCompleteWeeklyAt', 'dailyCoverage', 'weeklyCoverage'):
            self.assertEqual(previous[key], result[key])
        self.assertNotEqual(previous['lastAttemptAt'], result['lastAttemptAt'])
        self.assertEqual(result['status']['state'], 'error')

    def test_partial_advances_and_preserves_complete(self):
        previous = r.refresh({}, NOW, {'one': lambda _: self.rows()})
        later = NOW + timedelta(days=7)
        result = r.refresh(previous, later, {'one': fail, 'two': lambda _: self.rows()})
        self.assertEqual(result['status']['state'], 'partial')
        for period in ('daily', 'weekly'):
            self.assertEqual(result[period + 'UpdatedAt'], r.iso(later))
            self.assertEqual(result[period + 'Coverage'], 'partial')
            self.assertEqual(result['lastComplete' + period.title() + 'At'], r.iso(NOW))

    def test_partial_keeps_not_due_weekly(self):
        previous = r.refresh({}, NOW, {'one': lambda _: self.rows()})
        result = r.refresh(previous, NOW + timedelta(days=1), {'one': fail, 'two': lambda _: self.rows()})
        self.assertEqual(result['dailyCoverage'], 'partial')
        self.assertEqual(result['weeklyCoverage'], 'complete')
        self.assertEqual(result['weeklyUpdatedAt'], previous['weeklyUpdatedAt'])

    def test_cooldown_migrates_legacy_429_and_does_not_slide(self):
        provider = Mock(return_value=self.rows())
        old = {'lastAttemptAt': r.iso(NOW), 'status': {'sourceResults': [{'source': 'arXiv', 'state': 'error', 'message': 'HTTPError: HTTP Error 429: Unknown Error', 'lastAttemptAt': r.iso(NOW)}]}}
        result = r.refresh(old, NOW + timedelta(minutes=1), {'arXiv': provider, 'other': lambda _: self.rows()})
        provider.assert_not_called()
        self.assertEqual(result['status']['state'], 'partial')
        source = result['status']['sourceResults'][0]
        self.assertEqual(source['state'], 'deferred')
        self.assertEqual(source['retryAfterAt'], r.iso(NOW + timedelta(hours=24)))
        again = r.refresh(result, NOW + timedelta(hours=1), {'arXiv': provider})
        provider.assert_not_called()
        self.assertEqual(again['status']['sourceResults'][0]['retryAfterAt'], source['retryAfterAt'])
        self.assertEqual(again['status']['state'], 'error')
        r.refresh(again, NOW + timedelta(hours=24), {'arXiv': provider})
        provider.assert_called_once()

    def test_explicit_cooldown_without_429(self):
        provider = Mock()
        old = {'status': {'sourceResults': [{'source': 'one', 'retryAfterAt': r.iso(NOW + timedelta(hours=1))}]}}
        result = r.refresh(old, NOW, {'one': provider})
        provider.assert_not_called()
        self.assertEqual(result['status']['sourceResults'][0]['state'], 'deferred')

    def test_429_stops_retry_and_records_cooldown(self):
        error = HTTPError('https://example.org', 429, 'rate limited', {}, None)
        with patch.object(r, 'urlopen', side_effect=error) as request, patch.object(r.time, 'sleep') as sleep:
            result = r.refresh({}, NOW, {'arXiv': lambda _: r.fetch('https://example.org')})
        request.assert_called_once()
        sleep.assert_not_called()
        self.assertEqual(result['status']['sourceResults'][0]['retryAfterAt'], r.iso(NOW + timedelta(hours=24)))

    def test_partial_insufficient_does_not_fabricate(self):
        previous = r.refresh({}, NOW, {'one': lambda _: self.rows()})
        for count in (0, 1, 2):
            result = r.refresh(previous, NOW + timedelta(days=1), {'one': fail, 'two': lambda _: self.rows()[:count]})
            self.assertEqual(result['daily'], previous['daily'])
            self.assertEqual(result['dailyUpdatedAt'], previous['dailyUpdatedAt'])
            self.assertEqual(result['status']['state'], 'warning')

    def test_partial_bootstrap(self):
        result = r.refresh({}, NOW, {'one': fail, 'two': lambda _: self.rows()})
        self.assertEqual(len(result['daily']), 3)
        self.assertEqual(result['status']['state'], 'partial')
        self.assertIsNone(result['lastCompleteDailyAt'])
        self.assertEqual(len(result['weekly']), 5)

    def test_insufficient(self):
        previous = r.refresh({}, NOW, {'one': lambda _: self.rows()})
        result = r.refresh(previous, NOW + timedelta(days=1), {'one': lambda _: [paper(1)]})
        self.assertEqual(result['daily'], previous['daily'])
        self.assertEqual(result['dailyUpdatedAt'], previous['dailyUpdatedAt'])
        self.assertEqual(result['weeklyUpdatedAt'], previous['weeklyUpdatedAt'])
        self.assertEqual(result['status']['state'], 'warning')

    def test_weekly_fixed_sample(self):
        result = r.refresh({}, NOW, {'one': lambda _: self.rows() + [paper(4, 'LLM cognitive simulation', days=8)]})
        self.assertEqual({x['id'] for x in result['weekly']}, set(r.DIRECTIONS))
        self.assertEqual([x['count'] for x in result['weekly']], sorted((x['count'] for x in result['weekly']), reverse=True))
        self.assertEqual(sum(x['count'] for x in result['weekly']), 3)
        self.assertEqual(result['dailyUpdatedAt'], r.iso(NOW))
        self.assertEqual(result['weeklyUpdatedAt'], r.iso(NOW))

    def test_all_failed_bootstrap(self):
        result = r.refresh({}, NOW, {'one': fail})
        self.assertEqual(result['daily'], [])
        self.assertEqual(result['weekly'], [])
        self.assertIsNone(result['dailyUpdatedAt'])
        self.assertEqual(result['status']['state'], 'error')


    def test_education_requires_psychological_process(self):
        self.assertIsNone(r.classify(paper(1, 'LLM education for nurses')))
        self.assertIsNone(r.classify(paper(2, 'LLM ophthalmic question answering', abstract='Patient education and readable information.')))
        self.assertEqual(r.classify(paper(3, 'LLM student metacognition and learning transfer')), 'education')

    def test_llm_must_be_primary(self):
        self.assertIsNone(r.classify(paper(1, 'Cognitive load in analytics', abstract='ChatGPT is mentioned in related work.')))
        self.assertEqual(r.classify(paper(2, 'Cognitive load in analytics', abstract='Large language models guide navigation. LLMs are evaluated for cognitive load.')), 'simulation')

    def test_ptsd_and_matching_signals(self):
        row = paper(1, 'LLM assessments of PTSD in cognitive therapy')
        self.assertEqual(r.classify(row), 'clinical')
        self.assertTrue(any('ptsd' in signal for signal in r.eligible([row], NOW)[0]['matchedSignals']))

    def test_versions_merge_before_recency_filter(self):
        old = paper('old', 'Original preprint', days=110, doi='10/example', type='preprint')
        new = paper('new', 'LLM mental health journal version', days=1, doi='10/example')
        self.assertEqual(r.eligible([new, old], NOW), [])

    def test_retrieved_version_dates_are_auditable(self):
        old = paper('old', 'Original title', days=30, doi='10/example', type='preprint')
        new = paper('new', 'LLM mental health journal version', days=1, doi='10/example')
        row = r.eligible([new, old], NOW)[0]
        self.assertEqual(row['publishedAt'], old['publishedAt'])
        self.assertEqual(row['recordPublishedAt'], new['publishedAt'])
        self.assertEqual(row['type'], 'paper')
        self.assertEqual(len(row['versions']), 2)

    def test_weekly_counts_have_readable_evidence(self):
        result = r.refresh({}, NOW, {'fixture': lambda _: self.rows()})
        self.assertEqual(result['weeklySample']['eligibleRecords'], 3)
        self.assertEqual(result['weeklySample']['weeklyRecords'], 3)
        for item in result['weekly']:
            self.assertEqual(item['count'], len(item['papers']))
            self.assertEqual(item['sourceIds'], [row['id'] for row in item['papers']])
            for row in item['papers']:
                self.assertTrue(row['url'].startswith('https://'))
                self.assertTrue(row['matchedSignals'])

    def test_screening_policy_change_rebuilds_weekly(self):
        previous = r.refresh({}, NOW, {'fixture': lambda _: self.rows()})
        previous['screeningVersion'] = 'old-policy'
        later = NOW + timedelta(days=1)
        result = r.refresh(previous, later, {'fixture': lambda _: self.rows()})
        self.assertEqual(result['weeklyUpdatedAt'], r.iso(later))


    def test_failed_policy_change_retries_weekly_in_same_week(self):
        previous = r.refresh({}, NOW, {'fixture': lambda _: self.rows()})
        previous['screeningVersion'] = previous['weeklyPolicyVersion'] = 'older'
        failed = r.refresh(previous, NOW + timedelta(hours=1), {'fixture': fail})
        recovered = r.refresh(failed, NOW + timedelta(hours=2), {'fixture': lambda _: self.rows()})
        self.assertEqual(recovered['weeklyUpdatedAt'], r.iso(NOW + timedelta(hours=2)))
        self.assertEqual(recovered['weeklyPolicyVersion'], r.SCREENING_VERSION)

if __name__ == '__main__':
    unittest.main()

class WeeklyRecoveryTests(unittest.TestCase):
    def test_missed_monday_catches_up(self):
        now=NOW+timedelta(days=2)
        old={'daily':[],'weekly':[{'id':'old'}],'weeklyUpdatedAt':r.iso(NOW-timedelta(days=7))}
        out=r.refresh(old,now,providers={'fixture':lambda _:[]})
        self.assertEqual(out['weeklyUpdatedAt'],r.iso(now))
        self.assertEqual(len(out['weekly']),5)
    def test_same_week_keeps_weekly_snapshot(self):
        now=NOW+timedelta(days=2)
        old={'daily':[],'weekly':[{'id':'previous'}],'weeklyUpdatedAt':r.iso(NOW),'screeningVersion':r.SCREENING_VERSION,'weeklyPolicyVersion':r.SCREENING_VERSION}
        out=r.refresh(old,now,providers={'fixture':lambda _:[]})
        self.assertEqual(out['weekly'],old['weekly'])
        self.assertEqual(out['weeklyUpdatedAt'],old['weeklyUpdatedAt'])
