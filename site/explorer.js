(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.ATLAS_EXPLORER = api;
})(typeof window !== 'undefined' ? window : null, function () {
  'use strict';
  // Scores rank topic relevance; they do not measure evidence strength.
  const MAX_QUESTION = 600, MAX_FIELD = 8000, MAX_RESULTS = 4;
  const GROUPS = ['task', 'technology', 'function', 'challenges', 'sources'];
  const STOP = new Set(('a an and are as at be been being but by can could did do does for from ' +
    'had has have how i if in into is it its may me might my of on or our please should so than ' +
    'that the their them then there these they this those to us was we were what when where which ' +
    'who why will with would you your about using use help want need llm llms ai psychology psychological').split(/\s+/));
  const TOPICS = [
    ['measurement', '心理测量与量表', 'Psychometrics and scales',
      ['心理测量','量表','问卷','条目','测验','评分','测量','psychometric','psychometrics','questionnaire','questionnaires','scale','scales','scoring','item development','test development']],
    ['validity', '构念效度与不变性', 'Construct validity and invariance',
      ['效度','构念','不变性','差异项目','validity','validate','validation','construct','constructs','invariance','differential item','dif']],
    ['reliability', '信度与一致性', 'Reliability and consistency',
      ['信度','重测','可靠性','一致性','reliability','test retest','consistency']],
    ['reproducibility', '复现、版本与漂移', 'Reproducibility, versions, and drift',
      ['复现','重现','版本','漂移','replication','replicate','reproducibility','reproducible','version','versions','drift','repeatability']],
    ['simulation', '参与者模拟与人类对照', 'Participant simulation and human comparisons',
      ['模拟','仿真','合成参与者','虚拟参与者','角色扮演','simulation','simulations','simulate','simulated','simulator','simulators','synthetic participant','synthetic participants','participant simulation','human response distributions','human responses','model and human','psychological simulators','模型与人类','人类分布','synthetic patient','synthetic patients','role play','role playing','persona','agent','agents']],
    ['cognition', '认知、记忆与决策', 'Cognition, memory, and decisions',
      ['认知','决策','记忆','推理','cognition','cognitive','decision','decisions','memory','reasoning']],
    ['causal', '实验、假设与因果', 'Experiments, hypotheses, and causality',
      ['因果','实验','假设','预注册','干预效应','causal','causality','randomized','randomised','trial','trials','experiment','experiments','experimental','hypothesis','hypotheses','preregister','preregistration','randomization','randomisation']],
    ['social', '社会、人格与视角', 'Social behavior, personality, and perspective',
      ['社会','人格','视角','心智理论','social','personality','perspective taking','theory of mind']],
    ['fairness', '文化、语言与公平', 'Culture, language, and fairness',
      ['公平','偏差','偏见','文化','群体','多语','翻译','fairness','bias','biased','culture','cultures','cultural','cross cultural','cross language','cross linguistic','跨语言','multilingual','translation','demographic','subgroup']],
    ['qualitative', '访谈、叙事与质性分析', 'Interviews, narratives, and qualitative analysis',
      ['质性','定性研究','定性分析','访谈','主题分析','编码','叙事','反思','qualitative','interview','interviews','thematic','coding','narrative','reflexivity','reflexive']],
    ['privacy', '隐私、同意与数据治理', 'Privacy, consent, and data governance',
      ['隐私','同意','敏感数据','去标识','匿名','再识别','数据泄露','私密','泄露','泄漏','数据治理','保密','privacy','private data','private records','personal data','data governance','consent','sensitive data','de identification','deidentified','anonymity','anonymous','re identification','confidential','confidentiality','data leakage']],
    ['clinical', '临床与心理健康研究', 'Clinical and mental health research',
      ['临床','咨询','心理健康','心理治疗','抑郁','焦虑','诊断','筛查','症状','clinical','counseling','counselling','mental health','psychotherapy','depression','anxiety','diagnosis','diagnostic','screening','symptom','symptoms']],
    ['safety', '安全、危机与人工升级', 'Safety, crises, and human escalation',
      ['安全','危机','转介','升级','自杀','自伤','不良事件','迎合','safety','crisis','crises','suicide','suicidal','self harm','referral','referrals','escalation','escalate','adverse event','sycophancy','harm','harmful','safety risk','risk escalation']],
    ['learning', '学习、元认知与迁移', 'Learning, metacognition, and transfer',
      ['学习','教育','教学','元认知','支架','迁移','learning','education','educational','pedagogy','metacognition','metacognitive','scaffolding','transfer','tutor','tutoring']],
    ['development', '年龄、儿童与发展', 'Age, children, and development',
      ['儿童','未成年','发展','年龄','青少年','生命周期','child','children','adolescent','adolescents','developmental','lifespan','age stratified','minors','youth']],
    ['trust', '信任、自主与依赖', 'Trust, autonomy, and dependence',
      ['信任','依赖','自主','卸载','trust','dependence','dependency','autonomy','offloading','reliance','overreliance']],
    ['retrieval', '文献检索、引用与综合', 'Literature retrieval, citations, and synthesis',
      ['检索','引用','引文','来源','综述','证据综合','文献','retrieval','citation','citations','literature','systematic review','literature review','scoping review','meta analysis','evidence synthesis','rag','grounding','provenance']],
    ['adaptation', '提示、上下文与微调', 'Prompts, context, and fine-tuning',
      ['提示','上下文','微调','适配','prompt','prompts','prompting','context','fine tuning','fine tune','finetuning','adaptation','qlora']],
    ['representation', '多模态与文本表征', 'Multimodality and text representations',
      ['多模态','音频','声音','视觉','图像','嵌入','表征','multimodal','audio','voice','visual','image','embedding','embeddings','representation','representations']],
    ['evaluation', '评估、校准与不确定性', 'Evaluation, calibration, and uncertainty',
      ['评估','评价','基准','不确定','校准','拒答','红队','审计','benchmark','benchmarks','evaluation','evaluate','uncertainty','uncertain','calibration','calibrate','calibrated','abstention','red team','audit']]
  ];
  function text(value) {return typeof value === 'string' ? value.slice(0, MAX_FIELD) : '';}
  function rows(value) {return Array.isArray(value) ? value.filter(v => v && typeof v === 'object' && !Array.isArray(v)) : [];}
  function normal(value) {
    return text(value).normalize('NFKC').toLowerCase().replace(/[’']/g, '')
      .replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();
  }
  function escapeRE(value) {return value.replace(/[.*+?^$(){}|[\]\\]/g, '\\$&');}
  const topics = TOPICS.map(([key, zh, en, aliases]) => ({
    key, label: {zh, en},
    aliases: aliases.map(alias => {
      const value = normal(alias);
      const specificity = value.includes(' ') || /[\u3400-\u9fff]{4}/u.test(value) ? 2 : 1;
      const matcher = /[\u3400-\u9fff]/u.test(value)
        ? (value === '质性' ? {pattern: /(?:^|[^异同])质性/u} : {value})
        : {pattern: new RegExp('(?:^|[^a-z0-9])' + escapeRE(value) + '(?=$|[^a-z0-9])', 'u')};
      return {...matcher, specificity, raw:value};
    })
  }));
  function matchingAliases(value, topic) {
    return topic.aliases.filter(alias => alias.pattern ? alias.pattern.test(value) : value.includes(alias.value));
  }
  function hasTopic(value, topic) {return matchingAliases(value, topic).length > 0;}
  function term(topic) {return {key: topic.key, label: {zh: topic.label.zh, en: topic.label.en}};}
  function field(weight, ...values) {return values.filter(value => typeof value === 'string').map(value => ({weight, value: normal(value)}));}
  function references(row) {
    const result = [];
    for (const name of ['sourceIds', 'source_ids']) {
      if (!Array.isArray(row[name])) continue;
      for (const id of row[name]) {if (typeof id === 'string' && id) result.push({id, field: name});}
    }
    return result;
  }
  function sourceRows(data) {
    const result = new Map();
    const add = value => {
      for (const row of rows(value)) {const id = text(row.id);if (id && !result.has(id)) result.set(id, row);}
    };
    add(data.research && data.research.sources);
    add(data.radar && data.radar.daily);
    for (const week of rows(data.radar && data.radar.weekly)) add(week.papers);
    return [...result.values()];
  }
  function records(data) {
    const graph = data.graph || {}, research = data.research || {}, i18n = data.i18n || {};
    const result = [], seen = new Set();
    function add(row, group, fields) {
      const id = text(row.id), key = group + ':' + id;
      if (!id || seen.has(key)) return;
      seen.add(key);result.push({id, group, fields, references: references(row)});
    }
    for (const n of rows(graph.nodes)) {
      if (!['task','technology','function'].includes(n.layer)) continue;
      const en = i18n.graph && i18n.graph[n.id] || {};
      add(n, n.layer, [...field(5, n.title, n.en),...field(3, n.description, en.description),...field(2, n.metric, en.metric),...field(1, n.risk, en.risk)]);
    }
    for (const c of rows(research.challenges)) {
      const en = i18n.challenges && i18n.challenges[c.id] || {};
      add(c, 'challenges', [...field(5, c.title, en.title),...field(3, c.question, en.question),...field(2, c.description, en.description, c.test, en.test)]);
    }
    for (const s of sourceRows(data)) {add(s, 'sources', [...field(5, s.title),...field(3, s.scope),...field(2, s.findings, s.abstract)]);}
    return result;
  }
  function search(input, question) {
    const groups = Object.fromEntries(GROUPS.map(group => [group, []]));
    const empty = {terms: [], groups};
    if (!input || typeof input !== 'object' || typeof question !== 'string') return empty;
    const query = normal(question.slice(0, MAX_QUESTION));
    const meaningful = (query.match(/[a-z0-9]+|[\u3400-\u9fff]+/gu) || []).filter(word => word.length > 1 && !STOP.has(word));
    if (!meaningful.length) return empty;
    const selected = topics.filter(topic => hasTopic(query, topic));
    if (!selected.length) return empty;
    const queryWeights = new Map(selected.map(topic => {
      const aliases = matchingAliases(query, topic);
      const specific = Math.max(...aliases.map(alias => alias.specificity));
      const genericEvaluation = topic.key === 'evaluation' && aliases.every(alias =>
        ['evaluate','evaluation','评估','评价'].includes(alias.raw));
      return [topic.key, specific * (genericEvaluation ? 0.25 : 1)];
    }));
    const all = records(input);
    const byNode = new Map(all.filter(row => ['task','technology','function'].includes(row.group)).map(row => [row.id, row]));
    const bySource = new Map(all.filter(row => row.group === 'sources').map(row => [row.id, row]));
    const matches = new Map(GROUPS.map(group => [group, new Map()]));
    const direct = [];
    for (const record of all) {
      const hit = [];
      let relevance = 0;
      for (const topic of selected) {
        const strength = Math.max(0,...record.fields.map(f => Math.max(0,
          ...matchingAliases(f.value, topic).map(alias => f.weight * alias.specificity))));
        if (strength) {
          hit.push(term(topic));
          relevance += (6 + strength) * queryWeights.get(topic.key);
        }
      }
      if (!hit.length) continue;
      const match = {id:record.id,score:100 + Math.round(4 * relevance),matchedTerms:hit};
      matches.get(record.group).set(record.id,match);direct.push({record,match});
    }
    function relate(record, via, score) {
      const map = matches.get(record.group);
      let match = map.get(record.id);
      if (!match) {match = {id: record.id, score, matchedTerms: []};map.set(record.id, match);}
      else if (!match.matchedTerms.length) match.score = Math.max(match.score, score);
      if (!match.relatedVia) match.relatedVia = [];
      const same = item => item.kind === via.kind && item.id === via.id && item.group === via.group && item.edgeId === via.edgeId;
      if (!match.relatedVia.some(same)) match.relatedVia.push(via);
    }
    // Only original text matches seed expansion: no second-hop propagation.
    const directNodes = new Map(direct.filter(({record}) => byNode.has(record.id) && record.group === byNode.get(record.id).group).map(entry => [entry.record.id, entry]));
    for (const edge of rows(input.graph && input.graph.edges)) {
      if (!['support','constraint'].includes(edge.type)) continue;
      const source = text(edge.source), target = text(edge.target);
      for (const [originId, otherId] of [[source, target], [target, source]]) {
        const origin = directNodes.get(originId), other = byNode.get(otherId);
        if (!origin || !other || originId === otherId) continue;
        relate(other, {kind: 'graph_edge',id: originId,group: origin.record.group,edgeId: text(edge.id) || source + '-' + target + '-' + edge.type,type: edge.type,matchedTerms: origin.match.matchedTerms}, 5 + Math.min(15, origin.match.matchedTerms.length));
      }
    }
    // Source references are context links, separate from source-text matches.
    for (const {record, match} of direct) {
      if (record.group === 'sources') continue;
      for (const ref of record.references) {
        const source = bySource.get(ref.id);
        if (source) relate(source, {kind: 'source_reference',id: record.id,group: record.group,field: ref.field,matchedTerms: match.matchedTerms}, 3 + Math.min(12, match.matchedTerms.length));
      }
    }
    function cmp(a, b) {return a < b ? -1 : a > b ? 1 : 0;}
    for (const group of GROUPS) {
      groups[group] = [...matches.get(group).values()].sort((a,b) => b.score-a.score || cmp(a.id,b.id)).slice(0, MAX_RESULTS);
      for (const result of groups[group]) {
        if (!result.relatedVia) continue;
        result.relatedVia.sort((a,b) => cmp(a.kind + ':' + a.group + ':' + a.id + ':' + (a.edgeId || ''),b.kind + ':' + b.group + ':' + b.id + ':' + (b.edgeId || '')));
        result.relatedVia = result.relatedVia.slice(0, 3);
      }
    }
    return {terms: selected.map(term), groups};
  }
  return {search,sourceRows,limits: {question: MAX_QUESTION, perGroup: MAX_RESULTS}};
});
