'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname,'..');
const window={};
vm.runInNewContext(fs.readFileSync(path.join(root,'site/i18n.js'),'utf8'),{window});
const dictionary=window.ATLAS_I18N;
const load=name=>JSON.parse(fs.readFileSync(path.join(root,'data',name+'.json'),'utf8'));
test('every interface binding has complete Chinese and English text',()=>{
 assert.deepEqual(Object.keys(dictionary.ui.zh).sort(),Object.keys(dictionary.ui.en).sort());
 const html=fs.readFileSync(path.join(root,'site/index.html'),'utf8');
 for(const match of html.matchAll(/data-i18n(?:-placeholder|-aria|-title)?="([^"]+)"/g)){
  for(const locale of ['zh','en'])assert.ok(dictionary.ui[locale][match[1]],match[1]);
 }
 for(const value of Object.values(dictionary.ui.en))assert.doesNotMatch(value,/[\u4e00-\u9fff]/u);
 assert.ok(!html.includes('READ THE MAP'));
 assert.ok(!html.includes('AUTOMATIC ≠ VERIFIED'));
 assert.match(dictionary.ui.zh.safetyBody,/仅供研究使用和分享，目前不提供任何心理健康相关服务/);
 assert.match(html,/mailto:ruyiw20@gmail\.com/);
});
test('translations cover every graph, direction and challenge record',()=>{
 const graph=load('graph'),research=load('research');
 assert.deepEqual(Object.keys(dictionary.graph).sort(),graph.nodes.map(node=>node.id).sort());
 for(const node of graph.nodes){
  assert.ok(node.en);
  for(const key of ['description','metric','risk']){
   assert.ok(dictionary.graph[node.id][key],node.id+':'+key);
   assert.doesNotMatch(dictionary.graph[node.id][key],/[\u4e00-\u9fff]/u);
  }
 }
 for(const [kind,keys]of [['directions',['title','question','methods']],['challenges',['title','description','question','test']]]){
  assert.deepEqual(Object.keys(dictionary[kind]).sort(),research[kind].map(row=>row.id).sort());
  for(const row of research[kind])for(const key of keys)assert.ok(dictionary[kind][row.id][key],row.id+':'+key);
 }
});
