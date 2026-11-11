# LLM in Psychology

**心理语义任务 X 技术能力网络 / Psychological Semantic Tasks X Technical Capabilities Network**

[打开看板 / Open the atlas](https://ruyi-agent-space.github.io/LLM-in-Psychology/) · [发布记录 / Deployment history](https://github.com/ruyi-agent-space/LLM-in-Psychology/actions/workflows/pages.yml)

## 当前功能 / Current features

- 中文与 EN 自选切换，保存浏览器语言偏好；菜单、60个节点详情、5个研究方向、10个挑战和来源状态均有对应文案。Chinese/English selection persists in the browser and covers navigation, graph details, research cards, challenges and source status.
- 全宽三层图谱：18项技术、24项研究功能、18项心理任务及174条编辑映射；支持双语关键词筛选、领域/关系筛选、节点跳转和缩放。The three-layer graph supports bilingual text search, domain/relationship filters, linked-node navigation and zoom.
- JSON导出保留原始图谱，并附所选语言的显示标签。JSON exports preserve source data and include labels in the selected language.
- 一周研究热点按五个预设方向的近七天检索样本文献数排列；今日精读显示三篇候选；资源说明列出文献原始链接。Weekly counts rank five preset directions; the reading queue contains three candidates; Resources lists original references.
- 图谱搜索在浏览器中筛选已加载节点。The current search filters the loaded graph in the browser.

**安全边界 / Safety boundary：**仅供研究使用和分享，目前不提供任何心理健康相关服务。For research use and sharing. No mental health services are currently provided.

## 图标来源 / Symbol provenance

顶部标记是文本字符 `ψ`（希腊字母 psi，Unicode U+03C8），用 CSS 的 `Georgia, serif` 字体、白字及深绿色圆角背景绘制。网络节点和连线由程序生成 SVG。The brand uses the Greek character psi styled with CSS; the graph is generated SVG. This implementation uses text and code for those graphics.

## 自动更新 / Automatic updates

数据刷新配置为每日 **06:00 UTC**；周计数于周一更新，支持遗漏补跑。成功刷新后，Pages工作流会重新检查并发布对应快照。Daily data collection is scheduled at 06:00 UTC, with weekly recomputation on Monday and catch-up after a missed update. Successful radar completion triggers a checked Pages deployment.

页面显示真实的快照时间、部分来源状态、限流和过期提示；来源采集失败时保留相应的成功内容及日期。公开数据采用自动元数据规则筛选。The UI reports actual snapshot dates, partial coverage, provider cooldowns and stale states; failure handling retains prior successful snapshots and their dates. Screening operates on public publication metadata.

说明：公开数据自动筛选审核，如有问题请联系作者邮箱或 GitHub 账号：[ruyiw20@gmail.com](mailto:ruyiw20@gmail.com) · [@rruyi](https://github.com/rruyi)。Public data is automatically screened and checked; contact the author by email or GitHub for questions.

下载的本地副本保留获取时的快照。A downloaded copy preserves its download-time snapshot. [更新方法 / Refresh implementation](docs/AUTOMATION.md) · [Pages运行 / Pages operation](docs/PAGES.md) · [验证记录 / Validation record](docs/VALIDATION.md)

## Research Question Explorer / 研究问题探索

[架构建议 / Architecture proposal](docs/SERVICE_ARCHITECTURE.md)讨论登录搜索、账户、文献索引与付费服务。此项处于设计阶段；本次页面提供图谱本地筛选。The architecture document proposes a future authenticated research-search application. The current page provides local graph filtering.

## Reviews and methodology

此处收录原“综述与方法”页面内容。This section collects the review summaries and methods previously shown in the website.

### 策展与证据 / Curation and evidence

经定向检索并核对出版社/ACL/arXiv原始页面的精选证据地图，不是穷尽性系统综述。窗口采用所引用版本的在线发表日期，不等同于该工作的首次公开日期；预印本首发与修订分别记录，月份不强行补日。五方向与十挑战是跨文献编辑综合。

11项窗口内来源（包括方法指南），1项窗口外基础预印本；所引用版本日期不等于作品首次公开日期。教育及邻近教育技术来源较多，不能代表心理学分支均衡覆盖。发展心理学、儿童长期结局、老年与组织心理缺少本轮独立综述支持。

The atlas is a targeted, curated evidence map. The preferred window refers to the cited version's online publication date; preprint release and revision dates are tracked separately. Educational sources are prominent, while child longitudinal, older-adult and organizational psychology coverage remains incomplete. Editorial mappings identify candidate research pathways; references provide context and evaluation metrics guide follow-up validation.

### 自动样本方法 / Automated sample methods

- 公开元数据样本：Europe PMC最多300条，arXiv最多200条；记录查询、条数上限及达到上限的状态；数据库覆盖有偏差，不是穷尽检索。
- LLM需在标题出现或摘要至少提及两次；教育主题另需元认知、学习结局等心理过程信号；认知/社会行为不自动等同于人类模拟。保留匹配词供审查。
- 先按DOI、规范化标题或来源ID合并已检索版本，再取样本内最早已知日期；无法保证找全作品的旧版本。日报窗口90天，周报7天；缺失或未来日期排除。
- 每日3条按90−样本内最早已知发表年龄+标题主题信号排序，优先方向多样性。分数不是质量、影响力或疗效。
- 周报每周一更新，并在筛选规则变化时重算；五个预设方向按样本数排序，保留逐篇标题、链接、日期和匹配信号。零值不代表没有研究，不能称全领域前五。
- 单源失败可更新足量候选，但标明覆盖不完整；全部失败或不足3条保留旧日报与日期。HTTP429停止即时重试并冷却24小时。
- 来源全部可用只表示配置来源请求成功，不等于全领域完整覆盖。人工综述、挑战和图谱独立维护，自动任务不改写结论。

The public metadata sample uses Europe PMC and arXiv with documented caps. Screening requires LLM focus plus psychological processes or tasks; educational matches additionally require learning/process signals. Retrieved versions are grouped before date filtering, preserving the earliest observed date and linked-version date. Daily selection considers recency, relevance and direction diversity. Weekly counts retain paper-level audit metadata and rank the five preset categories. Source status, cooldowns and snapshot dates are recorded separately; curated reviews and graph mappings are maintained independently.

### 文献与原链接 / References and original links


#### 1. Psychometric applications of generative artificial intelligence: Lifecycle, risks, and research agenda

[原始来源 / Original source](https://doi.org/10.1371/journal.pmen.0000702)

- 所引版本 / Cited version: **2026-09-23** · 叙述性综述 / 生命周期框架
- 日期说明：出版社明确标注 Published 日期。
- 范围：心理测量、生成式评估、数字行为指标
- 综述内容：区分用 GenAI 支持心理测量与用心理测量评价 GenAI；从构念定义、校准到公平性和部署监测建立验证链。
- 证据范围与限制：不是系统综述或效果量汇总；生成指标的流畅性不能证明构念效度，仍需真实人类数据验证。

**English summary:** A narrative lifecycle framework for GenAI-assisted measurement and psychometric evaluation of GenAI. Construct definition, calibration, fairness and monitoring require human reference data; this article provides a research agenda rather than a pooled effect estimate.

#### 2. From Prompts to Constructs: A Dual-Validity Framework for Large Language Model Research in Psychology

[原始来源 / Original source](https://doi.org/10.1146/annurev-psych-100925-034807)

- 所引版本 / Cited version: **2026-08-10** · 理论 / 方法学综述
- 日期说明：所引用期刊版本于2026-08-10在线先行，编入2027年第78卷；工作预印本已于2025-06-20公开，2026-08-15修订。
- 预印本首发 / First preprint: 2025-06-20
- 范围：心理测量、因果推断、认知建模、人类模拟
- 综述内容：工具性能、行为描述、人类模拟和认知机制主张需要逐层提高证据要求；需同时验证测量解释和因果推断。
- 证据范围与限制：提供评价框架，不是临床试验或定量系统综述；在线先行稿可能修改。

**English summary:** A methodological framework linking measurement validity with causal inference across tool use, behavioral characterization, human simulation and cognitive modeling. The cited journal version appeared online in 2026; the work's preprint was already public in June 2025.

#### 3. Generative Large Language Models in Mental Health Care Settings: Systematic Review and Meta-Analysis

[原始来源 / Original source](https://doi.org/10.2196/87730)

- 所引版本 / Cited version: **2026-08-31** · 系统综述与元分析
- 日期说明：期刊正式发表日期；早期预印本2025-11-13；最终检索更新至2026-03。
- 检索截至 / Search cutoff: 2026-03
- 范围：心理健康筛查、诊断、决策支持、治疗辅助和文书
- 综述内容：纳入66项研究，其中37项情境/模拟研究、22项回顾性研究、7项前瞻研究；较有希望的是结构明确的语言任务。
- 证据范围与限制：诊断元分析仅8项研究，异质性及预测区间很大；不能据此宣称临床有效或可无人监督部署。 作者评定多数领域为低确定性，文档/监测为中等，但该领域未有前瞻实施研究；专业监督本身不能替代验证。

**English summary:** The review contains 66 studies: 37 vignette/simulation, 22 retrospective and 7 prospective. Eight studies enter the diagnostic meta-analysis. Most domains have low-certainty evidence; documentation/monitoring is rated moderate but lacks prospective implementation studies. Heterogeneity and broad prediction intervals bound interpretation.

#### 4. A Review of Incorporating Psychological Theories in LLMs

[原始来源 / Original source](https://aclanthology.org/2026.eacl-long.350/)

- 所引版本 / Cited version: **2026-03** · 跨学科文献综述
- 日期说明：ACL元数据仅精确至2026年3月；会议日期为3月24–29日，不伪造单日发表日期。
- 范围：认知、发展、行为、社会、人格心理学与心理语言学
- 综述内容：按模型开发阶段梳理心理理论如何指导LLM，帮助区分心理学启发的工程设计与对人类心理机制的证据。
- 证据范围与限制：不是儿童使用LLM的安全性或发展效果综述；不能把理论映射理解为模型具有人类心理特征。

**English summary:** This cross-disciplinary review organizes psychological theories by stages of LLM development. It connects cognitive, developmental, behavioral, social, personality and language research to engineering design; dedicated evidence on children's developmental outcomes remains a separate requirement.

#### 5. Large Language Models as Psychological Simulators: A Methodological Guide

[原始来源 / Original source](https://doi.org/10.1177/25152459251410153)

- 所引版本 / Cited version: **2026-02-25** · 方法学指南 / 证据综合（非系统综述）
- 日期说明：SAGE标注 First published online；不是DOI中2025字段对应的发表年份。
- 范围：角色与人格模拟、社会行为、认知过程建模
- 综述内容：提出实施混淆检查、超越人口统计标签的人格构建，以及直接、间接、生成式三层验证。
- 证据范围与限制：出版社归类为研究文章；不是PRISMA系统综述。模拟可信度受到提示、文化覆盖、训练截止日期影响。

**English summary:** A methodological guide covering implementation confounds, richer persona construction, and direct, indirect and generative validation. The publisher classifies it as a research article. Simulation validity depends on prompts, cultural coverage and model data cutoffs.

#### 6. The Role of Generative AI in Advancing Educational Technology Research: A Systematic Review of Qualitative Data Analysis

[原始来源 / Original source](https://doi.org/10.17977/um039v11i12026p108-127)

- 所引版本 / Cited version: **2026-04-30** · 系统综述
- 日期说明：期刊文章页明确 Published 2026-04-30。
- 范围：访谈、焦点小组、主题编码、人机协作质性分析
- 综述内容：综述30项研究，支持LLM辅助编码而非替代研究者；文化语境与解释深度仍需要人的判断。
- 证据范围与限制：教育技术邻近领域，不能自动推广到所有心理学范式；编码一致性不等于解释有效性，文献包含预印本。

**English summary:** A systematic review of 30 studies of LLM-assisted qualitative analysis, discussed in an educational-technology context, covering interviews, focus groups and thematic coding. Human interpretation and cultural context remain central. The current audit verified its abstract and metadata; full PDF access returned 403.

#### 7. The psychology of learning with generative AI in foreign language education: building a theory of metacognition, trust, and human–AI co-regulation through a systematic review

[原始来源 / Original source](https://doi.org/10.3389/fpsyg.2026.1974520)

- 所引版本 / Cited version: **2026-10-08** · 理论构建型系统综述
- 日期说明：Frontiers正式发表日期；纳入研究检索截至2026年6月。
- 检索截至 / Search cutoff: 2026-06-16
- 范围：教育心理、元认知、信任校准、共同调节
- 综述内容：纳入51项实证研究，提出元认知—信任—共同调节框架；教育价值取决于学习者对AI输出的检查与自主决策。
- 证据范围与限制：限于外语学习。单作者提取和编码，无独立复核或编码者一致性程序，也未做正式质量或偏倚评估；框架不是因果机制验证，不能外推儿童长期发展效果。

**English summary:** A theory-building review of 51 studies in foreign-language education, searched through June 16, 2026. Extraction and coding were conducted by one author, with no independent verification or formal quality/risk-of-bias appraisal. The framework concerns metacognition, trust and co-regulation; causal mechanisms and long-term child outcomes require separate evaluation.

#### 8. Through the looking glass: a synthesis of systematic reviews and meta-analyses on pedagogy paradigms facilitated by large language models

[原始来源 / Original source](https://doi.org/10.1186/s40561-026-00449-x)

- 所引版本 / Cited version: **2026-03-23** · 综述的综述 / 系统证据综合
- 日期说明：Springer正式发表日期。
- 检索截至 / Search cutoff: 2025-08
- 范围：教育心理、认知任务、学习支架、学习者自主性
- 综述内容：作者报告纳入50篇综述，梳理建构主义、认知主义与联通主义等教学范式；正文筛选及质量分组数字合计49，数量不一致待核对。
- 证据范围与限制：检索截至2025-08，检索范围包含一般聊天机器人及智能辅导系统，不能全算纯LLM证据。二级证据可能重复纳入原始研究；正文数量不一致，不能视为50项独立试验或长期学习收益证明。

**English summary:** The authors report 50 reviews, while selection arithmetic and quality groups each total 49; the atlas flags this internal inconsistency. The search ends in August 2025 and includes broader chatbots and intelligent tutoring systems. Overlap among underlying studies limits interpretation of the review count.

#### 9. Large Language Model Psychometrics: A Systematic Review of Evaluation, Validation, and Enhancement

[原始来源 / Original source](https://arxiv.org/abs/2505.08245)

- 所引版本 / Cited version: **2025-05-13** · 系统综述预印本
- 日期说明：v1为2025-05-13，早于一年窗口；v3更新于2026-03-11。不得将修订日期冒充首次发表。
- 预印本首发 / First preprint: 2025-05-13
- 范围：模型人格、价值观、智力及心理测量评价
- 综述内容：提供LLM心理测量的评价、验证和增强框架，作为近期综述的背景阅读。
- 证据范围与限制：预印本，原始首发在窗口外；给模型施测人类量表不自动建立跨实体构念效度。

**English summary:** A systematic-review preprint on psychological constructs, instruments, reliability, validity and model enhancement. First released in May 2025 and revised in March 2026, it is retained as an older foundation. Cross-entity construct equivalence requires validation.

#### 10. Large Language Models in Mental Health Research and Treatment

[原始来源 / Original source](https://doi.org/10.1146/annurev-biodatasci-092524-113527)

- 所引版本 / Cited version: **2026-05-18** · 叙述性综述
- 日期说明：Review in Advance 首发2026-05-18；卷刊日期2026-08。
- 范围：语言评估、数字表型、电子病历分析与治疗早期应用
- 综述内容：连接语言测量、心理健康研究和早期干预，讨论偏差、幻觉、隐私及不适当建议。
- 证据范围与限制：不是定量疗效汇总；数字表型相关性不等于个体诊断有效，不能证明无人监督治疗安全。

**English summary:** A narrative synthesis of language assessment, digital phenotyping, electronic health records and early psychotherapy applications. Bias, hallucinations, inappropriate recommendations and governance are major research issues; it provides conceptual synthesis rather than a pooled treatment-effect estimate.

#### 11. Safety Mechanisms and Risk Mitigation in Generative AI Mental Health Chatbots: A Systematic Scoping Review

[原始来源 / Original source](https://doi.org/10.3390/healthcare14101395)

- 所引版本 / Cited version: **2026-05-20** · 系统范围综述
- 日期说明：正式发表2026-05-20；检索截至2025-07，发表新近不等于证据检索新近。
- 检索截至 / Search cutoff: 2025-07
- 范围：心理健康生成式AI聊天机器人的安全机制、危机转介与不良事件报告
- 综述内容：综合21项研究，梳理监督、限制与危机应对机制，指出转介及不良事件监测报告不足。
- 证据范围与限制：范围综述，不是安全机制效果量汇总；机制出现频率不能证明有效，离线测试不能推断真实危机处置安全。

**English summary:** A systematic scoping review of 21 studies, searched through July 2025, mapping technical controls, oversight, crisis referral and adverse-event monitoring. Safeguard reporting and implementation vary; frequencies of mechanisms provide descriptive context rather than evidence of their effectiveness.

#### 12. A reporting checklist for large language models in behavioural science

[原始来源 / Original source](https://www.nature.com/articles/s41562-026-02492-7)

- 所引版本 / Cited version: **2026-06-09** · 方法报告规范 / Comment
- 日期说明：Nature Human Behaviour正式上线2026-06-09。
- 范围：行为科学LLM研究的透明性、复现与伦理记录
- 综述内容：提供研究设计、模型与提示、数据、评价和结果报告的清单。
- 证据范围与限制：报告规范本身不证明研究有效、构念成立或临床可用；不是系统综述。

**English summary:** Reporting guidance for transparent, reproducible and ethically documented behavioral-science LLM research. The checklist covers study design, models/prompts, data, evaluation and results. It is a methods Comment rather than a systematic review.

## Maintain and validate

```sh
python -m unittest discover -s tests -p 'test_*.py' -v
node --test tests/test_*.cjs
node --check site/app.js
node --check site/i18n.js
python scripts/build_data.py
python scripts/refresh.py --force-weekly
python tests/browser_smoke.py
```

Browser checks use Playwright 1.56.0/Chromium installed by the Pages workflow. Chinese and English are checked at desktop and narrow widths, including saved preferences, filters, node links, resources, source-state labels and actual JSON downloads. The live check compares the deployed radar and language bundle with the checked snapshot.

Canonical data remains in `data/`; browser bundles remain in `site/`. `site/i18n.js` contains interface and English research-label translations. When adding nodes, directions or challenges, update translation coverage with the data. [Review audit](docs/REVIEW-AUDIT.md)
