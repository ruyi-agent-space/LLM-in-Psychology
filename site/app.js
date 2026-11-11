(function(){
  'use strict';
  const G=window.GRAPH_DATA,R=window.RESEARCH_DATA,Q=window.RADAR_DATA,I=window.ATLAS_I18N,V=window.ATLAS_VIEW,E=window.ATLAS_EXPLORER;
  const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
  const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeUrl=u=>/^https:\/\//.test(String(u||''))?u:'#';
  const link=(url,title)=>`<a href="${esc(safeUrl(url))}" target="_blank" rel="noopener noreferrer">${esc(title)} ↗</a>`;
  const sourceBy=Object.fromEntries(R.sources.map(s=>[s.id,s])),byId=Object.fromEntries(G.nodes.map(n=>[n.id,n]));
  const layers=['technology','function','task'];
  const colors={technology:['#eff5f5','#9fc3c8','#39788a'],function:['#f0f5ed','#afc8a3','#49774f'],task:['#f3f1f8','#c6bfdc','#7d6aa0']};
  const storageKey='psychology-atlas-language';
  let initialLanguage='zh';
  try{if(localStorage.getItem(storageKey)==='en')initialLanguage='en';}catch{}
  const state={domain:'all',query:'',edge:'all',selected:null,zoom:1,language:initialLanguage};
  const t=(key,values={})=>{
    const value=I.ui[state.language][key];
    if(typeof value!=='string')throw new Error('Missing interface translation: '+key);
    return value.replace(/\{(\w+)\}/g,(_,name)=>String(values[name]??''));
  };
  const colon=()=>state.language==='zh'?'：':': ';
  const day=x=>x?String(x).slice(0,10):t('snapshotWaiting');
  const stamp=x=>x?String(x).replace('T',' ').replace('Z',' UTC'):t('snapshotWaiting');
  const nodeText=(node,key)=>state.language==='en'?(key==='title'?node.en:I.graph[node.id][key]):node[key];
  const researchText=(row,kind,key)=>state.language==='en'?I[kind][row.id][key]:row[key];
  const sources=ids=>(ids||[]).map(id=>sourceBy[id]).filter(Boolean).map(s=>link(s.url,s.title)).join('<br>');
  const searchGraph={...G,nodes:G.nodes.map(n=>({...n,searchText:Object.values(I.graph[n.id]).join(' ')}))};
  function slice(){
    const result=V.networkSlice(searchGraph,state);
    return {nodes:result.nodes.map(n=>byId[n.id]),edges:result.edges};
  }
  function route(){
    let id=location.hash.slice(1)||'network';
    if(!['network','weekly','daily','challenges','evidence'].includes(id))id='network';
    $$('.workspace').forEach(el=>el.classList.toggle('active',el.id===id));
    $$('.navigation a').forEach(a=>{
      const active=a.hash==='#'+id;
      a.classList.toggle('active',active);
      if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
    });
  }
  function selectedPath(edges){
    const ids=new Set();
    if(!state.selected)return ids;
    ids.add(state.selected);
    edges.forEach(e=>{if(e.source===state.selected||e.target===state.selected){ids.add(e.source);ids.add(e.target);}});
    if(byId[state.selected]?.layer!=='function'){
      const direct=new Set(ids);
      edges.forEach(e=>{
        if(byId[state.selected].layer==='technology'&&direct.has(e.source))ids.add(e.target);
        if(byId[state.selected].layer==='task'&&direct.has(e.target))ids.add(e.source);
      });
    }
    return ids;
  }
  function draw(){
    const {nodes,edges}=slice(),svg=$('#networkSvg'),positions={};
    if(state.selected&&!nodes.some(n=>n.id===state.selected)){state.selected=null;$('#nodeDetail').hidden=true;}
    const width=290,height=31,W=1300,H=Math.max(...layers.map(l=>nodes.filter(n=>n.layer===l).length),1)*43+88,xs=[32,505,978];
    layers.forEach((layer,col)=>{
      const group=nodes.filter(n=>n.layer===layer),space=(H-100)/Math.max(group.length,1);
      group.forEach((n,index)=>positions[n.id]={x:xs[col],y:68+index*space+(space-height)/2});
    });
    const active=selectedPath(edges),hasSelection=state.selected&&active.size>0;
    svg.setAttribute('viewBox',`0 0 ${W} ${H}`);svg.style.width=(state.zoom*100)+'%';svg.style.minWidth=(900*state.zoom)+'px';
    let out='<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10Z" fill="#7da897"/></marker></defs>';
    layers.forEach((layer,index)=>{
      out+=`<text x="${xs[index]}" y="29" fill="${colors[layer][2]}" font-size="11" font-weight="600" letter-spacing="1.2">0${index+1} / ${esc(t(layer))}</text><text x="${xs[index]+width}" y="29" fill="#85938b" font-size="10" text-anchor="end">${nodes.filter(n=>n.layer===layer).length}</text><line x1="${xs[index]}" y1="44" x2="${xs[index]+width}" y2="44" stroke="#dce5dc"/>`;
    });
    edges.forEach(e=>{
      const a=positions[e.source],b=positions[e.target],highlight=hasSelection&&active.has(e.source)&&active.has(e.target);
      out+=`<path class="edge ${e.type} ${hasSelection?(highlight?'highlight':'dimmed'):''}" d="M${a.x+width} ${a.y+height/2} C${a.x+width+90} ${a.y+height/2} ${b.x-90} ${b.y+height/2} ${b.x} ${b.y+height/2}" marker-end="url(#arrow)"/>`;
    });
    nodes.forEach(n=>{
      const p=positions[n.id],c=colors[n.layer],degree=edges.filter(e=>e.source===n.id||e.target===n.id).length,title=nodeText(n,'title');
      out+=`<g class="graph-node ${state.selected===n.id?'selected':''} ${hasSelection&&!active.has(n.id)?'dimmed':''}" tabindex="0" role="button" data-id="${esc(n.id)}" aria-label="${esc(t('inspectNode',{title}))}" aria-pressed="${state.selected===n.id}"><title>${esc(nodeText(n,'description'))}</title><rect x="${p.x}" y="${p.y}" width="${width}" height="${height}" rx="6" fill="${c[0]}" stroke="${c[1]}"/><circle cx="${p.x+13}" cy="${p.y+height/2}" r="3" fill="${c[2]}"/><text x="${p.x+25}" y="${p.y+20}" fill="#274238" font-size="${state.language==='en'?11:12}">${esc(title)}</text><text x="${p.x+width-11}" y="${p.y+20}" fill="${c[2]}" text-anchor="end" font-size="9">${degree}</text></g>`;
    });
    if(!nodes.length)out+=`<text x="650" y="80" text-anchor="middle" fill="#627673" font-size="15">${esc(t('emptySearch'))}</text>`;
    svg.innerHTML=out;
    $('#filterCount').textContent=t('nodeCount',{nodes:nodes.length,edges:edges.length});
    $$('.graph-node').forEach(g=>{
      g.addEventListener('click',()=>selectNode(g.dataset.id));
      g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();selectNode(g.dataset.id);}});
    });
  }
  function renderDetail(id){
    const n=byId[id],edges=slice().edges.filter(e=>e.source===id||e.target===id);
    const contexts=n.evidenceGap?`<p class="caution">${esc(t('developmentGap'))}</p>`:'';
    $('#nodeDetail').hidden=false;
    $('#nodeDetail').innerHTML=`<button class="close-detail" id="closeDetail" aria-label="${esc(t('closeDetail'))}">×</button><p class="eyebrow">${esc(t(n.layer))} / ${esc(n.id)} / ${esc(t('nodeContext'))}</p><h2>${esc(nodeText(n,'title'))}</h2><div class="detail-columns"><div><h4>${esc(t('scopeEvaluation'))}</h4><p>${esc(nodeText(n,'description'))}</p><p><strong>${esc(t('evaluationMetric'))}${colon()}</strong>${esc(nodeText(n,'metric'))}</p><div>${n.domains.map(d=>`<span class="pill">${esc(I.domains[state.language][d])}</span>`).join('')}</div></div><div><h4>${esc(t('evaluationFocus'))}</h4><p>${esc(nodeText(n,'risk'))}</p><p>${esc(t('contextStatement'))}</p>${n.crossCutting?`<p>${esc(t('crossCutting'))}</p>`:''}${contexts}</div><div><h4>${esc(t('sourceContext'))}</h4><p>${sources(n.sourceIds)}</p></div></div><h4 class="connection-heading">${esc(t('relationCount',{count:edges.length}))}</h4><div>${edges.map(e=>{
      const other=e.source===id?e.target:e.source,values={source:nodeText(byId[e.source],'title'),target:nodeText(byId[e.target],'title')};
      return `<details class="connection"><summary>${esc(t(e.source===id?'pointsTo':'comesFrom'))} <button class="node-link" data-select="${other}">${esc(nodeText(byId[other],'title'))}</button> · ${esc(t(e.type==='constraint'?'constraint':'support'))}</summary><p>${esc(t(e.type==='constraint'?'relationConstraint':'relationSupport',values))}</p><p>${e.contextSourceIds?.length?`${esc(t('relationReferences'))}${colon()}<br>${sources(e.contextSourceIds)}<br>${esc(e.contextLocation)}`:esc(t('relationPending'))}</p></details>`;
    }).join('')}</div>`;
    $('#closeDetail').onclick=()=>{state.selected=null;$('#nodeDetail').hidden=true;draw();};
    $$('[data-select]').forEach(button=>button.onclick=e=>{e.preventDefault();e.stopPropagation?.();selectNode(button.dataset.select);});
  }
  function selectNode(id,focus=true){
    state.selected=id;draw();
    if(state.selected)renderDetail(id);
    if(focus)$(`.graph-node[data-id="${id}"]`)?.focus({preventScroll:true});
  }
  function refreshSelection(){draw();if(state.selected)renderDetail(state.selected);}
  function signal(value){
    if(value==='LLM-primary:title')return t('signalTitle');
    if(value==='LLM-primary:abstract>=2')return t('signalAbstract');
    const names={simulation:'cognitive',clinical:'clinical',measurement:'measurement',methods:'methods',education:'education'},parts=String(value).split(':');
    return names[parts[0]]?I.domains[state.language][names[parts[0]]]+': '+parts.slice(1).join(':'):String(value);
  }
  function renderWeekly(){
    $('#weeklyList').innerHTML=V.weeklyDirections(R.directions,V.weeklySnapshot(Q)).map(({direction:d,live},index)=>`<article class="weekly-card"><div class="card-index"><strong>${String(index+1).padStart(2,'0')}</strong><span>${esc(t(Number.isInteger(live?.count)?'sampleAttention':'curatedDirection'))}</span></div><h2>${esc(researchText(d,'directions','title'))}</h2><p>${esc(researchText(d,'directions','question'))}</p><p><strong>${esc(t('researchApproach'))}${colon()}</strong>${esc(researchText(d,'directions','methods'))}</p><p>${sources(d.source_ids)}</p><div class="signal">${esc(Number.isInteger(live?.count)?t('countSignal',{count:live.count}):t('countPending'))}${Q.weeklyCoverage==='partial'?' '+esc(t('countPartial')):''}</div>${live?.papers?.length?`<details class="signal-papers"><summary>${esc(t('inspectPapers',{count:live.papers.length}))}</summary>${live.papers.map(p=>`<p>${link(p.url,p.title)}<br><small>${esc(t('earliestDate'))} ${esc(day(p.publishedAt))} · ${esc((p.matchedSignals||[]).map(signal).join(' / '))}</small></p>`).join('')}</details>`:Number.isInteger(live?.count)&&live.count===0?`<p>${esc(t('noMatches'))}</p>`:''}</article>`).join('');
    $('#weeklyDate').textContent=day(Q.weeklyUpdatedAt);
  }
  function renderDaily(){
    $('#dailyList').innerHTML=(Q.daily||[]).map((p,index)=>`<article class="daily-card"><div class="card-index"><strong>${String(index+1).padStart(2,'0')}</strong><span class="source-type">${esc(t(p.type==='preprint'?'preprint':p.type==='paper'?'paper':'readingCandidate'))}</span></div><h2>${link(p.url,p.title)}</h2><div class="dates">${esc(t('source'))}${colon()}${esc(p.source||'—')}<br>${esc(t('earliestDate'))}${colon()}${esc(day(p.publishedAt))}${p.recordPublishedAt&&day(p.recordPublishedAt)!==day(p.publishedAt)?`<br>${esc(t('linkedVersion'))}${colon()}${esc(day(p.recordPublishedAt))}`:''}${p.updatedAt?`<br>${esc(t('revised'))}${colon()}${esc(day(p.updatedAt))}`:''}</div><p>${esc(t('dailyReason'))}</p>${p.matchedSignals?.length?`<details class="reading-signals"><summary>${esc(t('screeningSignals'))}</summary><p>${esc(p.matchedSignals.map(signal).join(' / '))}</p></details>`:''}<p class="caution">${esc(t('metadataChecks'))}</p>${link(p.url,t('openOriginal'))}</article>`).join('')||`<div class="note">${esc(t('emptyReadings'))}</div>`;
    $('#dailyDate').textContent=day(Q.dailyUpdatedAt);
  }
  function freshness(kind){
    const success=Q[kind+'UpdatedAt'],age=success?(Date.now()-Date.parse(success))/86400000:Infinity;
    const stale=kind==='daily'?day(success)!==new Date().toISOString().slice(0,10):age>8;
    const outdated=Q[kind+'PolicyVersion']!==V.screeningVersion,status=Q.status?.state;
    const statusKeys={ok:'statusOk',partial:'statusPartial',error:'statusError',warning:'statusWarning'};
    const parts=[t(statusKeys[status]||'statusPending'),t('latestAttempt',{date:stamp(Q.lastAttemptAt)})];
    if(outdated)parts.push(t('oldPolicy'));
    if(stale)parts.push(t(kind==='daily'?'dailyStale':'weeklyStale',{date:day(success)}));
    if(Q[kind+'Coverage']==='partial')parts.push(t('lastComplete',{date:stamp(Q['lastComplete'+kind[0].toUpperCase()+kind.slice(1)+'At'])}));
    const sourceStates={ok:'sourceOk',deferred:'sourceDeferred',error:'sourceError'};
    parts.push((Q.status?.sourceResults||[]).map(s=>s.source+': '+t(sourceStates[s.state]||'sourcePending')).join(' · '));
    const sample=Q[kind+'Sample'];
    if(sample){
      parts.push(t('sampleCoverage',{fetched:sample.recordsFetched,eligible:kind==='weekly'?(sample.weeklyRecords??sample.eligibleRecords):sample.eligibleRecords}));
      (sample.sourceResults||[]).filter(s=>s.limitReached).forEach(s=>parts.push(t('sourceLimit',{source:s.source})));
    }
    parts.push(t(location.protocol==='file:'?'localSnapshot':'hostedSnapshot'));
    const el=$('#'+kind+'Status');el.textContent=parts.filter(Boolean).join(' ');el.classList.toggle('good',!stale&&!outdated&&status==='ok');
  }
  function renderChallenges(){
    const open=new Set($$('#challengeList details[open]').map(el=>el.dataset.challenge));
    $('#challengeList').innerHTML=R.challenges.map((c,index)=>`<details class="challenge" data-challenge="${c.id}"${open.has(c.id)?' open':''}><summary><span>${String(index+1).padStart(2,'0')}</span><h2>${esc(researchText(c,'challenges','title'))}</h2></summary><div class="challenge-body"><p>${esc(researchText(c,'challenges','description'))}</p><p><strong>${esc(t('researchQuestion'))}${colon()}</strong>${esc(researchText(c,'challenges','question'))}</p><p><strong>${esc(t('howEvaluate'))}${colon()}</strong>${esc(researchText(c,'challenges','test'))}</p><p>${sources(c.source_ids)}</p></div></details>`).join('');
  }
  function renderResources(){
    $('#sourceList').innerHTML=R.sources.map((s,index)=>`<li class="source"><span class="resource-index">${String(index+1).padStart(2,'0')}</span><div><h2>${link(s.url,s.title)}</h2><span class="source-date">${esc(s.date)}</span></div></li>`).join('');
  }
  function renderSummary(){
    $('#summaryGrid').innerHTML=[[G.nodes.length,'statNodes'],[G.edges.length,'statEdges'],[R.sources.length,'statSources'],[Object.keys(G.metadata.domains).length,'statDomains']].map(([value,key])=>`<article class="stat"><strong>${value}</strong><span>${esc(t(key))}</span></article>`).join('');
  }
  let explorerResult=null,explorerMessage='explorerWaiting';
  const explorerSources=new Map();
  [...R.sources,...(Q.daily||[]),...(Q.weekly||[]).flatMap(row=>row.papers||[])].forEach(row=>{if(!explorerSources.has(row.id))explorerSources.set(row.id,row);});
  function explorerBasis(item){
 const parts=[];
 const terms=values=>(values||[]).map(term=>term.label[state.language]).join(' / ');
 if(item.matchedTerms?.length)parts.push(`${t('explorerMatched')}${colon()}${terms(item.matchedTerms)}`);
 (item.relatedVia||[]).slice(0,2).forEach(via=>{
  const node=byId[via.id],challenge=R.challenges.find(c=>c.id===via.id);
  const title=node?nodeText(node,'title'):challenge?researchText(challenge,'challenges','title'):via.id;
  const label=t(via.kind==='graph_edge'?'explorerRelated':'explorerSourceVia');
  const relation=via.kind==='graph_edge'?' · '+t(via.type==='constraint'?'constraint':'support'):'';
  parts.push(`${label}${colon()}${title}${relation}${via.matchedTerms?.length?' · '+terms(via.matchedTerms):''}`);
 });
 return parts.map(text=>`<p class="match-basis">${esc(text)}</p>`).join('');
}
  function renderExplorer(){
 const output=$('#explorerResults'),status=$('#explorerStatus'),note=$('#explorerEvidence');
 if(!explorerResult){output.hidden=true;output.innerHTML='';note.hidden=true;status.textContent=t(explorerMessage);return;}
 const groups=Object.fromEntries(Object.entries(explorerResult.groups).map(([kind,rows])=>[kind,rows.slice(0,4)]));
 const count=groups.task.length+groups.technology.length+groups.function.length;
 const total=count+groups.challenges.length+groups.sources.length;
 if(!total){output.hidden=true;output.innerHTML='';note.hidden=true;status.textContent=t('explorerEmpty');return;}
 status.textContent=t('explorerSummary',{nodes:count,challenges:groups.challenges.length,sources:groups.sources.length});
 const keys={task:'explorerTasks',technology:'explorerTechnologies',function:'explorerFunctions',challenges:'explorerChallenges',sources:'explorerSources'};
 output.innerHTML=Object.entries(keys).map(([kind,key])=>{
  const rows=groups[kind];
  return `<section class="explorer-group ${kind==='sources'?'explorer-reference':''}" data-explorer-group="${kind}"><h3>${esc(t(key))} · ${rows.length}</h3>${rows.length?`<ul>${rows.map(item=>{
   if(kind==='sources'){
    const source=explorerSources.get(item.id);
    if(!source)return '';
    return `<li data-explorer-id="${esc(item.id)}"><h4>${link(source.url,source.title)}</h4><p>${esc(source.date||day(source.publishedAt))}</p>${explorerBasis(item)}</li>`;
   }
   if(kind==='challenges'){
    const challenge=R.challenges.find(c=>c.id===item.id);
    return `<li data-explorer-id="${esc(item.id)}"><h4>${esc(researchText(challenge,'challenges','title'))}</h4><p>${esc(researchText(challenge,'challenges','question'))}</p>${explorerBasis(item)}<button type="button" data-explorer-challenge="${esc(item.id)}">${esc(t('explorerOpenChallenge'))} →</button></li>`;
   }
   const node=byId[item.id];
   return `<li data-explorer-id="${esc(item.id)}"><h4>${esc(nodeText(node,'title'))}</h4><p>${esc(nodeText(node,'description'))}</p>${explorerBasis(item)}<button type="button" data-explorer-node="${esc(item.id)}">${esc(t('explorerOpenNode'))} →</button></li>`;
  }).join('')}</ul>`:`<p>${esc(t('explorerNoGroup'))}</p>`}</section>`;
 }).join('');
 output.hidden=false;note.hidden=false;
 $$('[data-explorer-node]').forEach(button=>button.onclick=()=>{
  Object.assign(state,{domain:'all',query:'',edge:'all'});
  $('#domainFilter').value='all';$('#edgeFilter').value='all';$('#search').value='';
  location.hash='network';route();selectNode(button.dataset.explorerNode);
  $('#nodeDetail').scrollIntoView({block:'start',behavior:'smooth'});
 });
 $$('[data-explorer-challenge]').forEach(button=>button.onclick=()=>{
  location.hash='challenges';route();
  const challenge=$(`#challengeList [data-challenge="${button.dataset.explorerChallenge}"]`);
  if(challenge){challenge.open=true;challenge.scrollIntoView({block:'center',behavior:'smooth'});challenge.querySelector?.('summary')?.focus();}
 });
}
  function exploreQuestion(question=$('#researchQuestion').value){
 const query=String(question??'').trim();
 if(!query||query.length>500){
  explorerResult=null;explorerMessage=query.length>500?'explorerTooLong':'explorerShort';renderExplorer();return;
 }
 explorerResult=E.search({graph:G,research:R,radar:Q,i18n:I},query);
 explorerMessage='explorerWaiting';renderExplorer();
}
  function applyLanguage(){
    document.documentElement.lang=state.language==='zh'?'zh-CN':'en';
    document.title=t('pageTitle');
    $$('[data-i18n]').forEach(el=>el.textContent=t(el.dataset.i18n));
    $$('[data-i18n-placeholder]').forEach(el=>el.setAttribute('placeholder',t(el.dataset.i18nPlaceholder)));
    $$('[data-i18n-aria]').forEach(el=>el.setAttribute('aria-label',t(el.dataset.i18nAria)));
    $$('[data-i18n-title]').forEach(el=>el.setAttribute('title',t(el.dataset.i18nTitle)));
    $$('[data-language]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.language===state.language)));
    $('#domainFilter').innerHTML=`<option value="all">${esc(t('allDomains'))}</option>`+Object.entries(I.domains[state.language]).map(([key,value])=>`<option value="${key}">${esc(value)}</option>`).join('');
    $('#domainFilter').value=state.domain;$('#edgeFilter').value=state.edge;
    $('#editionDate').textContent=day(G.metadata.asOf);
    renderWeekly();renderDaily();freshness('weekly');freshness('daily');renderChallenges();renderResources();renderSummary();renderExplorer();refreshSelection();route();
  }
  function setLanguage(language){
    if(!['zh','en'].includes(language))return;
    state.language=language;
    try{localStorage.setItem(storageKey,language);}catch{}
    applyLanguage();
  }
  $('#domainFilter').onchange=e=>{state.domain=e.target.value;refreshSelection();};
  $('#edgeFilter').onchange=e=>{state.edge=e.target.value;refreshSelection();};
  $('#search').oninput=e=>{state.query=e.target.value.trim();refreshSelection();};
  $('#reset').onclick=()=>{Object.assign(state,{domain:'all',query:'',edge:'all',selected:null,zoom:1});$('#domainFilter').value='all';$('#edgeFilter').value='all';$('#search').value='';$('#nodeDetail').hidden=true;draw();};
  $('#zoomIn').onclick=()=>{state.zoom=Math.min(2,state.zoom+.15);draw();};
  $('#zoomOut').onclick=()=>{state.zoom=Math.max(.6,state.zoom-.15);draw();};
  $('#zoomFit').onclick=()=>{state.zoom=1;draw();};
  $('#export').onclick=()=>{
    const current=slice(),view={language:state.language,nodeLabels:Object.fromEntries(current.nodes.map(n=>[n.id,{title:nodeText(n,'title'),description:nodeText(n,'description'),metric:nodeText(n,'metric'),risk:nodeText(n,'risk')}]))};
    const data={metadata:G.metadata,filters:{domain:state.domain,query:state.query,edge:state.edge},view,...current};
    const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})),a=document.createElement('a');
    a.href=url;a.download='psychology-network.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    $('#toast').textContent=t('exported');$('#toast').style.display='block';setTimeout(()=>$('#toast').style.display='none',2500);
  };
  $$('[data-language]').forEach(button=>button.onclick=()=>setLanguage(button.dataset.language));
  $('#questionForm').onsubmit=event=>{event.preventDefault();exploreQuestion();};
  $$('[data-explorer-example]').forEach(button=>button.onclick=()=>{$('#researchQuestion').value=t(button.dataset.explorerExample);exploreQuestion();});
  window.addEventListener('hashchange',route);
  window.PSYCHOLOGY_ATLAS={setLanguage,getLanguage:()=>state.language,exploreQuestion};
  applyLanguage();
})();
