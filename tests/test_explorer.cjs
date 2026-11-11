'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const E=require('../site/explorer.js');
const root=path.join(__dirname,'..');
const read=name=>JSON.parse(fs.readFileSync(path.join(root,'data',name+'.json'),'utf8'));
const window={};
vm.runInNewContext(fs.readFileSync(path.join(root,'site/i18n.js'),'utf8'),{window});
const data={graph:read('graph'),research:read('research'),radar:{},i18n:window.ATLAS_I18N};
const ids=result=>Object.fromEntries(Object.entries(result.groups).map(([group,rows])=>[group,rows.map(row=>row.id)]));
const empty=result=>Object.values(result.groups).every(rows=>rows.length===0);
test('blank, common words, unrelated questions and word fragments produce no matches',()=>{
 for(const query of ['', '   ', 'How can I use LLM to do this?', 'quantum banana trombone', 'difficult privateering', '<img src=x onerror=alert(1)>']){
  assert.ok(empty(E.search(data,query)),query);
 }
 assert.ok(empty(E.search(data,{toString(){throw Error('coercion');}})));
 assert.ok(empty(E.search(null,'privacy')));
});
test('equivalent Chinese and English measurement questions identify the same research paths',()=>{
 const zh=E.search(data,'如何检验跨文化量表的测量不变性？');
 const en=E.search(data,'How can I test measurement invariance across cultures and validate a psychological scale?');
 assert.deepEqual(ids(zh),ids(en));
 for(const [group,id] of [['task','P02'],['technology','T12'],['function','F17'],['challenges','C5'],['sources','psychometrics-lifecycle']]){
  assert.ok(zh.groups[group].some(row=>row.id===id),group+':'+id);
 }
 assert.deepEqual(zh.terms.map(t=>t.key),['measurement','validity','fairness']);
});
test('privacy and qualitative coding expose research tasks, privacy controls and original references',()=>{
 const result=E.search(data,'如何审计访谈编码中的隐私风险？');
 for(const [group,id] of [['task','P06'],['technology','T11'],['function','F04'],['challenges','C7'],['challenges','C8'],['sources','qualitative-review']]){
  assert.ok(result.groups[group].some(row=>row.id===id),group+':'+id);
 }
});
test('participant simulation and model drift questions retain their specific research context',()=>{
 const simulation=E.search(data,"How can I evaluate synthetic participants' external validity?");
 assert.ok(simulation.groups.task.some(row=>['P03','P04'].includes(row.id)));
 for(const [group,id] of [['technology','T18'],['function','F12'],['challenges','C2'],['sources','simulator-guide']]){
  assert.ok(simulation.groups[group].some(row=>row.id===id),group+':'+id);
 }
 const drift=E.search(data,'模型版本更新后如何复现和监测漂移？');
 for(const [group,id] of [['task','P15'],['technology','T17'],['function','F23'],['challenges','C3'],['sources','guide-llm']]){
  assert.ok(drift.groups[group].some(row=>row.id===id),group+':'+id);
 }
});
test('one-hop graph expansion and source references retain exact provenance and rank after direct matches',()=>{
 const fixture={
  graph:{nodes:[
   {id:'A',layer:'technology',title:'Privacy controls',sourceIds:['context']},
   {id:'B',layer:'function',title:'Metalwork'},
   {id:'C',layer:'task',title:'Basketweaving'}
  ],edges:[{id:'A-B',source:'A',target:'B',type:'constraint'},{id:'B-C',source:'B',target:'C',type:'support'}]},
  research:{challenges:[],sources:[{id:'context',title:'Context reference',url:'https://example.org/context'},{id:'direct',title:'Privacy research',url:'https://example.org/direct'}]},
  radar:{daily:[{id:'context',title:'Duplicate radar record'}],weekly:[]},i18n:{}
 };
 const result=E.search(fixture,'privacy');
 assert.deepEqual(result.groups.task,[]);
 assert.deepEqual(result.groups.function.map(row=>row.id),['B']);
 const related=result.groups.function[0];
 assert.deepEqual(related.matchedTerms,[]);
 assert.equal(related.relatedVia[0].edgeId,'A-B');
 assert.equal(related.relatedVia[0].type,'constraint');
 assert.equal(related.relatedVia[0].id,'A');
 assert.equal(related.relatedVia[0].matchedTerms[0].key,'privacy');
 assert.deepEqual(result.groups.sources.map(row=>row.id),['direct','context']);
 const source=result.groups.sources[1];
 assert.equal(source.relatedVia[0].kind,'source_reference');
 assert.equal(source.relatedVia[0].field,'sourceIds');
 assert.equal(source.relatedVia[0].id,'A');
 assert.ok(result.groups.sources[0].score>source.score);
 assert.equal(E.sourceRows(fixture).filter(row=>row.id==='context').length,1);
 assert.equal(E.sourceRows(fixture).find(row=>row.id==='context').title,'Context reference');
});
test('normalization, bounds, determinism and immutable source data hold',()=>{
 const before=JSON.stringify(data);
 const a=E.search(data,'CROSS—CULTURAL measurement invariance');
 const b=E.search(data,'cross cultural measurement invariance');
 assert.deepEqual(ids(a),ids(b));
 assert.deepEqual(E.search(data,'privacy'),E.search(data,'privacy privacy privacy'));
 assert.ok(empty(E.search(data,'x'.repeat(E.limits.question)+' privacy')));
 assert.equal(JSON.stringify(data),before);
 assert.deepEqual(E.search(data,'model drift'),E.search(data,'model drift'));
 for(const rows of Object.values(a.groups)){
  assert.ok(rows.length<=E.limits.perGroup);
  assert.equal(new Set(rows.map(row=>row.id)).size,rows.length);
 }
 assert.ok(!E.search(data,'uncertainty').terms.some(term=>term.key==='qualitative'));
});
test('a clinical query returns only existing research records and their matching provenance',()=>{
 const result=E.search(data,'I feel depressed and anxious; can you diagnose my mental health symptoms?');
 assert.ok(result.groups.challenges.length>0);
 const nodeIds=new Set(data.graph.nodes.map(row=>row.id));
 const challengeIds=new Set(data.research.challenges.map(row=>row.id));
 const sourceIds=new Set(E.sourceRows(data).map(row=>row.id));
 for(const [group,rows] of Object.entries(result.groups)){
  for(const row of rows){
   assert.ok((group==='sources'?sourceIds:group==='challenges'?challengeIds:nodeIds).has(row.id));
   assert.ok(row.matchedTerms.length||row.relatedVia?.length);
  }
 }
});

