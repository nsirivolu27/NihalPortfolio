export const portfolioProfile = {
  name: 'Nihal Sirivolu',
  monogram: 'NS',
  role: 'AI/ML engineer and CMDA student at Virginia Tech',
  location: 'Blacksburg, VA',
  intro:
    'I study Computational Modeling and Data Analytics at Virginia Tech. My work brings together mathematics, statistics, and computing to understand complex systems and solve practical problems.',
  statement:
    'Applied ML with an engineering spine. A model is only useful when its output can be traced, reviewed, and trusted by the person downstream.',
  availability: 'Open to 2027 new grad software roles',
  email: 'sirivolun@gmail.com',
  resumeLabel: 'Current resume · Supplied October 2026',
  githubLabel: 'github.com/nsirivolu27',
  resumeUrl: `${import.meta.env.BASE_URL}Nihal-Sirivolu-Resume.pdf`,
  blogUrl: 'https://nihalsblogaboutstuff.blogspot.com/',
  githubUrl: 'https://github.com/nsirivolu27',
  linkedinUrl: 'https://www.linkedin.com/in/nihalsirivolu',
  photoStatus: 'Nihal / In a few words',
};

export const navItems = [
  { label: 'Resume', href: portfolioProfile.resumeUrl },
  { label: 'Projects', href: '#work' },
  { label: 'Featured', href: 'featured' },
  { label: 'Certifications', href: 'certifications' },
  { label: 'Skills', href: '#capabilities' },
  { label: 'Experience', href: '#notes' },
  { label: 'About', href: '#about' },
  { label: 'Writing', href: 'writing' },
  { label: 'Investing', href: 'investing' },
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
    location: 'Fairfax, VA · Hybrid',
    highlights: ['Open-vocabulary detection, tracking, segmentation, and keyframe extraction with auditable evidence.', 'Jira REST automation linking evaluation failures, artifacts, and reviewer decisions; validation across a 600+ test suite.', 'Privacy-aware AWS Rekognition person validation and production data contracts.'],
  },
  {
    number: '02',
    kind: 'IDPro, Virginia Tech / Aug 2026 to now',
    title: 'AI Tourism Research',
    copy: 'Leading Meta Wearables SDK integration for a Kotlin Android tour app: Ray-Ban Meta device registration, camera sessions, photo capture, and a phone-camera fallback.',
    location: 'Blacksburg, VA · Research Team Member',
    highlights: ['SDK setup and architecture documentation for permissions, device testing, capture contracts, and data handling.', 'Building a Meta Project Aria pipeline for first-person tour frames, Whisper audio transcription, and location-linked, page-cited documents.'],
  },
  {
    number: '03',
    kind: '4SightAI / Jun to Aug 2025',
    title: 'Automation and Cloud Engineering Intern',
    copy: 'Real time ingestion services for health, exercise, and business data behind two AI copilot platforms, cutting processing latency by 45%, plus Lambda, S3, and DynamoDB workflows with vector retrieval.',
    location: 'San Francisco, CA · Remote',
    highlights: ['Pandas and Power BI dashboards for patient and operational datasets.', 'Python and Jira automation for ingestion failures and data-quality checks.'],
  },
];

export const education = {
  school: 'Virginia Polytechnic Institute and State University',
  degree: 'B.S. Computational Modeling & Data Analytics',
  date: 'Expected May 2027 · Blacksburg, VA',
  coursework: ['Software Design & Data Structures', 'Intermediate Programming in Python', 'Probability & Distributions', 'Statistical Methods', 'Regression Analysis', 'Linear Algebra', 'Mathematical Modeling', 'Data Analytics & Visualization', 'Modeling with GIS', 'Computational Science Foundations', 'Problem Solving in Computer Science', 'Discrete Mathematics', 'Multivariable Calculus', 'Differential Equations'],
};

export const blogNotes: Record<string, string> = {
  'https://nihalsblogaboutstuff.blogspot.com/2022/08/tevva-and-hydrogen-energy.html': 'Exploring Tevva, hydrogen-powered transport, and the practical questions around energy density, infrastructure, and cost.',
  'https://nihalsblogaboutstuff.blogspot.com/2022/07/canoo-buy-now.html': 'A 2022 look at Canoo, electric delivery vehicles, and what corporate contracts might mean for an emerging EV company.',
};

export const technicalSkills = [
  { label: 'Languages', items: 'Python, TypeScript, Kotlin, Java, R, C/C++, JavaScript, SQL, Go' },
  { label: 'ML & computer vision', items: 'PyTorch, TensorFlow, OpenCV, YOLO, SAM-2, MediaPipe, Kaldi, dlib' },
  { label: 'AI foundations', items: 'LLM customization, fine-tuning, reinforcement learning, LangChain, LangGraph' },
  { label: 'Backend & cloud', items: 'FastAPI, Pydantic, Django REST, Spring Boot, React, Docker, GCP, Git, Jira, Linux, AWS Lambda, S3, DynamoDB, Rekognition' },
];
