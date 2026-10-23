export const portfolioProfile = {
  name: 'Nihal Sirivolu',
  monogram: 'NS',
  role: 'AI/ML engineer and CMDA student at Virginia Tech',
  location: 'Blacksburg, VA',
  intro:
    'I build computer vision and machine learning systems that hold up outside a notebook: video pipelines, model serving, and the plumbing around them.',
  statement:
    'Applied ML with an engineering spine. A model is only useful when its output can be traced, reviewed, and trusted by the person downstream.',
  availability: 'Open to 2027 new grad software roles',
  email: 'sirivolun@gmail.com',
  resumeLabel: 'Software engineering resume · September 2026',
  githubLabel: 'github.com/nsirivolu27',
  resumeUrl: `${import.meta.env.BASE_URL}Nihal-Sirivolu-Resume.pdf`,
  blogUrl: 'https://nihalsblogaboutstuff.blogspot.com/',
  githubUrl: 'https://github.com/nsirivolu27',
  linkedinUrl: 'https://www.linkedin.com/in/nihalsirivolu',
  photoStatus: 'Nihal / In a few words',
};

export const navItems = [
  { label: 'Projects', href: '#work' },
  { label: 'Skills', href: '#capabilities' },
  { label: 'Experience', href: '#notes' },
  { label: 'About', href: '#about' },
  { label: 'Writing', href: 'writing' },
  { label: 'Investing', href: 'investing' },
];

export const projects = [
  {
    id: 'lnkz',
    index: '01',
    title: 'LNKZ MCP Server',
    type: 'Open source / MCP infrastructure',
    description:
      'Portable conversation context across LLM clients: a unified relay, web console, REST API, and MCP tools for imports, search, and secure handoffs. Includes Docker and AWS CDK deployment infrastructure; account rollout is staged.',
    tags: ['MCP', 'Node.js', 'AWS CDK'],
    accent: 'lime',
    githubUrl: 'https://github.com/nsirivolu27/LNKZ',
    demoUrl: '',
  },
  {
    id: 'rsna-knee',
    index: '02',
    title: 'RSNA Knee Abnormality Detection',
    type: 'Kaggle / multimodal ML',
    description:
      'A multimodal pipeline for knee MRI abnormality classification, pairing DICOM preprocessing and image augmentation with multilingual radiology reports. Configuration-driven experiments compare image-only, text-only, and combined baselines with cross-validation and threshold calibration.',
    tags: ['PyTorch', 'DICOM', 'NLP'],
    accent: 'tomato',
    githubUrl: 'https://github.com/nsirivolu27/rsna-knee-abnormality-detection',
    demoUrl: '',
  },
  {
    id: 'hyperspectral-tracking',
    index: '03',
    title: 'Hyperspectral Object Tracking',
    type: 'Research / competition',
    description:
      'An entry in the Hyperspectral Object Tracking Challenge 2026, merged with an undergraduate independent research project at Virginia Tech toward a single competition submission and a paper.',
    tags: ['Computer vision', 'Hyperspectral', 'Tracking'],
    accent: 'ochre',
    githubUrl: '',
    demoUrl: '',
  },
];

export const strengths = [
  {
    number: '01',
    title: 'Auditable by default',
    copy: 'Detections ship with bounding boxes, timestamps, scene assignments, and confidence metadata, so a reviewer can retrace any decision the model made.',
  },
  {
    number: '02',
    title: 'Automate the tedious parts',
    copy: 'Model evaluations and test failures open and update their own Jira issues with evidence attached, which keeps traceability intact without anyone filing tickets by hand.',
  },
  {
    number: '03',
    title: 'Test what ships',
    copy: 'Production data contracts, documentation, and a suite of 600+ automated checks, because a pipeline nobody trusts is a pipeline nobody uses.',
  },
];

export const capabilityIndex = [
  {
    number: '01',
    title: 'Computer vision',
    copy: 'Open vocabulary detection, persistent tracking, segmentation, and keyframe extraction across video, plus DICOM and hyperspectral imagery outside the usual RGB comfort zone.',
    proof: 'PyTorch / OpenCV / YOLO / SAM-2 / MediaPipe',
  },
  {
    number: '02',
    title: 'Backend and serving',
    copy: 'Wrapping inference in APIs that other teams can actually call, with containers, storage, and reviewer workflows around them.',
    proof: 'FastAPI / Docker / AWS / PostgreSQL',
  },
  {
    number: '03',
    title: 'Data and modeling',
    copy: 'Ingestion, cleaning, and the statistics underneath: cross validation, class imbalance, threshold calibration, and dashboards people read without a translator.',
    proof: 'Python / R / SQL / Pandas / Power BI',
  },
  {
    number: '04',
    title: 'Mobile and wearables',
    copy: 'Android apps that capture images, take voice input, and speak back, including camera streaming from Ray-Ban Meta smart glasses.',
    proof: 'Kotlin / Jetpack Compose / Meta MWDAT',
  },
];

