window.RADAR_DATA = {
  "lastAttemptAt": "2026-11-22T14:06:16Z",
  "dailyUpdatedAt": "2026-11-22T14:06:16Z",
  "weeklyUpdatedAt": "2026-11-16T14:52:38Z",
  "status": {
    "state": "partial",
    "message": "部分来源失败或处于冷却期；可用来源继续更新，样本覆盖不完整。",
    "sourceResults": [
      {
        "source": "Europe PMC",
        "state": "ok",
        "count": 300,
        "lastAttemptAt": "2026-11-22T14:06:16Z"
      },
      {
        "source": "arXiv",
        "state": "error",
        "message": "HTTP Error 429: Unknown Error",
        "lastAttemptAt": "2026-11-22T14:06:16Z",
        "httpStatus": 429,
        "retryAfterAt": "2026-11-23T14:06:16Z"
      }
    ]
  },
  "daily": [
    {
      "id": "epmc:MED:43045144",
      "title": "Generative artificial intelligence in psychotherapy: a multicountry qualitative analysis of mental health professionals' open-text survey responses.",
      "url": "https://doi.org/10.1136/bmjment-2026-302991",
      "publishedAt": "2026-11-17T00:00:00Z",
      "recordPublishedAt": "2026-11-17",
      "updatedAt": null,
      "type": "paper",
      "source": "Europe PMC",
      "theme": "clinical",
      "dateBasis": "earliest_retrieved_version",
      "versions": [
        {
          "id": "epmc:MED:43045144",
          "source": "Europe PMC",
          "url": "https://doi.org/10.1136/bmjment-2026-302991",
          "publishedAt": "2026-11-17",
          "type": "paper"
        }
      ],
      "matchedSignals": [
        "LLM-primary:title",
        "clinical:mental health",
        "clinical:psychotherap"
      ],
      "reason": "公开元数据筛选：LLM为主要主题，并匹配心理学过程/任务；按样本内最早已知日期与标题相关信号排序，优先方向多样性。",
      "caution": "仅元数据筛选，不是质量评审；预印本可能未经同行评审，临床结论需独立验证。"
    },
    {
      "id": "epmc:MED:43040009",
      "title": "Cognitive grounding improves LLM simulation of collective human behavior.",
      "url": "https://doi.org/10.1038/s43588-026-01080-z",
      "publishedAt": "2026-11-16T00:00:00Z",
      "recordPublishedAt": "2026-11-16",
      "updatedAt": null,
      "type": "paper",
      "source": "Europe PMC",
      "theme": "simulation",
      "dateBasis": "earliest_retrieved_version",
      "versions": [
        {
          "id": "epmc:MED:43040009",
          "source": "Europe PMC",
          "url": "https://doi.org/10.1038/s43588-026-01080-z",
          "publishedAt": "2026-11-16",
          "type": "paper"
        }
      ],
      "matchedSignals": [
        "LLM-primary:title",
        "simulation:cogniti",
        "simulation:human behavio"
      ],
      "reason": "公开元数据筛选：LLM为主要主题，并匹配心理学过程/任务；按样本内最早已知日期与标题相关信号排序，优先方向多样性。",
      "caution": "仅元数据筛选，不是质量评审；预印本可能未经同行评审，临床结论需独立验证。"
    },
    {
      "id": "epmc:MED:43044104",
      "title": "Use of Large Language Models for Structured Quantitative and Qualitative Analysis of Simulation Debriefings Using the DASH Framework (AIDE Study): Prospective Observational Study.",
      "url": "https://doi.org/10.2196/101797",
      "publishedAt": "2026-11-17T00:00:00Z",
      "recordPublishedAt": "2026-11-17",
      "updatedAt": null,
      "type": "paper",
      "source": "Europe PMC",
      "theme": "methods",
      "dateBasis": "earliest_retrieved_version",
      "versions": [
        {
          "id": "epmc:MED:43044104",
          "source": "Europe PMC",
          "url": "https://doi.org/10.2196/101797",
          "publishedAt": "2026-11-17",
          "type": "paper"
        }
      ],
      "matchedSignals": [
        "LLM-primary:title",
        "methods:qualitative"
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
      "signal": "过去 7 天检索样本 18 条；仅在五个预设方向中按数量排序。",
      "count": 18,
      "sourceIds": [
        "epmc:MED:43008791",
        "epmc:MED:43015568",
        "epmc:MED:43020403",
        "epmc:MED:43024780",
        "epmc:MED:43034186",
        "epmc:MED:43035140",
        "arxiv:2611.13161",
        "arxiv:2611.13561",
        "arxiv:2611.14242",
        "arxiv:2611.14382",
        "arxiv:2611.15651",
        "arxiv:2611.16662",
        "arxiv:2611.16667",
        "arxiv:2611.17918",
        "epmc:PPR:PPR1363532",
        "epmc:PPR:PPR1363662",
        "epmc:PPR:PPR1365464",
        "epmc:PPR:PPR1366386"
      ],
      "papers": [
        {
          "id": "epmc:MED:43008791",
          "title": "[Generative artificial intelligence in orthopedics and trauma surgery-Guidelines for responsible use in undergraduate and continuing education].",
          "url": "https://doi.org/10.1055/a-2990-8732",
          "publishedAt": "2026-11-10T00:00:00Z",
          "recordPublishedAt": "2026-11-10",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:title",
            "simulation:decision-making"
          ]
        },
        {
          "id": "epmc:MED:43015568",
          "title": "An Analysis of Large Language Model Performance on Hematology Key Feature Questions.",
          "url": "https://doi.org/10.1007/s13187-026-03025-6",
          "publishedAt": "2026-11-12T00:00:00Z",
          "recordPublishedAt": "2026-11-12",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:title",
            "simulation:decision-making"
          ]
        },
        {
          "id": "epmc:MED:43020403",
          "title": "Toward automated cognitive assessment in Parkinson's disease using pretrained language models.",
          "url": "https://doi.org/10.1016/j.jbi.2026.105126",
          "publishedAt": "2026-11-12T00:00:00Z",
          "recordPublishedAt": "2026-11-12",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:title",
            "simulation:cogniti"
          ]
        },
        {
          "id": "epmc:MED:43024780",
          "title": "Verifiable summarization of electronic health records using large language models to support chart review.",
          "url": "https://doi.org/10.1093/jamia/ocag181",
          "publishedAt": "2026-11-13T00:00:00Z",
          "recordPublishedAt": "2026-11-13",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:title",
            "simulation:cogniti",
            "simulation:decision-making"
          ]
        },
        {
          "id": "epmc:MED:43034186",
          "title": "Personas shift clinical action thresholds in large language models.",
          "url": "https://doi.org/10.1038/s44401-026-00121-z",
          "publishedAt": "2026-11-14T00:00:00Z",
          "recordPublishedAt": "2026-11-14",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:title",
            "simulation:cogniti"
          ]
        },
        {
          "id": "epmc:MED:43035140",
          "title": "Cognitive Evaluation of Multimodal Large Language Models in Dental Radiography. ",
          "url": "https://doi.org/10.1016/j.jdent.2026.107174",
          "publishedAt": "2026-11-15T00:00:00Z",
          "recordPublishedAt": "2026-11-15",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:title",
            "simulation:cogniti",
            "simulation:decision-making"
          ]
        },
        {
          "id": "arxiv:2611.13161",
          "title": "Cognitive Multi-Agent Search and Rescue: Language-Grounded Hierarchical Reinforcement Learning for Collaborative Robotics",
          "url": "https://arxiv.org/abs/2611.13161v1",
          "publishedAt": "2026-11-09T19:45:28Z",
          "recordPublishedAt": "2026-11-09T19:45:28Z",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:abstract>=2",
            "simulation:cogniti"
          ]
        },
        {
          "id": "arxiv:2611.13561",
          "title": "Discovering Structurally Plausible and Interpretable Cognitive Models with Large Language Models",
          "url": "https://arxiv.org/abs/2611.13561v1",
          "publishedAt": "2026-11-10T04:26:29Z",
          "recordPublishedAt": "2026-11-10T04:26:29Z",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:title",
            "simulation:cogniti"
          ]
        },
        {
          "id": "arxiv:2611.14242",
          "title": "PARLEY: Evaluating LLM Collaboration Through Cooperative Asymmetric Puzzles",
          "url": "https://arxiv.org/abs/2611.14242v1",
          "publishedAt": "2026-11-10T15:54:12Z",
          "recordPublishedAt": "2026-11-10T15:54:12Z",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:title",
            "simulation:cogniti"
          ]
        },
        {
          "id": "arxiv:2611.14382",
          "title": "Cognitive Mapping of Learning by Thinking Mechanisms in Large Language Models",
          "url": "https://arxiv.org/abs/2611.14382v1",
          "publishedAt": "2026-11-10T17:37:13Z",
          "recordPublishedAt": "2026-11-10T17:37:13Z",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:title",
            "simulation:cogniti"
          ]
        },
        {
          "id": "arxiv:2611.15651",
          "title": "Recover, Don't Just Continue: Learning from Feedback for Physical Failure Understanding and Correction",
          "url": "https://arxiv.org/abs/2611.15651v1",
          "publishedAt": "2026-11-11T16:01:28Z",
          "recordPublishedAt": "2026-11-11T16:01:28Z",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:abstract>=2",
            "simulation:cogniti"
          ]
        },
        {
          "id": "arxiv:2611.16662",
          "title": "MuSeToM: Multi-Sensory Evaluation of Belief Revision with Textual Cues Across Six Senses",
          "url": "https://arxiv.org/abs/2611.16662v1",
          "publishedAt": "2026-11-12T11:38:52Z",
          "recordPublishedAt": "2026-11-12T11:38:52Z",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:abstract>=2",
            "simulation:cogniti",
            "simulation:theory of mind"
          ]
        },
        {
          "id": "arxiv:2611.16667",
          "title": "People prefer AI to human advice in multi-turn conversations but neither changes incentivised behaviour",
          "url": "https://arxiv.org/abs/2611.16667v1",
          "publishedAt": "2026-11-12T11:42:54Z",
          "recordPublishedAt": "2026-11-12T11:42:54Z",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:abstract>=2",
            "simulation:cogniti"
          ]
        },
        {
          "id": "arxiv:2611.17918",
          "title": "Condensing Law of Security Information",
          "url": "https://arxiv.org/abs/2611.17918v1",
          "publishedAt": "2026-11-13T08:57:58Z",
          "recordPublishedAt": "2026-11-13T08:57:58Z",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:abstract>=2",
            "simulation:cogniti"
          ]
        },
        {
          "id": "epmc:PPR:PPR1363532",
          "title": "Developing human-AI complementarity: Augmenting everyday decision making with Large Language Models",
          "url": "https://doi.org/10.31234/osf.io/gzp7r",
          "publishedAt": "2026-11-10T00:00:00Z",
          "recordPublishedAt": "2026-11-10",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:title",
            "simulation:cogniti",
            "simulation:decision making"
          ]
        },
        {
          "id": "epmc:PPR:PPR1363662",
          "title": "LLM Embeddings Complement Theory-Driven Language Features and Cognitive Scores for APOE4 and Aβ Prediction",
          "url": "https://doi.org/10.64898/2026.11.09.26367620",
          "publishedAt": "2026-11-10T00:00:00Z",
          "recordPublishedAt": "2026-11-10",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:title",
            "simulation:cogniti"
          ]
        },
        {
          "id": "epmc:PPR:PPR1365464",
          "title": "Conversational Lexicons in Human–AI Interaction: A Mixed-Methods Study of Generative AI–Supported Lexical Decision-Making",
          "url": "https://doi.org/10.21203/rs.3.rs-11255152/v1",
          "publishedAt": "2026-11-12T00:00:00Z",
          "recordPublishedAt": "2026-11-12",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:title",
            "simulation:cogniti",
            "simulation:decision-making"
          ]
        },
        {
          "id": "epmc:PPR:PPR1366386",
          "title": "From Large Language Models (LLMs) to Agentic AI for IoT Security: A Survey",
          "url": "https://doi.org/10.20944/preprints202611.1411.v1",
          "publishedAt": "2026-11-13T00:00:00Z",
          "recordPublishedAt": "2026-11-13",
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
      "signal": "过去 7 天检索样本 5 条；仅在五个预设方向中按数量排序。",
      "count": 5,
      "sourceIds": [
        "epmc:MED:43019347",
        "epmc:MED:43021690",
        "epmc:MED:43035153",
        "arxiv:2611.12814",
        "epmc:PPR:PPR1363035"
      ],
      "papers": [
        {
          "id": "epmc:MED:43019347",
          "title": "Prompt design in large language model health coaching chatbots: A scoping review.",
          "url": "https://doi.org/10.1371/journal.pdig.0001827",
          "publishedAt": "2026-11-12T00:00:00Z",
          "recordPublishedAt": "2026-11-12",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:title",
            "clinical:mental health"
          ]
        },
        {
          "id": "epmc:MED:43021690",
          "title": "Evo2VED: a database of DNA large language model-derived scores for variant interpretation.",
          "url": "https://doi.org/10.1093/nar/gkag1076",
          "publishedAt": "2026-11-13T00:00:00Z",
          "recordPublishedAt": "2026-11-13",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:title",
            "clinical:depressi"
          ]
        },
        {
          "id": "epmc:MED:43035153",
          "title": "Can AI-assisted analysis of antidepressant drug online reviewers (ADORE) inform real-world use of antidepressants? ",
          "url": "https://doi.org/10.1016/j.jad.2026.122743",
          "publishedAt": "2026-11-15T00:00:00Z",
          "recordPublishedAt": "2026-11-15",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:abstract>=2",
            "clinical:depressi"
          ]
        },
        {
          "id": "arxiv:2611.12814",
          "title": "Curbside Chatbots: Auditing the Mental Health Interventions Large Language Models Recommend to Clinicians, Caregivers, and Patients",
          "url": "https://arxiv.org/abs/2611.12814v1",
          "publishedAt": "2026-11-09T18:19:30Z",
          "recordPublishedAt": "2026-11-09T18:19:30Z",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:title",
            "clinical:mental health"
          ]
        },
        {
          "id": "epmc:PPR:PPR1363035",
          "title": "TETI, an LLM‑Augmented Telegram Chatbot for WHO Self‑Help Plus (SH+): Single‑arm mixed‑methods feasibility study protocol",
          "url": "https://doi.org/10.21203/rs.3.rs-8592161/v1",
          "publishedAt": "2026-11-10T00:00:00Z",
          "recordPublishedAt": "2026-11-10",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:title",
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
        "epmc:MED:43019552",
        "epmc:MED:43022181",
        "epmc:MED:43024358",
        "epmc:MED:43034204",
        "epmc:PPR:PPR1366799"
      ],
      "papers": [
        {
          "id": "epmc:MED:43019552",
          "title": "Integrating Large Language Models Into Patient Health Education: Interview Study Among Nurses.",
          "url": "https://doi.org/10.2196/102846",
          "publishedAt": "2026-11-12T00:00:00Z",
          "recordPublishedAt": "2026-11-12",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:title",
            "methods:thematic analys"
          ]
        },
        {
          "id": "epmc:MED:43022181",
          "title": "Evaluating a large language model-powered system for semi-structured interview in health research.",
          "url": "https://doi.org/10.1093/jamiaopen/ooag218",
          "publishedAt": "2026-11-12T00:00:00Z",
          "recordPublishedAt": "2026-11-12",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:title",
            "methods:qualitative"
          ]
        },
        {
          "id": "epmc:MED:43024358",
          "title": "Effects of a Personalized Retrieval-Augmented Generation Chatbot on Information Needs in Patients With Chronic Kidney Disease: Mixed Methods Randomized Controlled Trial.",
          "url": "https://doi.org/10.2196/96501",
          "publishedAt": "2026-11-13T00:00:00Z",
          "recordPublishedAt": "2026-11-13",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:abstract>=2",
            "methods:qualitative"
          ]
        },
        {
          "id": "epmc:MED:43034204",
          "title": "Artificial intelligence and clinical reasoning - a qualitative study with general practice trainees in Germany.",
          "url": "https://doi.org/10.1186/s12909-026-10736-3",
          "publishedAt": "2026-11-14T00:00:00Z",
          "recordPublishedAt": "2026-11-14",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:abstract>=2",
            "methods:qualitative"
          ]
        },
        {
          "id": "epmc:PPR:PPR1366799",
          "title": "Retrieval augmented consistency scoring for model agnostic hallucination detection in large language models",
          "url": "https://doi.org/10.21203/rs.3.rs-11187042/v1",
          "publishedAt": "2026-11-13T00:00:00Z",
          "recordPublishedAt": "2026-11-13",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:title",
            "methods:qualitative",
            "methods:reproducib"
          ]
        }
      ]
    },
    {
      "id": "education",
      "title": "教育与发展 · Education & development",
      "question": "学习与发展结果如何在真实环境中验证？",
      "signal": "过去 7 天检索样本 4 条；仅在五个预设方向中按数量排序。",
      "count": 4,
      "sourceIds": [
        "epmc:MED:43023367",
        "arxiv:2611.13366",
        "arxiv:2611.14798",
        "epmc:PPR:PPR1366475"
      ],
      "papers": [
        {
          "id": "epmc:MED:43023367",
          "title": "Integrating ChatGPT into Pharmacology Simulation: A Structured Framework for Prescribing and Medication-Safety Education - A Narrative Review.",
          "url": "https://doi.org/10.2174/0115748863530047261105111229",
          "publishedAt": "2026-11-12T00:00:00Z",
          "recordPublishedAt": "2026-11-12",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:title",
            "education:educati",
            "education:learning outcome",
            "education:student"
          ]
        },
        {
          "id": "arxiv:2611.13366",
          "title": "Mapping Instructors' Attitudes Towards Cheating with AI: An Exploratory Analysis Using Forum Analysis",
          "url": "https://arxiv.org/abs/2611.13366v1",
          "publishedAt": "2026-11-09T23:39:11Z",
          "recordPublishedAt": "2026-11-09T23:39:11Z",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:abstract>=2",
            "education:student"
          ]
        },
        {
          "id": "arxiv:2611.14798",
          "title": "Who (or what) are they prompting? How CS students conceptualize and use LLMs",
          "url": "https://arxiv.org/abs/2611.14798v1",
          "publishedAt": "2026-11-10T22:34:14Z",
          "recordPublishedAt": "2026-11-10T22:34:14Z",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:title",
            "education:educati",
            "education:learning outcome",
            "education:student"
          ]
        },
        {
          "id": "epmc:PPR:PPR1366475",
          "title": "Artificial Hivemind in K-12 Education: A Case Study",
          "url": "https://doi.org/10.20944/preprints202611.1317.v1",
          "publishedAt": "2026-11-12T00:00:00Z",
          "recordPublishedAt": "2026-11-12",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:abstract>=2",
            "education:educati",
            "education:student",
            "education:tutor"
          ]
        }
      ]
    },
    {
      "id": "measurement",
      "title": "心理测量 · Psychometrics",
      "question": "量表、人格与偏差测量是否具有构念效度？",
      "signal": "过去 7 天检索样本 4 条；仅在五个预设方向中按数量排序。",
      "count": 4,
      "sourceIds": [
        "epmc:MED:43019478",
        "epmc:MED:43019512",
        "arxiv:2611.16586",
        "epmc:PPR:PPR1366065"
      ],
      "papers": [
        {
          "id": "epmc:MED:43019478",
          "title": "The structure and history of English words that describe people.",
          "url": "https://doi.org/10.1037/pspp0000627",
          "publishedAt": "2026-11-12T00:00:00Z",
          "recordPublishedAt": "2026-11-12",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:abstract>=2",
            "measurement:personality"
          ]
        },
        {
          "id": "epmc:MED:43019512",
          "title": "Text Psychometrics: Assessing psychological constructs in text using natural language processing.",
          "url": "https://doi.org/10.1371/journal.pdig.0001757",
          "publishedAt": "2026-11-12T00:00:00Z",
          "recordPublishedAt": "2026-11-12",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:abstract>=2",
            "measurement:psychological assess",
            "measurement:psychometr"
          ]
        },
        {
          "id": "arxiv:2611.16586",
          "title": "Large Language Models as Digital Twins: a Distribution-Aware Questionnaire-Based Evaluation",
          "url": "https://arxiv.org/abs/2611.16586v1",
          "publishedAt": "2026-11-12T10:18:16Z",
          "recordPublishedAt": "2026-11-12T10:18:16Z",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:title",
            "measurement:big five",
            "measurement:personality"
          ]
        },
        {
          "id": "epmc:PPR:PPR1366065",
          "title": "Designing AI-Agents with Personalities: A Psychometric Approach",
          "url": "https://doi.org/10.31234/osf.io/2kfw3_v3",
          "publishedAt": "2026-11-12T00:00:00Z",
          "recordPublishedAt": "2026-11-12",
          "dateBasis": "earliest_retrieved_version",
          "matchedSignals": [
            "LLM-primary:abstract>=2",
            "measurement:big five",
            "measurement:personality",
            "measurement:psychometr"
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
  "dailyCoverage": "partial",
  "lastCompleteDailyAt": "2026-11-21T14:16:30Z",
  "weeklyCoverage": "complete",
  "lastCompleteWeeklyAt": "2026-11-16T14:52:38Z",
  "screeningVersion": "1.1.0",
  "attemptCoverage": {
    "recordsFetched": 300,
    "deduplicatedRecords": 296,
    "eligibleRecords": 47,
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
        "state": "error",
        "count": null,
        "limitReached": false
      }
    ],
    "dateBasis": "earliest retrieved version; earlier unobserved versions may exist",
    "windowStart": "2026-08-24T14:06:16Z",
    "windowEnd": "2026-11-22T14:06:16Z",
    "queries": {
      "Europe PMC": "(large language model OR large language models OR ChatGPT) AND (psychology OR mental OR cognitive OR personality OR education OR qualitative), FIRST_PDATE within 90 days",
      "arXiv": "(large language model OR ChatGPT) AND (psychology OR mental health OR cognitive OR personality OR education OR qualitative), submittedDate descending"
    }
  },
  "dailyPolicyVersion": "1.1.0",
  "dailySample": {
    "recordsFetched": 300,
    "deduplicatedRecords": 296,
    "eligibleRecords": 47,
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
        "state": "error",
        "count": null,
        "limitReached": false
      }
    ],
    "dateBasis": "earliest retrieved version; earlier unobserved versions may exist",
    "windowStart": "2026-08-24T14:06:16Z",
    "windowEnd": "2026-11-22T14:06:16Z",
    "queries": {
      "Europe PMC": "(large language model OR large language models OR ChatGPT) AND (psychology OR mental OR cognitive OR personality OR education OR qualitative), FIRST_PDATE within 90 days",
      "arXiv": "(large language model OR ChatGPT) AND (psychology OR mental health OR cognitive OR personality OR education OR qualitative), submittedDate descending"
    }
  },
  "weeklySample": {
    "recordsFetched": 500,
    "deduplicatedRecords": 492,
    "eligibleRecords": 131,
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
    "windowStart": "2026-11-09T14:52:38Z",
    "windowEnd": "2026-11-16T14:52:38Z",
    "queries": {
      "Europe PMC": "(large language model OR large language models OR ChatGPT) AND (psychology OR mental OR cognitive OR personality OR education OR qualitative), FIRST_PDATE within 90 days",
      "arXiv": "(large language model OR ChatGPT) AND (psychology OR mental health OR cognitive OR personality OR education OR qualitative), submittedDate descending"
    },
    "weeklyRecords": 36
  },
  "weeklyPolicyVersion": "1.1.0"
};
