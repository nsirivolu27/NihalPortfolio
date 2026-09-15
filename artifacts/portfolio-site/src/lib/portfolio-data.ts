export const portfolioProfile = {
  name: 'Nihal Sirivolu',
  monogram: 'NS',
  role: 'AI/ML engineering intern and CMDA student at Virginia Tech',
  location: 'Blacksburg, VA',
  intro:
    'I build computer vision and machine learning systems that hold up outside a notebook: video pipelines, model serving, and the plumbing around them.',
  statement:
    'Applied ML with an engineering spine. A model is only useful when its output can be traced, reviewed, and trusted by the person downstream.',
  availability: 'Open to 2027 new grad software roles',
  email: 'sirivolun@gmail.com',
  resumeLabel: 'Resume available on request',
  githubLabel: 'github.com/nsirivolu27',
  resumeUrl: '',
  githubUrl: 'https://github.com/nsirivolu27',
  linkedinUrl: 'https://www.linkedin.com/in/nihalsirivolu',
  photoStatus: 'Portrait photo coming soon',
};

export const navItems = [
  { label: 'Projects', href: '#work' },
  { label: 'Skills', href: '#capabilities' },
  { label: 'Practice', href: '#practice' },
  { label: 'Experience', href: '#notes' },
  { label: 'About', href: '#about' },
];

export const projects = [
  {
    id: 'lnkz',
    index: '01',
    title: 'LNKZ MCP Server',
    type: 'Open source / MCP infrastructure',
    description:
      'An MCP server for personal AI workflows, exposing 24+ tools for conversation import, search, and secure handoffs so compatible LLM clients can reuse context across sessions. Deployed with Docker, GitHub Actions, and AWS CDK over App Runner and private RDS Postgres.',
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
      'A multimodal pipeline for knee MRI abnormality classification that pairs DICOM preprocessing and image augmentation with multilingual radiology report normalization. Image only, text only, and combined baselines were compared under cross validation, reaching 78% accuracy.',
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
    kind: 'Edrevel AI / Jun 2026 to now',
    title: 'AI/ML Engineering Intern',
    copy: 'End to end computer vision pipeline for a workforce training compliance platform, extracting objects, people, hand interactions, and task evidence from video, served through FastAPI, Docker, and AWS.',
  },
  {
    number: '02',
    kind: 'IDPro, Virginia Tech / Aug 2026 to now',
    title: 'AI Tourism Research',
    copy: 'An Android app for AI powered tourism in Kotlin and Jetpack Compose, integrating Ray-Ban Meta smart glasses for camera streaming and photo capture, with spoken responses from cloud AI services.',
  },
  {
    number: '03',
    kind: '4SightAI / Jun to Aug 2025',
    title: 'Automation and Cloud Engineering Intern',
    copy: 'Real time ingestion services for health, exercise, and business data behind two AI copilot platforms, cutting processing latency by 45%, plus Lambda, S3, and DynamoDB workflows with vector retrieval.',
  },
];