export const notes = [
  {
    number: '01',
    kind: 'Edrevel AI / Jun–Aug 2026',
    title: 'AI/ML Engineering Intern',
    copy: 'End to end computer vision pipeline for a workforce training compliance platform, extracting objects, people, hand interactions, and task evidence from video, served through FastAPI, Docker, and AWS.',
    location: 'Fairfax, VA · Hybrid',
    highlights: ['Open-vocabulary detection, tracking, segmentation, and keyframe extraction with auditable evidence.', 'Jira REST automation linking evaluation failures, artifacts, and reviewer decisions; validation across a 600+ test suite.'],
  },
  {
    number: '02',
    kind: 'IDPro, Virginia Tech / Aug 2026 to now',
    title: 'AI Tourism Research',
    copy: 'An Android app for AI powered tourism in Kotlin and Jetpack Compose, integrating Ray-Ban Meta smart glasses for camera streaming and photo capture, with spoken responses from cloud AI services.',
    location: 'Blacksburg, VA · Research Team Member',
    highlights: ['CameraX capture, speech recognition, and spoken AI responses in an Android app.', 'Wearable device registration, video-stream lifecycle, Mock Device Kit validation, and Firebase Analytics.'],
  },
  {
    number: '03',
    kind: '4SightAI / Jun to Aug 2025',
    title: 'Automation and Cloud Engineering Intern',
    copy: 'Real time ingestion services for health, exercise, and business data behind two AI copilot platforms, cutting processing latency by 45%, plus Lambda, S3, and DynamoDB workflows with vector retrieval.',
    location: 'San Francisco, CA · On-site',
    highlights: ['Pandas and Power BI dashboards for patient and operational datasets.', 'Python and Jira automation for ingestion failures and data-quality checks.'],
  },
];

export const education = {
  school: 'Virginia Polytechnic Institute and State University',
  degree: 'B.S. Computational Modeling & Data Analytics',
  date: 'Expected May 2027 · Blacksburg, VA',
  coursework: ['Software Design & Data Structures', 'Intermediate Programming in Python', 'Probability & Distributions', 'Statistical Methods', 'Regression Analysis', 'Linear Algebra', 'Mathematical Modeling', 'Data Analytics & Visualization', 'Modeling with GIS', 'Computational Science Foundations'],
  certifications: ['AWS Certified Solutions Architect – Associate', 'AWS Certified Cloud Practitioner'],
};

export const repositoryNotes: Record<string, { title: string; description: string; status?: string }> = {
  'LNKZ': { title: 'LNKZ', description: 'Portable conversation context across models, apps, devices, and people. A unified relay, web console, REST API, and MCP server with secure handoffs.' },
  'LLMM': { title: 'LLMM · The origins of LNKZ', description: 'The original project behind LNKZ. Archived to preserve its history; ongoing development lives in the consolidated LNKZ repository.' },
  'RENO': { title: 'OpenReno', description: 'An AI renovation studio for exploring residential and commercial spaces. Upload a photo, choose a style, and generate a restyle through pluggable model providers.' },
  'Soupy-Hackathon-PROJ': { title: 'Soupy', status: 'Hackathon MVP', description: 'A kiosk-friendly support app for unsheltered people in Washington, DC. Plain-language needs classification and example local-resource matching, with a React frontend and Express API.' },
  'SpeechSight': { title: 'SpeechSight', status: 'Prototype', description: 'A C++ speech-analysis project combining audio features, a pluggable phoneme-recognition interface, facial and lip-tracking abstractions, and heatmap visualization.' },
  'SYMPO': { title: 'SYMPO', description: 'A real-time sponsorship marketplace connecting sponsors and creators through a Spring Boot matching engine and React dashboard with WebSocket activity updates.' },
  'edrevel-video-ai': { title: 'Edrevel Video AI', description: 'Video object-interaction analysis using FastAPI, open-vocabulary detection, tracking, interaction windows, and sparse annotated keyframes. The public project began as an internship technical assessment.' },
  'fantasy-copilot': { title: 'Fantasy Copilot', description: 'A free, self-hosted fantasy football companion. League-aware projections, lineup and waiver decisions, grounded chat, and MCP tools, starting with Sleeper league sync.' },
  'Magentic.AI': { title: 'Magentic', status: 'In progress', description: 'A supervised AI workflow workspace for the Virginia Tech × Accenture Federal Services Build Challenge. People review evidence at every stage, with independent sign-off before a workflow advances.' },
  'rsna-knee-abnormality-detection': { title: 'RSNA Knee Abnormality Detection', status: 'Research', description: 'Multimodal MRI classification with DICOM preprocessing, radiology-text normalization, reproducible experiments, and image-only, text-only, and combined baselines.' },
  'NihalPortfolio': { title: 'This portfolio', description: 'The source behind this site: selected work, the complete public project archive, experience, writing, and a separate investing portfolio.' },
  'quantum-datacenter-anomaly': { title: 'Quantum Datacenter Anomaly', status: 'Early repository', description: 'An early datacenter project repository. No implementation details or results have been published yet.' },
};

export const blogNotes: Record<string, string> = {
  'https://nihalsblogaboutstuff.blogspot.com/2022/08/tevva-and-hydrogen-energy.html': 'Exploring Tevva, hydrogen-powered transport, and the practical questions around energy density, infrastructure, and cost.',
  'https://nihalsblogaboutstuff.blogspot.com/2022/07/canoo-buy-now.html': 'A 2022 look at Canoo, electric delivery vehicles, and what corporate contracts might mean for an emerging EV company.',
};
