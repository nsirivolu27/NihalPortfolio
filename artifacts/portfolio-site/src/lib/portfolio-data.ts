export const portfolioProfile = {
  name: 'Nihal Sirivolu',
  monogram: 'NS',
  role: 'AI/ML engineer and CMDA student at Virginia Tech',
  location: 'Blacksburg, VA',
  intro:
    'I study Computational Modeling and Data Analytics at Virginia Tech. My work brings together mathematics, statistics, and computing to understand complex systems and solve practical problems.',
  statement:
    'I combine data analysis, mathematical modeling, and software development to build tools that people can understand and use.',
  availability: 'Open to 2027 new grad software roles',
  email: 'sirivolun@gmail.com',
  githubLabel: 'github.com/nsirivolu27',
  blogUrl: 'https://nihalsblogaboutstuff.blogspot.com/',
  githubUrl: 'https://github.com/nsirivolu27',
  linkedinUrl: 'https://www.linkedin.com/in/nihalsirivolu',
  photoStatus: 'Nihal / In a few words',
};

export const navItems = [
  { label: 'Projects', href: '#work' },
  { label: 'Certifications', href: 'certifications' },
  { label: 'Skills', href: '#capabilities' },
  { label: 'Experience', href: '#notes' },
  { label: 'About', href: '#about' },
  { label: 'Writing', href: 'writing' },
  { label: 'Investing', href: 'investing' },
  { label: 'Music', href: 'music' },
];

export const strengths = [
  {
    number: '01',
    title: 'Clear, traceable results',
    copy: 'Each detection includes its location, timestamp, scene, and confidence score so reviewers can check the result against the original video.',
  },
  {
    number: '02',
    title: 'Useful automation',
    copy: 'Model evaluations and test failures create or update Jira issues with the relevant evidence, reducing manual reporting.',
  },
  {
    number: '03',
    title: 'Testing and documentation',
    copy: 'The pipeline includes data validation, documentation, and more than 600 automated checks to help catch problems before deployment.',
  },
];

export const capabilityIndex = [
  {
    number: '01',
    title: 'Computer vision',
    copy: 'I work on detecting and tracking objects, segmenting images, and extracting key video frames. My projects also include medical imaging and hyperspectral data.',
    proof: 'PyTorch / OpenCV / YOLO / SAM-2 / MediaPipe',
  },
  {
    number: '02',
    title: 'Backend development',
    copy: 'I build APIs for running models and handling their results, along with the storage, deployment, and review tools that support them.',
    proof: 'FastAPI / Docker / AWS / PostgreSQL',
  },
  {
    number: '03',
    title: 'Data and modeling',
    copy: 'I prepare data, evaluate models, and build dashboards. This includes cross-validation, handling class imbalance, and choosing useful decision thresholds.',
    proof: 'Python / R / SQL / Pandas / Power BI',
  },
  {
    number: '04',
    title: 'Mobile and wearables',
    copy: 'I develop Android apps that use cameras, voice input, and spoken responses, including apps connected to Ray-Ban Meta smart glasses.',
    proof: 'Kotlin / Jetpack Compose / Meta MWDAT',
  },
];

export const notes = [
  {
    number: '01',
    kind: 'Edrevel AI / Jun 2026 to now',
    title: 'AI/ML Engineering Intern',
    copy: 'I build a computer vision pipeline that analyzes workforce training videos, identifying people, objects, hand interactions, and evidence of completed tasks. The system uses FastAPI, Docker, and AWS.',
    location: 'Fairfax, VA · Hybrid',
    highlights: ['Detect and track objects, segment video frames, and save key frames for review.', 'Connect evaluation results and reviewer feedback to Jira, supported by more than 600 automated checks.', 'Use AWS Rekognition to validate people in video, with privacy checks and data validation.'],
  },
  {
    number: '02',
    kind: 'IDPro, Virginia Tech / Aug 2026 to now',
    title: 'AI Tourism Research',
    copy: 'I lead the Meta Wearables SDK integration for an Android tour app built in Kotlin. The app connects to Ray-Ban Meta glasses to capture photos and can also use the phone camera.',
    location: 'Blacksburg, VA · Research Team Member',
    highlights: ['Document permissions, device setup, testing, image capture, and data handling.', 'Build a Meta Project Aria pipeline that combines tour images, Whisper audio transcripts, and documents linked to locations and source pages.'],
  },
  {
    number: '03',
    kind: '4SightAI / Jun to Aug 2025',
    title: 'Automation and Cloud Engineering Intern',
    copy: 'I built data-processing services for two AI copilots: one for health and exercise consulting and one for newsroom consulting. This work reduced processing latency by 45%. I also worked on AWS workflows and vector search.',
    location: 'San Francisco, CA · Remote',
    highlights: ['Created Pandas and Power BI dashboards for patient and operational data.', 'Used Lambda, S3, and DynamoDB to support data workflows.', 'Automated data-quality checks and failure reporting with Python and Jira.'],
  },
];

export const education = {
  school: 'Virginia Polytechnic Institute and State University',
  degree: 'B.S. Computational Modeling & Data Analytics',
  date: 'Expected May 2027 · Blacksburg, VA',
  coursework: ['Software Design & Data Structures', 'Intermediate Programming in Python', 'Probability & Distributions', 'Statistical Methods', 'Regression Analysis', 'Linear Algebra', 'Mathematical Modeling', 'Data Analytics & Visualization', 'Modeling with GIS', 'Computational Science Foundations', 'Problem Solving in Computer Science', 'Discrete Mathematics', 'Multivariable Calculus', 'Differential Equations'],
};

export const blogNotes: Record<string, string> = {
  'https://nihalsblogaboutstuff.blogspot.com/2022/08/tevva-and-hydrogen-energy.html': 'My thoughts on Tevva and hydrogen-powered transport, including energy storage, infrastructure, and cost.',
  'https://nihalsblogaboutstuff.blogspot.com/2022/07/canoo-buy-now.html': 'My 2022 analysis of Canoo, its electric delivery vehicles, and the potential value of its corporate contracts.',
};

export const technicalSkills = [
  { label: 'Languages', items: 'Python, TypeScript, Kotlin, Java, R, C/C++, JavaScript, SQL, Go' },
  { label: 'ML & computer vision', items: 'PyTorch, TensorFlow, OpenCV, YOLO, SAM-2, MediaPipe, Kaldi, dlib' },
  { label: 'AI foundations', items: 'LLM customization, fine-tuning, reinforcement learning, LangChain, LangGraph' },
  { label: 'Backend & cloud', items: 'FastAPI, Pydantic, Django REST, Spring Boot, React, Docker, GCP, Git, Jira, Linux, AWS Lambda, S3, DynamoDB, Rekognition' },
];
