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
        self.assertEqual(sum(s['window']=='recent' for s in self.r['sources']),8)
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
if __name__=='__main__':unittest.main()
