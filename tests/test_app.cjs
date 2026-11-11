'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname,'..');
function setup(initialLanguage='zh'){
  const elements = new Map();
  const preferences = new Map([['psychology-atlas-language',initialLanguage]]);
  let nodes=[], related=[], exported=null;
  class Element{
    constructor(id){this.id=id;this.dataset={};this.style={};this.handlers={};this.classList={toggle(){}};this.hidden=false;}
    set innerHTML(value){
      this.html=value;
      if(this.id==='networkSvg') nodes=[...value.matchAll(/<g class="graph-node[^>]*data-id="([^"]+)"/g)].map(match=>{const node=new Element(match[1]);node.dataset.id=match[1];return node;});
      if(this.id==='nodeDetail') related=[...value.matchAll(/data-select="([^"]+)"/g)].map(match=>{const button=new Element(match[1]);button.dataset.select=match[1];return button;});
    }
    get innerHTML(){return this.html||'';}
    setAttribute(){} removeAttribute(){} scrollIntoView(){} focus(){}
    addEventListener(name,handler){this.handlers[name]=handler;}
    click(){exported=this;}
  }
  const get=id=>{if(!elements.has(id))elements.set(id,new Element(id));return elements.get(id);};
  const all=selector=>selector==='.graph-node'?nodes:selector==='[data-select]'?related:[];
  const document={
    documentElement:{lang:''}, title:'',
    querySelector(selector){
      if(selector.startsWith('#'))return get(selector.slice(1));
      if(selector==='[data-select]')return related[0]||null;
      const selected=selector.match(/^\.graph-node\[data-id="([^"]+)"\]$/);
      return selected?nodes.find(node=>node.dataset.id===selected[1])||null:null;
    },
    querySelectorAll:all,
    createElement:()=>new Element('download')
  };
  const load=name=>JSON.parse(fs.readFileSync(path.join(root,'data',name+'.json'),'utf8'));
  const window={GRAPH_DATA:load('graph'),RESEARCH_DATA:load('research'),RADAR_DATA:load('radar'),addEventListener(){}};
  let blob;
  const context=vm.createContext({window,document,location:{hash:'#network',protocol:'https:'},localStorage:{getItem:key=>preferences.get(key),setItem:(key,value)=>preferences.set(key,value)},setTimeout:()=>0,Blob,URL:{createObjectURL(value){blob=value;return 'blob:test';},revokeObjectURL(){}}});
  vm.runInContext(fs.readFileSync(path.join(root,'site/view-model.js'),'utf8'),context);
  vm.runInContext(fs.readFileSync(path.join(root,'site/i18n.js'),'utf8'),context);
  vm.runInContext(fs.readFileSync(path.join(root,'site/app.js'),'utf8'),context);
  return {get,language:window.PSYCHOLOGY_ATLAS.setLanguage,document,preferences,clickNode:id=>nodes.find(node=>node.dataset.id===id).handlers.click(),related:()=>related,download:()=>({anchor:exported,blob})};
}
test('real app node selection binds related buttons and renders relationship limits',()=>{
  const app=setup();
  app.clickNode('T06');
  assert.match(app.get('nodeDetail').innerHTML,/结构化输出与工具/);
  assert.match(app.get('nodeDetail').innerHTML,/编辑映射/);
  const button=app.related().find(item=>item.dataset.select==='F03');
  assert.equal(typeof button.onclick,'function');
  button.onclick({preventDefault(){}});
  assert.match(app.get('nodeDetail').innerHTML,/结构化信息提取/);
});
test('filtering clears hidden selection and export contains the active valid network',async()=>{
  const app=setup();
  app.clickNode('P09');
  app.get('domainFilter').onchange({target:{value:'education'}});
  assert.equal(app.get('nodeDetail').hidden,true);
  app.get('export').onclick();
  const download=app.download();
  assert.equal(download.anchor.download,'psychology-network.json');
  const payload=JSON.parse(await download.blob.text());
  assert.equal(payload.filters.domain,'education');
  assert.ok(!payload.nodes.some(node=>node.id==='P09'));
  const ids=new Set(payload.nodes.map(node=>node.id));
  assert.ok(payload.edges.every(edge=>ids.has(edge.source)&&ids.has(edge.target)));
});

test('English covers selected nodes, research cards, status and exported display labels',async()=>{
 const app=setup('en');
 assert.equal(app.document.documentElement.lang,'en');
 const graph=JSON.parse(fs.readFileSync(path.join(root,'data/graph.json'),'utf8'));
 for(const node of graph.nodes){
  app.clickNode(node.id);
  assert.doesNotMatch(app.get('nodeDetail').innerHTML,/[\u4e00-\u9fff]/u,node.id);
 }
 for(const id of ['weeklyList','dailyList','challengeList','weeklyStatus','dailyStatus']){
  assert.doesNotMatch(app.get(id).innerHTML+(app.get(id).textContent||''),/[\u4e00-\u9fff]/u,id);
 }
 app.get('export').onclick();
 const payload=JSON.parse(await app.download().blob.text());
 assert.equal(payload.view.language,'en');
 assert.match(payload.view.nodeLabels.T01.description,/language generation/);
 app.language('zh');
 assert.equal(app.document.documentElement.lang,'zh-CN');
 assert.equal(app.preferences.get('psychology-atlas-language'),'zh');
});
