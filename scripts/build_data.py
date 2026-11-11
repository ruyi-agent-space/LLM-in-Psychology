#!/usr/bin/env python3
"""Build a curated, non-clinical research graph. Edges are editorial hypotheses."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
D={'measurement':'心理测量','cognitive':'认知与决策','social':'社会与人格','clinical':'临床与咨询','methods':'质性与研究方法','education':'教育与学习','developmental':'发展与生命周期'}
CONTEXT_SOURCES = {"T01": ["theory-integration", "dual-validity"], "T02": ["simulator-guide", "theory-integration"], "T03": ["clinical-meta", "safety-review", "qualitative-review"], "T04": ["psychometrics-lifecycle", "clinical-meta", "simulator-guide"], "T05": ["psychometrics-lifecycle", "mental-health-review"], "T06": ["clinical-meta", "qualitative-review"], "T07": ["theory-integration", "mental-health-review"], "T08": ["mental-health-review", "theory-integration"], "T09": ["psychometrics-lifecycle", "clinical-meta"], "T10": ["dual-validity", "llm-psychometrics-foundation", "clinical-meta"], "T11": ["psychometrics-lifecycle", "safety-review"], "T12": ["psychometrics-lifecycle", "clinical-meta"], "T13": ["guide-llm", "clinical-meta"], "T14": ["dual-validity", "simulator-guide"], "T15": ["clinical-meta", "safety-review", "qualitative-review"], "T16": ["clinical-meta", "safety-review"], "T17": ["guide-llm", "simulator-guide"], "T18": ["simulator-guide", "theory-integration"], "F01": ["clinical-meta", "guide-llm"], "F02": ["clinical-meta", "qualitative-review"], "F03": ["clinical-meta", "mental-health-review"], "F04": ["qualitative-review"], "F05": ["psychometrics-lifecycle", "llm-psychometrics-foundation"], "F06": ["dual-validity", "psychometrics-lifecycle"], "F07": ["psychometrics-lifecycle", "clinical-meta", "mental-health-review"], "F08": ["clinical-meta", "learning-psychology"], "F09": ["clinical-meta", "safety-review"], "F10": ["clinical-meta", "mental-health-review"], "F11": ["simulator-guide", "theory-integration"], "F12": ["simulator-guide", "dual-validity"], "F13": ["theory-integration", "llm-psychometrics-foundation"], "F14": ["dual-validity", "simulator-guide"], "F15": ["guide-llm", "dual-validity"], "F16": ["theory-integration", "learning-psychology"], "F17": ["psychometrics-lifecycle", "llm-psychometrics-foundation"], "F18": ["mental-health-review", "theory-integration"], "F19": ["learning-psychology", "pedagogy-umbrella"], "F20": ["guide-llm", "clinical-meta"], "F21": ["psychometrics-lifecycle", "clinical-meta"], "F22": ["psychometrics-lifecycle", "safety-review"], "F23": ["guide-llm", "llm-psychometrics-foundation"], "F24": ["simulator-guide", "theory-integration"], "P01": ["psychometrics-lifecycle", "dual-validity"], "P02": ["psychometrics-lifecycle", "llm-psychometrics-foundation"], "P03": ["simulator-guide", "dual-validity"], "P04": ["simulator-guide", "llm-psychometrics-foundation"], "P05": ["simulator-guide", "theory-integration"], "P06": ["qualitative-review"], "P07": ["mental-health-review", "psychometrics-lifecycle", "qualitative-review"], "P08": ["clinical-meta", "mental-health-review"], "P09": ["clinical-meta", "safety-review"], "P10": ["clinical-meta", "simulator-guide"], "P11": ["safety-review", "clinical-meta"], "P12": ["learning-psychology"], "P13": ["learning-psychology", "pedagogy-umbrella"], "P14": ["theory-integration", "learning-psychology"], "P15": ["guide-llm"], "P16": ["psychometrics-lifecycle", "safety-review"], "P17": ["clinical-meta"], "P18": ["guide-llm", "dual-validity"]}
TECH_DOMAINS = {"T01": ["measurement", "cognitive", "social", "clinical", "methods", "education", "developmental"], "T02": ["measurement", "cognitive", "social", "clinical", "methods", "education", "developmental"], "T03": ["methods", "clinical", "education"], "T04": ["measurement", "cognitive", "social", "clinical"], "T05": ["measurement", "cognitive", "methods", "clinical", "social"], "T06": ["methods", "clinical", "measurement"], "T07": ["cognitive", "education", "developmental"], "T08": ["clinical", "social", "developmental", "education"], "T09": ["measurement", "clinical", "cognitive", "social", "developmental"], "T10": ["measurement", "cognitive", "social", "clinical", "methods", "education", "developmental"], "T11": ["methods", "clinical", "developmental", "measurement"], "T12": ["measurement", "social", "clinical", "education"], "T13": ["methods", "clinical", "measurement"], "T14": ["cognitive", "social", "methods", "measurement", "education", "developmental"], "T15": ["measurement", "social", "clinical", "methods", "education", "developmental"], "T16": ["clinical", "methods", "developmental", "education"], "T17": ["measurement", "methods", "clinical", "social", "cognitive", "developmental"], "T18": ["cognitive", "social", "clinical", "education"]}
EDGE_CONTEXT = {"T06-F03-support": [["clinical-meta"], "Results: documentation, summarization and monitoring"], "F03-P08-support": [["clinical-meta"], "Results: documentation, summarization and monitoring"], "T15-F09-support": [["safety-review"], "Results: delivery-phase oversight and crisis referral"], "F09-P11-support": [["safety-review"], "Results and Discussion: crisis identification and safety outcomes"], "T14-F06-support": [["dual-validity"], "Abstract: integrating psychometric validation and causal inference"], "F12-P03-support": [["simulator-guide"], "Validation framework: direct, indirect and generative validation"]}
nodes=[];edges=[]
def node(id,title,en,layer,domains,description,metric,risk):
    sources=CONTEXT_SOURCES[id]
    nodes.append(dict(id=id,title=title,en=en,layer=layer,domains=domains,description=description,metric=metric,risk=risk,sourceIds=sources,evidence='review_context',claim='文献提供主题背景；此节点的具体实现和有效性需独立验证。'))
    nodes[-1]['crossCutting'] = layer == 'technology'
    if id in ('F13','F18','F19','P14'):
        nodes[-1]['evidenceGap'] = '本轮来源提供理论或邻近场景背景，未核实儿童长期结局专门证据。'
        nodes[-1]['ageScope'] = '不可从成人或外语学习证据推断儿童长期效果。'
def edge(a,b,kind='support'):
    if not any(e['source']==a and e['target']==b and e['type']==kind for e in edges):
        edges.append(dict(id=f'{a}-{b}-{kind}',source=a,target=b,type=kind,evidence='editorial_hypothesis',claim='编辑性设计映射；非已验证依赖、因果机制或疗效结论。'))
        names = {n['id']: n['title'] for n in nodes}
        edges[-1]['rationale'] = (f'编辑提出：开展“{names[b]}”时，应检验“{names[a]}”约束。' if kind == 'constraint' else f'编辑提出：“{names[a]}”可作为“{names[b]}”的候选实现或研究路径。')
        context = EDGE_CONTEXT.get(edges[-1]['id'], [[], None])
        edges[-1]['contextSourceIds'], edges[-1]['contextLocation'] = context
        edges[-1]['relationshipEvidence'] = 'unverified'
tech=[
('T01','基础语言模型','Foundation model','生成与理解语言的技术底座。','任务外测试、错误分布','训练数据偏差与能力错觉'),
('T02','提示与上下文设计','Prompt & context','明确任务、角色、反例与上下文。','提示敏感性、重复运行一致性','角色设定不等于真实人格'),
('T03','检索增强与引用','Retrieval & grounding','检索公开来源并定位原始证据。','检索召回、引文蕴含','检索到文献不代表正确解释'),
('T04','领域适配与微调','Domain adaptation','适配受约束研究任务。','独立保留集、基线比较','数据污染与群体过拟合'),
('T05','嵌入与表征','Embeddings','把文本转为可比较表征。','外部效度、测量不变性','表征距离不等于心理距离'),
('T06','结构化输出与工具','Structured tools','形成可检验的结构化记录。','字段正确率、工具审计','格式正确不保证内容正确'),
('T07','多模态模型','Multimodal models','联合文本、音频或视觉线索。','模态消融、分组误差','表情或声音不直接揭示心理状态'),
('T08','受控记忆与纵向状态','Longitudinal state','在同意范围内追踪研究状态。','时间一致性、删除验证','敏感轨迹泄露与错误累积'),
('T09','概率与不确定性','Uncertainty','表达校准、拒答和不确定性。','校准误差、选择性风险','自报置信度未必可靠'),
('T10','评估与红队测试','Evaluation harness','比较基线并系统发现失效。','独立测试、最坏组结果','基准泄漏与代理指标优化'),
('T11','隐私保护与访问控制','Privacy controls','最小化数据、分权访问与受控保留。','再识别攻击、删除与访问审计','去标识化不保证匿名'),
('T12','多语与文化适配','Cultural adaptation','检查语言与情境差异。','跨语言不变性、群体误差','直译不等于文化等价'),
('T13','来源与数据谱系','Provenance','保留来源、日期和处理轨迹。','证据可追溯率','伪引文与来源丢失'),
('T14','实验与因果设计','Causal design','把任务假设变成可证伪实验。','随机化、混淆检查、敏感性分析','预测与机制解释混淆'),
('T15','人工审阅与升级','Human oversight','定义人工决策、拒绝与升级边界。','升级召回率、人工负担','橡皮图章式监督'),
('T16','安全策略与约束','Safety guardrails','约束系统行为与高风险输出。','对抗测试、漏报与误报','单层过滤不能保证安全'),
('T17','模型与提示版本管理','Version control','记录模型、提示、采样与变化。','版本复现率、漂移监测','闭源服务漂移与不可复现'),
('T18','代理与仿真编排','Agent orchestration','管理受限模拟与工具步骤。','轨迹审计、消融与人工对照','涌现叙事不代表人类机制')]
for id,t,en,desc,m,r in tech: node(id,t,en,'technology',TECH_DOMAINS[id],desc,m,r)
funcs=[
('F01','文献检索与证据定位','Evidence retrieval',['methods','clinical'],['T03','T13'],'定位与问题有关的证据与日期。','引用支持率、漏检率','把相关性误当支持'),
('F02','研究综合与比较','Evidence synthesis',['methods'],['T01','T02','T03'],'比较不同设计、样本与结论边界。','设计识别、重复研究检查','叙述流畅掩盖异质性'),
('F03','结构化信息提取','Structured extraction',['methods','clinical'],['T01','T06'],'从授权文本提取预先定义字段。','精确率、召回率、人工差异','遗漏关键否定与语境'),
('F04','访谈与主题辅助编码','Qualitative coding',['methods'],['T01','T02','T05'],'建议代码并保留原始证据片段。','分歧审计、反例与反思记录','抹平少数观点'),
('F05','量表条目与测验生成','Item development',['measurement','education'],['T01','T02','T04'],'产生待专家和样本验证的条目。','内容效度、项目反应模型','内容新颖不代表有效'),
('F06','构念操作化与验证','Construct validation',['measurement','cognitive'],['T05','T10','T14'],'连接操作、指标与可辩护解释。','收敛、区分与预测效度','跨实体构念误用'),
('F07','文本评分与行为指标','Scoring & markers',['measurement','clinical'],['T04','T05','T06'],'生成有校准要求的研究指标。','与独立标准一致性、校准','从个体语言武断推断心理状况'),
('F08','情境化沟通辅助','Communication support',['clinical','education'],['T01','T02','T12'],'起草待人工审核的沟通材料。','情境适当性、事实错误','拟人化、权威感与过度信任'),
('F09','风险识别与人工升级','Risk escalation',['clinical'],['T09','T15','T16'],'研究升级到有资质人员的安全流程。','漏报、误报、响应延迟','漏掉危机或错误安抚'),
('F10','心理教育内容辅助','Psychoeducation support',['clinical','education'],['T03','T12','T15'],'制作需审阅的通用教育材料。','事实核验、可理解性','把通用教育当个体治疗'),
('F11','标准化角色扮演','Role-play',['clinical','education'],['T02','T08','T18'],'模拟训练情境，不冒充真实患者。','角色一致性、训练迁移','刻板印象和过度简化'),
('F12','合成参与者模拟','Participant simulation',['social','cognitive'],['T02','T04','T18'],'探索假设并与真实人类数据比较。','分布匹配、未见任务外部效度','替代真实参与者'),
('F13','视角与社会推理','Social reasoning',['social','developmental'],['T01','T02','T14'],'评估情境推理和视角任务表现。','对照条件、反事实鲁棒性','把答题正确当心理机制'),
('F14','认知与决策预测','Behavior prediction',['cognitive','social'],['T05','T09','T14'],'预测受限任务行为并标注不确定性。','留出任务误差、分布差异','样本记忆与外推失败'),
('F15','实验设计与假设生成','Study design',['methods','cognitive'],['T01','T03','T14'],'辅助可证伪假设和研究方案。','独立可检验性、预注册一致性','事后合理化和研究者自由度'),
('F16','刺激材料与难度控制','Stimulus generation',['cognitive','education'],['T01','T02','T07'],'生成需预试验的刺激或教学材料。','难度匹配、操控检查','语义、文化或难度混淆'),
('F17','跨语言适配与翻译','Cross-cultural adaptation',['measurement','social'],['T12','T05','T15'],'生成候选翻译并安排文化校验。','测量不变性、认知访谈','字面翻译丢失意义'),
('F18','纵向轨迹与变化','Longitudinal analysis',['developmental','clinical'],['T08','T09','T17'],'研究随时间变化且保留不确定性。','时间外测试、缺失机制敏感性','把漂移误当个体变化'),
('F19','学习支架与反思','Learning scaffolds',['education','developmental'],['T02','T03','T15'],'支持自主解释、反思与无AI迁移。','延迟测验、迁移、自主性','依赖与能力卸载'),
('F20','可解释审计与出处','Explanation & audit',['methods','clinical'],['T06','T13','T17'],'核查过程、证据和决策责任。','审计可重建率、事实支持','推理文本不等于真实机制'),
('F21','公平性与群体评估','Fairness evaluation',['measurement','social'],['T10','T12','T09'],'报告最坏组误差和适用范围。','分组误差、差异项目功能','平均分掩盖伤害'),
('F22','同意与隐私治理','Consent & privacy',['methods','developmental','clinical'],['T11','T15','T16'],'约束采集、共享、保留和删除。','同意可理解性、再识别与删除检查','敏感文本与未成年人暴露'),
('F23','复现与漂移监测','Reproducibility',['methods','measurement'],['T10','T13','T17'],'记录完整研究配置和结果变化。','多次运行与版本敏感性','不可获取模型和时间漂移'),
('F24','多代理互动实验','Multi-agent experiments',['social','cognitive'],['T18','T14','T10'],'检验受控群体互动假设。','人类对照、消融、机制区分','仿真故事被误作实证')]
for id,t,en,ds,ts,desc,m,r in funcs:
    node(id,t,en,'function',ds,desc,m,r)
    for techid in ts:edge(techid,id)
tasks=[
('P01','验证一个心理测量构念','Validate a construct',['measurement'],['F05','F06','F07','F21','F23'],'在独立真实样本上检验指标含义。','构念效度与外部标准','未经验证用于个体评估'),
('P02','开发跨文化量表候选','Adapt a measure',['measurement','social'],['F05','F17','F21'],'生成条目与译文，开展认知访谈与校准。','不变性、DIF与内容效度','群体公平性不足'),
('P03','复现认知行为实验','Replicate cognition task',['cognitive'],['F12','F14','F15','F16','F23'],'对比模型与人类在新实验条件的反应。','未见条件预测、效应方向','记忆已有实验答案'),
('P04','检验社会判断与人格','Study social judgment',['social'],['F06','F12','F13','F21'],'描述有限任务行为，不把模型当人。','人类分布匹配、提示敏感性','人格标签拟人化'),
('P05','构建群体互动仿真','Model group interaction',['social','cognitive'],['F12','F14','F24'],'检验群体机制假设和边界条件。','独立实证、消融与稳健性','无法推广真实社会'),
('P06','辅助访谈主题分析','Analyze interviews',['methods'],['F03','F04','F20','F22'],'仅对获授权、最小化数据做辅助编码。','反例、分歧、反思记录','语境流失与隐私泄露'),
('P07','研究叙事与心理语言','Study psychological language',['methods','cognitive'],['F03','F04','F07','F17'],'研究语言模式与外部标准的关系。','独立标注、跨语境稳健性','从语言过度推断心理状态'),
('P08','制作临床文书草稿','Draft clinical documentation',['clinical'],['F03','F08','F20','F22'],'需受控数据环境与专业人员审阅。','事实错误、遗漏、人工负担','私密记录外泄或错误进入病历'),
('P09','评估监督式筛查支持','Evaluate supervised screening',['clinical'],['F07','F09','F21'],'研究筛查支持流程，不提供自主诊断。','校准、漏报、前瞻结局','基准分数代替临床验证'),
('P10','训练咨询沟通技能','Train counseling skills',['clinical','education'],['F08','F10','F11'],'以合成角色训练沟通并由专家评价。','技能迁移、专家与学员反馈','把模拟熟练误当临床胜任'),
('P11','评估安全升级流程','Test safety escalation',['clinical'],['F09','F20','F23'],'以受控情境验证人工介入与问责流程。','漏报与误报、升级延迟','安全漏洞与虚假保证'),
('P12','研究元认知与AI信任','Study metacognition & trust',['education'],['F08','F16','F19'],'研究何时检查、依赖或拒绝模型输出。','信任校准、无AI迁移','任务加速掩盖依赖'),
('P13','评估学习支架与迁移','Evaluate learning transfer',['education'],['F16','F19','F23'],'追踪延迟、独立作答和迁移能力。','延迟测验、迁移效果','即时成绩当长期获益'),
('P14','研究年龄与发展差异','Study developmental change',['developmental','education'],['F13','F18','F19','F22'],'证据待补强；年龄分层与保护优先。','纵向与年龄分层结果','儿童隐私、自主性和长期影响'),
('P15','建立版本化复现基准','Build reproducibility benchmark',['methods','measurement'],['F15','F20','F21','F23'],'记录模型、提示、样本和评价脚本。','运行与版本方差、独立复现','基准污染与配置不可恢复'),
('P16','审计公平与隐私风险','Audit fairness & privacy',['measurement','methods'],['F20','F21','F22'],'评估受约束用例的风险和退出机制。','最坏组误差、再识别风险','平均安全性不保护每个人'),
('P17','综合干预与工作流证据','Synthesize intervention evidence',['clinical','methods'],['F01','F02','F20'],'区分模拟、回顾与前瞻研究及真实结局。','偏倚评价、异质性、设计分层','异质结果被合并过度解释'),
('P18','预注册可证伪研究方案','Preregister a study',['methods','cognitive'],['F01','F15','F16','F23'],'明确假设、比较组、排除条件与指标。','预注册一致性、最小效应与功效','选择性报告、不可证伪解释')]
for id,t,en,ds,fs,desc,m,r in tasks:
    node(id,t,en,'task',ds,desc,m,r)
    for fid in fs: edge(fid,id)
# Explicit safety/validation constraints, rather than inferred efficacy dependencies.
for fid in ['F03','F04','F07','F08','F09','F10','F11','F18','F19']:edge('T15',fid,'constraint')
for fid in ['F03','F04','F07','F08','F18','F22']:edge('T11',fid,'constraint')
for fid in ['F05','F06','F07','F12','F13','F14','F17','F19','F24']:edge('T10',fid,'constraint')
for pid in ['P01','P02','P03','P04','P05','P09','P12','P13','P14']:edge('F23',pid,'constraint')
for pid in ['P06','P07','P08','P09','P10','P14']:edge('F22',pid,'constraint')
graph=dict(metadata=dict(title='LLM in Psychology Research Atlas',version='1.1.0',asOf='2026-11-11',evidencePolicy='All edges are unverified editorial hypotheses. Selected review citations provide context, not evidence that a relation is effective or necessary.',domains=D),nodes=nodes,edges=edges)
graph['metadata']['domainPolicy'] = 'Domains describe editorial use contexts, not evidence strength. Cross-cutting technologies are shown through their connections; developmental evidence gaps remain explicit.'
(ROOT/'data').mkdir(exist_ok=True);(ROOT/'site').mkdir(exist_ok=True)
(ROOT/'data/graph.json').write_text(json.dumps(graph,ensure_ascii=False,indent=2)+'\n')
(ROOT/'site/graph-data.js').write_text('window.GRAPH_DATA = '+json.dumps(graph,ensure_ascii=False)+';\n')
research=json.loads((ROOT/'data/research.json').read_text())
(ROOT/'site/research-data.js').write_text('window.RESEARCH_DATA = '+json.dumps(research,ensure_ascii=False)+';\n')
print(f'{len(nodes)} nodes / {len(edges)} edges')
