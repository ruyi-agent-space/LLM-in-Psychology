window.RADAR_DATA = {
  "lastAttemptAt": "2026-11-24T16:59:46Z",
  "dailyUpdatedAt": "2026-11-24T16:59:46Z",
  "weeklyUpdatedAt": "2026-11-23T17:27:57Z",
  "status": {
    "state": "ok",
    "message": "公开元数据刷新成功；精选综述独立维护。",
    "sourceResults": [
      {
        "source": "Europe PMC",
        "state": "ok",
        "count": 300,
        "lastAttemptAt": "2026-11-24T16:59:46Z"
      },
      {
        "source": "arXiv",
        "state": "ok",
        "count": 200,
        "lastAttemptAt": "2026-11-24T16:59:46Z"
      }
    ]
  },
  "daily": [
    {
      "id": "epmc:MED:43073188",
      "title": "When Patients Speak More to Machines: Active Ingredients, Mechanisms, and Limitations of Mental Health Support from Large Language Models. ",
      "url": "https://doi.org/10.1192/j.eurpsy.2026.12280",
      "publishedAt": "2026-11-24T00:00:00Z",
      "recordPublishedAt": "2026-11-24",
      "updatedAt": null,
      "type": "paper",
      "source": "Europe PMC",
      "theme": "clinical",
      "dateBasis": "earliest_retrieved_version",
      "versions": [
        {
          "id": "epmc:MED:43073188",
          "source": "Europe PMC",
          "url": "https://doi.org/10.1192/j.eurpsy.2026.12280",
          "publishedAt": "2026-11-24",
          "type": "paper"
        }
      ],
      "matchedSignals": [
        "LLM-primary:title",
        "clinical:mental health"
      ],
      "reason": "公开元数据筛选：LLM为主要主题，并匹配心理学过程/任务；按样本内最早已知日期与标题相关信号排序，优先方向多样性。",
      "caution": "仅元数据筛选，不是质量评审；预印本可能未经同行评审，临床结论需独立验证。"
    },
    {
      "id": "epmc:PPR:PPR1374310",
      "title": "An Exploratory Study on Perceptibility of Personality-Conditioned AI-Generated Virtual Patient Dialogue",
      "url": "https://doi.org/10.21203/rs.3.rs-11640898/v1",
      "publishedAt": "2026-11-23T00:00:00Z",
      "recordPublishedAt": "2026-11-23",
      "updatedAt": null,
      "type": "preprint",
      "source": "Europe PMC",
      "theme": "measurement",
      "dateBasis": "earliest_retrieved_version",
      "versions": [
        {
          "id": "epmc:PPR:PPR1374310",
          "source": "Europe PMC",
          "url": "https://doi.org/10.21203/rs.3.rs-11640898/v1",
          "publishedAt": "2026-11-23",
          "type": "preprint"
        }
      ],
      "matchedSignals": [
        "LLM-primary:abstract>=2",
        "measurement:big five",
        "measurement:personality"
      ],
      "reason": "公开元数据筛选：LLM为主要主题，并匹配心理学过程/任务；按样本内最早已知日期与标题相关信号排序，优先方向多样性。",
      "caution": "仅元数据筛选，不是质量评审；预印本可能未经同行评审，临床结论需独立验证。"
    },
    {
      "id": "epmc:PPR:PPR1375035",
      "title": "Do AI Systems Zone Out? Functional Homeostasis and Graceful Degradation in LLM Agents under Cognitive Load",
      "url": "https://doi.org/10.21203/rs.3.rs-11810033/v1",
      "publishedAt": "2026-11-23T00:00:00Z",
      "recordPublishedAt": "2026-11-23",
      "updatedAt": null,
      "type": "preprint",
      "source": "Europe PMC",
      "theme": "simulation",
      "dateBasis": "earliest_retrieved_version",
      "versions": [
        {
          "id": "epmc:PPR:PPR1375035",
          "source": "Europe PMC",
          "url": "https://doi.org/10.21203/rs.3.rs-11810033/v1",
          "publishedAt": "2026-11-23",
          "type": "preprint"
        }
      ],
      "matchedSignals": [
        "LLM-primary:title",
        "simulation:cogniti"
      ],
      "reason": "公开元数据筛选：LLM为主要主题，并匹配心理学过程/任务；按样本内最早已知日期与标题相关信号排序，优先方向多样性。",
      "caution": "仅元数据筛选，不是质量评审；预印本可能未经同行评审，临床结论需独立验证。"
    }
  ],
  "weekly": [
    {
      "id": "simulation",
      "title": "认知与社会行为 · Cognition & social behavior",
      "question": "如何检验认知测量、社会行为研究与人类模拟的外部效度？",
      "signal": "过去 7 天检索样本 13 条；仅在五个预设方向中按数量排序。",
      "count": 13,
      "sourceIds": [
        "epmc:MED:43043919",
        "epmc:MED:43064238",
        "arxiv:2611.22006",
        "arxiv:2611.22252",
        "arxiv:2611.22415",
        "arxiv:2611.23106",
        "arxiv:2611.24149",
        "arxiv:2611.24830",
        "arxiv:2611.25502",
        "epmc:PPR:PPR1369538",
        "epmc:PPR:PPR1371543",
        "epmc:PPR:PPR1372358",
        "epmc:PPR:PPR1372583"
      ],
      "papers": [
        {
          "id": "epmc:MED:43043919",
          "title": "Human-AI rating asymmetries across evaluative dimensions in instruction-tuned open-weight language models: A descriptive multi-model audit.",
          "url": "https://doi.org/10.1371/journal.pone.0354555",
          "publishedAt": "2026-11-17T00:00:00Z",
          "recordPublishedAt": "2026-11-17",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:title",
            "simulation:decision-making",
            "simulation:moral judgment"
          ]
        },
        {
          "id": "epmc:MED:43064238",
          "title": "Artificial Intelligence in Thoracic Pathology and Biomarker Assessment: An IASLC Pathology Committee Review.",
          "url": "https://doi.org/10.1016/j.jtho.2026.106259",
          "publishedAt": "2026-11-20T00:00:00Z",
          "recordPublishedAt": "2026-11-20",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:abstract>=2",
            "simulation:cogniti"
          ]
        },
        {
          "id": "arxiv:2611.22006",
          "title": "Supporting Researcher Control in AI-Assisted Social Media Analysis: A Mixed-Methods Study of AI4OSN",
          "url": "https://arxiv.org/abs/2611.22006v1",
          "publishedAt": "2026-11-16T23:40:20Z",
          "recordPublishedAt": "2026-11-16T23:40:20Z",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:abstract>=2",
            "simulation:cogniti",
            "simulation:decision-making"
          ]
        },
        {
          "id": "arxiv:2611.22252",
          "title": "A Visual Information Extraction System Using Multimodal Large Language Models for Scanned Cognitive and Behavioral Assessments",
          "url": "https://arxiv.org/abs/2611.22252v1",
          "publishedAt": "2026-11-17T05:56:48Z",
          "recordPublishedAt": "2026-11-17T05:56:48Z",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:title",
            "simulation:cogniti"
          ]
        },
        {
          "id": "arxiv:2611.22415",
          "title": "SpatialMind: Adaptive Multi-Level Geometric Fusion for Spatial Reasoning in Multimodal Large Language Models",
          "url": "https://arxiv.org/abs/2611.22415v1",
          "publishedAt": "2026-11-17T08:51:37Z",
          "recordPublishedAt": "2026-11-17T08:51:37Z",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:title",
            "simulation:cogniti"
          ]
        },
        {
          "id": "arxiv:2611.23106",
          "title": "Natural Language Programming: Rethinking Language, Memory, and Cognition in the Era of Generative AI",
          "url": "https://arxiv.org/abs/2611.23106v1",
          "publishedAt": "2026-11-17T17:27:01Z",
          "recordPublishedAt": "2026-11-17T17:27:01Z",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:title",
            "simulation:cogniti"
          ]
        },
        {
          "id": "arxiv:2611.24149",
          "title": "Human-LLM Cognitive Extension: A Framework for Studying Coupled Cognition",
          "url": "https://arxiv.org/abs/2611.24149v1",
          "publishedAt": "2026-11-18T09:54:43Z",
          "recordPublishedAt": "2026-11-18T09:54:43Z",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:title",
            "simulation:cogniti"
          ]
        },
        {
          "id": "arxiv:2611.24830",
          "title": "A Foundation Model to Measure and Predict Human Behaviour",
          "url": "https://arxiv.org/abs/2611.24830v1",
          "publishedAt": "2026-11-18T17:59:08Z",
          "recordPublishedAt": "2026-11-18T17:59:08Z",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:abstract>=2",
            "simulation:human behavio"
          ]
        },
        {
          "id": "arxiv:2611.25502",
          "title": "Coordinated Use of Large Language Models in Academic Research",
          "url": "https://arxiv.org/abs/2611.25502v1",
          "publishedAt": "2026-11-19T04:47:57Z",
          "recordPublishedAt": "2026-11-19T04:47:57Z",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:title",
            "simulation:cogniti"
          ]
        },
        {
          "id": "epmc:PPR:PPR1369538",
          "title": "Thinking With AI, Reasoning Without It: Cognitive Offloading to Generative AI Weakens Effort Regulation",
          "url": "https://doi.org/10.31234/osf.io/83jum",
          "publishedAt": "2026-11-17T00:00:00Z",
          "recordPublishedAt": "2026-11-17",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:title",
            "simulation:cogniti"
          ]
        },
        {
          "id": "epmc:PPR:PPR1371543",
          "title": "Human-first learning: scaffolding reasoning before AI assistance improves diagnostic accuracy",
          "url": "https://doi.org/10.21203/rs.3.rs-11417031/v1",
          "publishedAt": "2026-11-19T00:00:00Z",
          "recordPublishedAt": "2026-11-19",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:abstract>=2",
            "simulation:cogniti"
          ]
        },
        {
          "id": "epmc:PPR:PPR1372358",
          "title": "A Multi-Agent Knowledge-Based System for Epistemic Uncertainty Management in Data Center Applications: Integrating Thermodynamic Optimization and Large Language Models for Reliable Operational Decision Support",
          "url": "https://doi.org/10.20944/preprints202611.1886.v1",
          "publishedAt": "2026-11-18T00:00:00Z",
          "recordPublishedAt": "2026-11-18",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:title",
            "simulation:cogniti",
            "simulation:decision-making"
          ]
        },
        {
          "id": "epmc:PPR:PPR1372583",
          "title": "A Comprehensive Survey of the LLM-Based Agent: The Contextual Cognition Perspective",
          "url": "https://doi.org/10.20944/preprints202604.0935.v2",
          "publishedAt": "2026-11-19T00:00:00Z",
          "recordPublishedAt": "2026-11-19",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:title",
            "simulation:cogniti"
          ]
        }
      ]
    },
    {
      "id": "clinical",
      "title": "临床与心理健康 · Clinical & mental health",
      "question": "如何验证心理支持的安全性与真实临床效益？",
      "signal": "过去 7 天检索样本 6 条；仅在五个预设方向中按数量排序。",
      "count": 6,
      "sourceIds": [
        "epmc:MED:43044101",
        "epmc:MED:43045144",
        "epmc:MED:43050295",
        "arxiv:2611.22248",
        "epmc:PPR:PPR1373350",
        "epmc:PPR:PPR1373409"
      ],
      "papers": [
        {
          "id": "epmc:MED:43044101",
          "title": "Using a Large Language Model Chatbot for Allergen Avoidance Counseling in Contact Dermatitis: Quantitative Evaluation Study.",
          "url": "https://doi.org/10.2196/100364",
          "publishedAt": "2026-11-17T00:00:00Z",
          "recordPublishedAt": "2026-11-17",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:title",
            "clinical:counseling"
          ]
        },
        {
          "id": "epmc:MED:43045144",
          "title": "Generative artificial intelligence in psychotherapy: a multicountry qualitative analysis of mental health professionals' open-text survey responses.",
          "url": "https://doi.org/10.1136/bmjment-2026-302991",
          "publishedAt": "2026-11-17T00:00:00Z",
          "recordPublishedAt": "2026-11-17",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:title",
            "clinical:mental health",
            "clinical:psychotherap"
          ]
        },
        {
          "id": "epmc:MED:43050295",
          "title": "Performance of AI models in ECG interpretation and risk stratification for major adverse cardiac events in the emergency department.",
          "url": "https://doi.org/10.1177/09287329261509123",
          "publishedAt": "2026-11-18T00:00:00Z",
          "recordPublishedAt": "2026-11-18",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:abstract>=2",
            "clinical:depressi"
          ]
        },
        {
          "id": "arxiv:2611.22248",
          "title": "OAK-Mind: Zero-Training Mental Health Change Inference from Passive Sensing via Knowledge-Grounded Multi-Agent LLMs",
          "url": "https://arxiv.org/abs/2611.22248v1",
          "publishedAt": "2026-11-17T05:52:52Z",
          "recordPublishedAt": "2026-11-17T05:52:52Z",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:title",
            "clinical:mental health"
          ]
        },
        {
          "id": "epmc:PPR:PPR1373350",
          "title": "Global Displacement Patterns and Healthcare Access Among Ukrainian Refugees: A Mixed-Methods Analysis",
          "url": "https://doi.org/10.21203/rs.3.rs-11721475/v1",
          "publishedAt": "2026-11-20T00:00:00Z",
          "recordPublishedAt": "2026-11-20",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:abstract>=2",
            "clinical:mental health"
          ]
        },
        {
          "id": "epmc:PPR:PPR1373409",
          "title": "Examining HiTOP Through Naturalistic Symptom Descriptions in Anonymous Online Mental Health Forums: A Mixed-Methods Study Protocol",
          "url": "https://doi.org/10.31234/osf.io/ahrts",
          "publishedAt": "2026-11-20T00:00:00Z",
          "recordPublishedAt": "2026-11-20",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:abstract>=2",
            "clinical:depressi",
            "clinical:mental health"
          ]
        }
      ]
    },
    {
      "id": "methods",
      "title": "质性方法与可复现性 · Qualitative methods & reproducibility",
      "question": "如何审计质性编码、数据泄漏和复现流程？",
      "signal": "过去 7 天检索样本 5 条；仅在五个预设方向中按数量排序。",
      "count": 5,
      "sourceIds": [
        "epmc:MED:43044104",
        "epmc:MED:43044766",
        "epmc:MED:43063990",
        "arxiv:2611.21476",
        "epmc:PPR:PPR1370974"
      ],
      "papers": [
        {
          "id": "epmc:MED:43044104",
          "title": "Use of Large Language Models for Structured Quantitative and Qualitative Analysis of Simulation Debriefings Using the DASH Framework (AIDE Study): Prospective Observational Study.",
          "url": "https://doi.org/10.2196/101797",
          "publishedAt": "2026-11-17T00:00:00Z",
          "recordPublishedAt": "2026-11-17",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:title",
            "methods:qualitative"
          ]
        },
        {
          "id": "epmc:MED:43044766",
          "title": "Generative Artificial Intelligence-Based Dietary Advice: A Scoping Review of Nutritional Accuracy, Safety, and Eating-Related Risks.",
          "url": "https://doi.org/10.1016/j.clnesp.2026.105251",
          "publishedAt": "2026-11-17T00:00:00Z",
          "recordPublishedAt": "2026-11-17",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:title",
            "methods:reproducib"
          ]
        },
        {
          "id": "epmc:MED:43063990",
          "title": "Evaluating a Large Language Model Conversational Agent for Collecting Standardized Back Pain Data: A Cross-Over Study of Accuracy, Usability, and User Preference.",
          "url": "https://doi.org/10.1055/a-3009-7011",
          "publishedAt": "2026-11-20T00:00:00Z",
          "recordPublishedAt": "2026-11-20",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:title",
            "methods:qualitative"
          ]
        },
        {
          "id": "arxiv:2611.21476",
          "title": "Generative AI and the Crisis of Higher Education Assessments: Examining 'AI-Proofing' Strategies for College-Level Assessments",
          "url": "https://arxiv.org/abs/2611.21476v1",
          "publishedAt": "2026-11-16T17:50:14Z",
          "recordPublishedAt": "2026-11-16T17:50:14Z",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:title",
            "methods:thematic analys"
          ]
        },
        {
          "id": "epmc:PPR:PPR1370974",
          "title": "How closely do large language model scores from parent interviews match self-reported parenting?",
          "url": "https://doi.org/10.31234/osf.io/47nvm",
          "publishedAt": "2026-11-18T00:00:00Z",
          "recordPublishedAt": "2026-11-18",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:title",
            "methods:qualitative"
          ]
        }
      ]
    },
    {
      "id": "education",
      "title": "教育与发展 · Education & development",
      "question": "学习与发展结果如何在真实环境中验证？",
      "signal": "过去 7 天检索样本 2 条；仅在五个预设方向中按数量排序。",
      "count": 2,
      "sourceIds": [
        "arxiv:2611.25428",
        "epmc:PPR:PPR1369713"
      ],
      "papers": [
        {
          "id": "arxiv:2611.25428",
          "title": "GenAI-DBT: Evaluating a DBT-Informed Generative AI Platform for Mindfulness Skills Training: A Pilot Randomized Study",
          "url": "https://arxiv.org/abs/2611.25428v1",
          "publishedAt": "2026-11-19T03:09:14Z",
          "recordPublishedAt": "2026-11-19T03:09:14Z",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:title",
            "education:student"
          ]
        },
        {
          "id": "epmc:PPR:PPR1369713",
          "title": "Assessing the Learning Gains and User Experience of Large Language Model Simulations for Clinical Medical Education: A Pilot Observational Study",
          "url": "https://doi.org/10.21203/rs.3.rs-10529565/v1",
          "publishedAt": "2026-11-17T00:00:00Z",
          "recordPublishedAt": "2026-11-17",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:title",
            "education:educati",
            "education:learning outcome",
            "education:student"
          ]
        }
      ]
    },
    {
      "id": "measurement",
      "title": "心理测量 · Psychometrics",
      "question": "量表、人格与偏差测量是否具有构念效度？",
      "signal": "过去 7 天检索样本 2 条；仅在五个预设方向中按数量排序。",
      "count": 2,
      "sourceIds": [
        "arxiv:2611.22761",
        "arxiv:2611.24888"
      ],
      "papers": [
        {
          "id": "arxiv:2611.22761",
          "title": "Network-Exposed Configuration Attacks on LLM-Controlled Social Robots",
          "url": "https://arxiv.org/abs/2611.22761v1",
          "publishedAt": "2026-11-17T13:27:57Z",
          "recordPublishedAt": "2026-11-17T13:27:57Z",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:title",
            "measurement:personality"
          ]
        },
        {
          "id": "arxiv:2611.24888",
          "title": "Who are you? The Personal Imitation Game",
          "url": "https://arxiv.org/abs/2611.24888v1",
          "publishedAt": "2026-11-18T18:32:14Z",
          "recordPublishedAt": "2026-11-18T18:32:14Z",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:abstract>=2",
            "measurement:personality"
          ]
        }
      ]
    }
  ],
  "methodology": [
    "公开元数据样本：Europe PMC最多300条，arXiv最多200条；记录查询、条数上限及达到上限的状态；数据库覆盖有偏差，不是穷尽检索。",
    "LLM需在标题出现或摘要至少提及两次；教育主题另需元认知、学习结局等心理过程信号；认知/社会行为不自动等同于人类模拟。保留匹配词供审查。",
    "先按DOI、规范化标题或来源ID合并已检索版本，再取样本内最早已知日期；无法保证找全作品的旧版本。日报窗口90天，周报7天；缺失或未来日期排除。",
    "每日3条按90−样本内最早已知发表年龄+标题主题信号排序，优先方向多样性。分数不是质量、影响力或疗效。",
    "周报每周一更新，并在筛选规则变化时重算；五个预设方向按样本数排序，保留逐篇标题、链接、日期和匹配信号。零值不代表没有研究，不能称全领域前五。",
    "单源失败可更新足量候选，但标明覆盖不完整；全部失败或不足3条保留旧日报与日期。HTTP429停止即时重试并冷却24小时。",
    "来源全部可用只表示配置来源请求成功，不等于全领域完整覆盖。人工综述、挑战和图谱独立维护，自动任务不改写结论。"
  ],
  "dailyCoverage": "complete",
  "lastCompleteDailyAt": "2026-11-24T16:59:46Z",
  "weeklyCoverage": "complete",
  "lastCompleteWeeklyAt": "2026-11-23T17:27:57Z",
  "screeningVersion": "1.1.0",
  "attemptCoverage": {
    "recordsFetched": 500,
    "deduplicatedRecords": 496,
    "eligibleRecords": 121,
    "sourceLimits": {
      "Europe PMC": 300,
      "arXiv": 200
    },
    "sourceResults": [
      {
        "source": "Europe PMC",
        "state": "ok",
        "count": 300,
        "limitReached": true
      },
      {
        "source": "arXiv",
        "state": "ok",
        "count": 200,
        "limitReached": true
      }
    ],
    "dateBasis": "earliest retrieved version; earlier unobserved versions may exist",
    "windowStart": "2026-08-26T16:59:46Z",
    "windowEnd": "2026-11-24T16:59:46Z",
    "queries": {
      "Europe PMC": "(large language model OR large language models OR ChatGPT) AND (psychology OR mental OR cognitive OR personality OR education OR qualitative), FIRST_PDATE within 90 days",
      "arXiv": "(large language model OR ChatGPT) AND (psychology OR mental health OR cognitive OR personality OR education OR qualitative), submittedDate descending"
    }
  },
  "dailyPolicyVersion": "1.1.0",
  "dailySample": {
    "recordsFetched": 500,
    "deduplicatedRecords": 496,
    "eligibleRecords": 121,
    "sourceLimits": {
      "Europe PMC": 300,
      "arXiv": 200
    },
    "sourceResults": [
      {
        "source": "Europe PMC",
        "state": "ok",
        "count": 300,
        "limitReached": true
      },
      {
        "source": "arXiv",
        "state": "ok",
        "count": 200,
        "limitReached": true
      }
    ],
    "dateBasis": "earliest retrieved version; earlier unobserved versions may exist",
    "windowStart": "2026-08-26T16:59:46Z",
    "windowEnd": "2026-11-24T16:59:46Z",
    "queries": {
      "Europe PMC": "(large language model OR large language models OR ChatGPT) AND (psychology OR mental OR cognitive OR personality OR education OR qualitative), FIRST_PDATE within 90 days",
      "arXiv": "(large language model OR ChatGPT) AND (psychology OR mental health OR cognitive OR personality OR education OR qualitative), submittedDate descending"
    }
  },
  "weeklySample": {
    "recordsFetched": 500,
    "deduplicatedRecords": 497,
    "eligibleRecords": 121,
    "sourceLimits": {
      "Europe PMC": 300,
      "arXiv": 200
    },
    "sourceResults": [
      {
        "source": "Europe PMC",
        "state": "ok",
        "count": 300,
        "limitReached": true
      },
      {
        "source": "arXiv",
        "state": "ok",
        "count": 200,
        "limitReached": true
      }
    ],
    "dateBasis": "earliest retrieved version; earlier unobserved versions may exist",
    "windowStart": "2026-11-16T17:27:57Z",
    "windowEnd": "2026-11-23T17:27:57Z",
    "queries": {
      "Europe PMC": "(large language model OR large language models OR ChatGPT) AND (psychology OR mental OR cognitive OR personality OR education OR qualitative), FIRST_PDATE within 90 days",
      "arXiv": "(large language model OR ChatGPT) AND (psychology OR mental health OR cognitive OR personality OR education OR qualitative), submittedDate descending"
    },
    "weeklyRecords": 28
  },
  "weeklyPolicyVersion": "1.1.0"
};
