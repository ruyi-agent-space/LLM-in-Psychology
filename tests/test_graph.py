import json
from pathlib import Path
import unittest

ROOT=Path(__file__).resolve().parents[1]
class GraphTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.g=json.loads((ROOT/'data/graph.json').read_text())
        cls.r=json.loads((ROOT/'data/research.json').read_text())
        cls.by={n['id']:n for n in cls.g['nodes']}
    def test_unique_connected_nodes(self):
        self.assertEqual(len(self.g['nodes']),60)
        self.assertEqual(len(self.by),60)
        self.assertEqual(len({e['id'] for e in self.g['edges']}),len(self.g['edges']))
        used={x for e in self.g['edges'] for x in [e['source'],e['target']]}
        self.assertEqual(used,set(self.by))
    def test_edges_are_layered_and_hypotheses(self):
        levels={'technology':0,'function':1,'task':2}
        for e in self.g['edges']:
            self.assertNotEqual(e['source'],e['target'])
            self.assertEqual(levels[self.by[e['source']]['layer']]+1,levels[self.by[e['target']]['layer']])
            self.assertIn(e['type'],['support','constraint'])
            self.assertEqual(e['evidence'],'editorial_hypothesis')
    def test_every_function_has_technology_and_every_task_function(self):
        for n in self.by.values():
            if n['layer']!='technology':
                self.assertTrue(any(e['target']==n['id'] and e['type']=='support' for e in self.g['edges']),n['id'])
    def test_source_and_domain_integrity(self):
        ids={s['id'] for s in self.r['sources']}
        for n in self.by.values():
            self.assertTrue(set(n['sourceIds']).issubset(ids))
            self.assertTrue(set(n['domains']).issubset(self.g['metadata']['domains']))
        for row in self.r['directions']+self.r['challenges']:
            self.assertTrue(set(row['source_ids']).issubset(ids))
        self.assertEqual(len(self.r['directions']),5)
        self.assertEqual(len(self.r['challenges']),10)
    def test_date_provenance(self):
        for s in self.r['sources']:
            self.assertTrue(s['url'].startswith('https://'))
            self.assertTrue(s['date_note'])
            self.assertLessEqual(s['date'],self.r['window_end'])
            if s['window']=='recent':self.assertGreaterEqual(s['date'],self.r['window_start'])
        self.assertEqual(sum(s['window']=='recent' for s in self.r['sources']),11)
    def test_browser_wrappers_match(self):
        for name,var in [('graph','GRAPH_DATA'),('research','RESEARCH_DATA'),('radar','RADAR_DATA')]:
            js=(ROOT/f'site/{name}-data.js').read_text()
            content=js.removeprefix(f'window.{var} = ').strip().removesuffix(';')
            self.assertEqual(json.loads(content),json.loads((ROOT/f'data/{name}.json').read_text()))
    def test_no_private_inputs_or_remote_runtime(self):
        html=(ROOT/'site/index.html').read_text()
        self.assertNotIn('type="password"',html)
        self.assertNotIn('https://fonts.',html)
        self.assertNotIn('fetch(', (ROOT/'site/app.js').read_text())
        self.assertNotIn('PUBLIC ·',html)

    def test_context_is_selected_and_relationship_evidence_is_explicit(self):
        ids = {source['id'] for source in self.r['sources']}
        technology_sources = {tuple(n['sourceIds']) for n in self.g['nodes'] if n['layer'] == 'technology'}
        self.assertGreater(len(technology_sources), 1)
        self.assertIn('clinical', self.by['F22']['domains'])
        for edge in self.g['edges']:
            self.assertTrue(edge['rationale'])
            self.assertEqual(edge['relationshipEvidence'], 'unverified')
            self.assertTrue(set(edge['contextSourceIds']).issubset(ids))
            if edge['contextSourceIds']:
                self.assertTrue(edge['contextLocation'])
        self.assertTrue(self.by['P14']['evidenceGap'])

    def test_challenges_are_researchable_and_source_dates_disambiguated(self):
        for challenge in self.r['challenges']:
            self.assertTrue(challenge['question'])
            self.assertTrue(challenge['test'])
        dual = next(source for source in self.r['sources'] if source['id'] == 'dual-validity')
        self.assertLess(dual['preprint_first_published'], self.r['window_start'])
        self.assertGreater(dual['date'], self.r['window_start'])

if __name__=='__main__':unittest.main()