test('generic model names and statistical heterogeneity do not create unrelated research topics',()=>{
 assert.ok(empty(E.search(data,'large language models')));
 assert.ok(!E.search(data,'privacy risk').terms.some(term=>term.key==='safety'));
 assert.ok(!E.search(data,'异质性和不确定性').terms.some(term=>term.key==='qualitative'));
 assert.ok(E.search(data,'跨语言效度').terms.some(term=>term.key==='fairness'));
});
test('malformed indexed fields never trigger implicit string conversion',()=>{
 const bad={toString(){throw Error('Unexpected coercion');}};
 const result=E.search({graph:{nodes:[{id:'X',layer:'task',title:bad,description:null}],edges:[]},research:{challenges:[],sources:[{id:'S',title:[]}]}},'privacy');
 assert.ok(empty(result));
});

test('version and prompt changes retain the dedicated reproducibility function',()=>{
 const zh='模型版本更新和提示变化后，如何建立复现基准，监测漂移并报告多次运行的方差？';
 const en='After model version updates and prompt changes, how can I build a reproducibility benchmark, monitor drift, and report variance across repeated runs?';
 const a=E.search(data,zh),b=E.search(data,en);
 assert.equal(a.groups.function[0].id,'F23');
 assert.equal(b.groups.function[0].id,'F23');
 assert.ok(a.groups.task.some(row=>row.id==='P15'));
 assert.deepEqual(a.terms.map(term=>term.key),b.terms.map(term=>term.key));
});
test('interview privacy audit includes the dedicated consent and privacy function',()=>{
 const result=E.search(data,'如何进行访谈隐私审计');
 assert.ok(result.groups.function.some(row=>row.id==='F22'));
 assert.ok(result.groups.function.some(row=>row.id==='F04'));
});
test('the bilingual scale example activates equivalent controlled topics',()=>{
 const zh=E.search(data,window.ATLAS_I18N.ui.zh.explorerExampleMeasurement);
 const en=E.search(data,window.ATLAS_I18N.ui.en.explorerExampleMeasurement);
 assert.deepEqual(zh.terms.map(term=>term.key),en.terms.map(term=>term.key));
 assert.ok(zh.terms.some(term=>term.key==='validity'));
});
