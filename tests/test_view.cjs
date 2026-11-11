'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const view = require('../site/view-model.js');
const graph = JSON.parse(fs.readFileSync(path.join(__dirname,'../data/graph.json'),'utf8'));
const research = JSON.parse(fs.readFileSync(path.join(__dirname,'../data/research.json'),'utf8'));
test('weekly attention orders measured counts and preserves unknown as unknown',()=>{
 const result=view.weeklyDirections(research.directions,[{id:'clinical',count:3},{id:'simulation',count:8},{id:'measurement',count:2},{id:'methods',count:0},{id:'education',count:16}]);
 assert.deepEqual(result.map(x=>x.direction.id),['D5','D2','D3','D1','D4']);
 const missing=view.weeklyDirections(research.directions,[{id:'clinical',count:0}]);
 assert.equal(missing[0].direction.id,'D3');
 assert.equal(missing[1].live,undefined);
});
test('clinical view retains consent and its screening constraint',()=>{
 const filtered=view.networkSlice(graph,{domain:'clinical',edge:'all',query:''});
 assert.ok(filtered.nodes.some(n=>n.id==='F22'));
 assert.ok(filtered.edges.some(e=>e.source==='F22'&&e.target==='P09'&&e.type==='constraint'));
 assert.ok(!filtered.nodes.some(n=>n.id==='P14'));
 assert.ok(!filtered.nodes.some(n=>n.layer==='technology'&&!filtered.edges.some(e=>e.source===n.id||e.target===n.id)));
});
test('relation filter and JSON export slice preserve valid endpoints',()=>{
 for(const domain of ['all',...Object.keys(graph.metadata.domains)]){
  const filtered=view.networkSlice(graph,{domain,edge:'constraint',query:''});
  const ids=new Set(filtered.nodes.map(n=>n.id));
  assert.ok(filtered.edges.every(e=>e.type==='constraint'&&ids.has(e.source)&&ids.has(e.target)));
 }
 assert.deepEqual(view.networkSlice(graph,{domain:'all',edge:'all',query:'no-such-node-261111'}),{nodes:[],edges:[]});
});

test('old-policy counts are withheld until a matching snapshot exists',()=>{
 assert.deepEqual(view.weeklySnapshot({weeklyPolicyVersion:'older',weekly:[{id:'clinical',count:99}]}),[]);
 assert.equal(view.weeklySnapshot({weeklyPolicyVersion:view.screeningVersion,weekly:[{id:'clinical',count:0}]}).length,1);
});
