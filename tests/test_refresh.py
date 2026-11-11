import importlib.util
from pathlib import Path
import unittest
from unittest.mock import patch
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
        return [paper(1), paper(2, 'ChatGPT for personality measurement'), paper(3, 'Large language models in education')]

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
        for title, theme in [('LLM theory of mind', 'simulation'), ('LLM education', 'education'), ('LLM psychometrics', 'measurement'), ('LLM mental health', 'clinical')]:
            self.assertEqual(r.classify(paper(1, title)), theme)

    def test_dates(self):
        self.assertEqual(len(r.eligible([paper(1, days=-1), paper(2, days=91), paper(3, publishedAt=None), paper(4, days=90)], NOW)), 1)
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
        for providers in [{'one': fail, 'two': lambda _: self.rows()}, {'one': fail}]:
            result = r.refresh(previous, NOW + timedelta(days=7), providers)
            for key in ('daily', 'weekly', 'dailyUpdatedAt', 'weeklyUpdatedAt'):
                self.assertEqual(previous[key], result[key])
            self.assertNotEqual(previous['lastAttemptAt'], result['lastAttemptAt'])
            self.assertIn(result['status']['state'], ['warning', 'error'])

    def test_partial_bootstrap(self):
        result = r.refresh({}, NOW, {'one': fail, 'two': lambda _: self.rows()})
        self.assertEqual(len(result['daily']), 3)
        self.assertEqual(result['status']['state'], 'warning')
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
        self.assertEqual([x['id'] for x in result['weekly']], list(r.DIRECTIONS))
        self.assertEqual(sum(x['count'] for x in result['weekly']), 3)
        self.assertEqual(result['dailyUpdatedAt'], r.iso(NOW))
        self.assertEqual(result['weeklyUpdatedAt'], r.iso(NOW))

    def test_all_failed_bootstrap(self):
        result = r.refresh({}, NOW, {'one': fail})
        self.assertEqual(result['daily'], [])
        self.assertEqual(result['weekly'], [])
        self.assertIsNone(result['dailyUpdatedAt'])
        self.assertEqual(result['status']['state'], 'error')

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
        old={'daily':[],'weekly':[{'id':'previous'}],'weeklyUpdatedAt':r.iso(NOW)}
        out=r.refresh(old,now,providers={'fixture':lambda _:[]})
        self.assertEqual(out['weekly'],old['weekly'])
        self.assertEqual(out['weeklyUpdatedAt'],old['weeklyUpdatedAt'])
