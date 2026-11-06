export type ProjectCategory = 'All' | 'AI/ML' | 'Full Stack' | 'Systems' | 'IoT' | 'Automation';

export interface ArchitectureNode {
  id: string;
  label: string;
  role: string;
  tier: 'input' | 'core' | 'storage' | 'output';
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  category: Exclude<ProjectCategory, 'All'>;
  secondaryCategories: Exclude<ProjectCategory, 'All'>[];
  status: 'Completed' | 'Active Prototype';
  shortDescription: string;
  detailedDescription: string;
  problemStatement: string;
  solution: string;
  contribution: string;
  technologies: string[];
  features: string[];
  architectureSummary: string;
  architectureNodes: ArchitectureNode[];
  githubUrl?: string;
  demoUrl?: string;
  accentColor: string;
}

export interface SkillItem {
  name: string;
  category: 'Programming' | 'AI/ML' | 'Backend' | 'Frontend' | 'Systems & Tools';
  spineColor: string;
  heightRatio: number;
  summary: string;
  appliedIn: string[];
}

export interface AchievementItem {
  id: string;
  title: string;
  category: 'Hackathon' | 'Leadership' | 'CSI' | 'IEEE RAS' | 'Workshops & Events' | 'Research & Projects';
  organization: string;
  period: string;
  summary: string;
  details: string[];
  pinColor: string;
}

export interface CollectibleItem {
  id: string;
  name: string;
  locationHint: string;
  position: [number, number, number];
  jokeOrFact: string;
}

export interface StickyNoteItem {
  id: string;
  title: string;
  position: [number, number, number];
  message: string;
  authorNote: string;
}

export interface GuidedTourStop {
  id: string;
  title: string;
  targetInteractableId: string;
  cameraPos: [number, number, number];
  lookAt: [number, number, number];
  narration: string;
  sectionKey: string;
}

export interface CodePuzzle {
  id: string;
  title: string;
  language: string;
  prompt: string;
  buggySnippet: string;
  options: { id: string; code: string; isCorrect: boolean; explanation: string }[];
}

export const RESUME_PDF_DATA = {
  name: 'YESWANTH RAM JP',
  email: 'yeswanthram.2007@gmail.com',
  phone: '+916383744523',
  github: 'https://github.com/yeswanthram28',
  summary:
    'AI/ML Engineer and B.Tech Computer Science & Engineering (AI & ML) student at VIT Chennai with hands-on experience in machine learning, computer vision, LLMs, and AI system development. Proficient in Python, C++, NodeJS, RAG, React, and FastAPI, with experience delivering research and production-oriented solutions. 6× hackathon winner with 25+ hackathons.',
  workExperience: [
    {
      role: 'Student Developer Intern',
      company: 'Nexrova Technologies',
      period: 'Mar 2026 - July 2026',
      bullets: [
        'Developed and deployed AI/ML models as part of the core engineering team.',
        'Contributed to scalable backend systems and intelligent automation pipelines.'
      ]
    },
    {
      role: 'Student Developer Intern',
      company: 'Vineto AI',
      period: 'April 2026 - October 2026',
      bullets: [
        'Contributed to shipping AI-powered features designed to improve user experience.',
        "Contributed to the development of the product's backend infrastructure."
      ]
    },
    {
      role: 'Undergraduate Research Intern',
      company: 'VIT Chennai',
      period: 'May 2026 - July 2026',
      bullets: [
        'Conducted applied research in Smart Grids under faculty supervision.',
        'Contributed to research deliverables including literature reviews, experiments, and technical documentation.'
      ]
    }
  ],
  education: {
    degree: 'B.Tech in Computer Science and Engineering (Artificial Intelligence & Machine Learning)',
    institution: 'VIT Chennai',
    period: 'July 2024 - May 2028',
    details: 'GPA: 8.55, Relevant Courses: Data Structures, Web Dev, Databases, Software Engineering'
  },
  skills: [
    { label: 'Languages', value: 'C, C++, Java, Python, JavaScript' },
    { label: 'Tools/Frameworks', value: 'React, FastAPI, NodeJS' },
    { label: 'Databases', value: 'PostgresSQL, MySQL' },
    { label: 'AIML', value: 'Machine Learning, Computer Vision, LLMs, RAG' }
  ],
  projects: [
    {
      name: 'Jarvis',
      bullets: [
        'Built an autonomous AI assistant for voice-driven desktop automation, long-term memory, multi-step task execution, and synchronized cross-device actions with Friday.'
      ]
    },
    {
      name: 'Friday',
      bullets: [
        'Built an autonomous Android AI agent capable of understanding user commands, navigating mobile applications, and executing complex multi-step tasks directly on-device.'
      ]
    },
    {
      name: 'TerraGuard',
      bullets: [
        'Built an autonomous monitoring system integrating ESP32-based sensor hardware, a real-time web dashboard, and a Kotlin Android enforcement application.',
        'Implemented capabilities for live monitoring, evidence capture, GPS tracking, and automated forensic reporting.'
      ]
    }
  ],
  achievements: [
    '6× Hackathon Winner across university and national competitions',
    '25+ Hackathons — rapid prototyping of AI systems under time constraints',
    'Technical Lead — IEEE RAS & CSI, VIT Chennai, leading technical teams and driving project development, workshops, hackathons, and technical initiatives.'
  ]
};

export interface ScrapbookMemoryItem {
  id: string;
  title: string;
  category: 'Hackathons' | 'Campus & Robotics' | 'Milestones' | 'Doraemon Room' | 'Community';
  date: string;
  polaroidCaption: string;
  emoji: string;
  story: string;
  location: string;
  takeaway: string;
  tapeColor: string;
  accentColor: string;
  tags: string[];
}

export const SCRAPBOOK_MEMORIES_DATA: ScrapbookMemoryItem[] = [
  {
    id: 'memory-hackathon-podium',
    title: 'The 36-Hour Hackathon Victory & Red Bull Sprint',
    category: 'Hackathons',
    date: 'October 2024',
    location: 'VIT Chennai Hackathon Arena',
    polaroidCaption: '4 developers, 1 whiteboard, 0 sleep, and a podium trophy at dawn',
    emoji: '⚡',
    story:
      'We entered the hackathon arena with nothing but a blank Git repository, an idea for an autonomous developer assistant, and crates of energy drinks. At 3:15 AM, an asynchronous deadlock threatened to brick our entire live demo pipeline. We huddled around a single laptop, redesigned the message queue from scratch, stress-tested in parallel, and submitted 12 minutes before the deadline buzzer. Winning a top podium spot after that night proved what focused teamwork under pressure can build.',
    takeaway:
      'Under tight deadlines, clean modular contracts between components beat clever but tangled code every single time.',
    tapeColor: '#f87171',
    accentColor: '#ef4444',
    tags: ['Podium Finish', '36-Hour Sprint', 'Multi-Agent AI', 'Red Bull Fueled']
  },
  {
    id: 'memory-robotics-lab',
    title: 'Autonomous Rover Lab Trials & Microcontroller Sparks',
    category: 'Campus & Robotics',
    date: 'March 2024',
    location: 'IEEE RAS Robotics Lab, VIT Chennai',
    polaroidCaption: 'Tuning PID motor controllers directly on the cold laboratory floor',
    emoji: '🤖',
    story:
      'Months of soldering headers, 3D printing custom chassis brackets, and tuning closed-loop motor drivers came down to an arena obstacle trial. When our autonomous rover detected the infrared beacons, bypassed the tricky labyrinth chicane, and reported telemetry back to our ground station flawlessly, the whole lab cheered. Bridging the boundary between code algorithms and physical actuators is pure magic.',
    takeaway:
      'Hardware has no software rollback. Test voltage rails with a multimeter first, calibrate sensors in real environments, and decouple logic from hardware timers.',
    tapeColor: '#38bdf8',
    accentColor: '#0284c7',
    tags: ['IEEE RAS', 'Autonomous Rover', 'PID Control', 'Embedded C++']
  },
  {
    id: 'memory-doraemon-room',
    title: "Building Nobita's Room: Anime Nostalgia in WebGL",
    category: 'Doraemon Room',
    date: 'November 2026',
    location: 'My Room & Dual Monitors',
    polaroidCaption: 'Translating childhood Sunday mornings into 60 FPS Three.js',
    emoji: '🚪',
    story:
      "Growing up watching Doraemon, Nobita's cozy bedroom—with the time-travel desk drawer, green tatami mats, and the famous oshiire closet—represented the ultimate launchpad of imagination. I refused to build another cookie-cutter flat developer portfolio. Crafting procedural tatami textures, mathematical raycast collisions, and procedural audio synthesis from scratch turned childhood daydreams into an interactive engineering showcase.",
    takeaway:
      'Great portfolios and developer tools should evoke genuine delight. High technical standards and creative storytelling amplify each other.',
    tapeColor: '#facc15',
    accentColor: '#d97706',
    tags: ['Doraemon', 'Three.js', 'Procedural Shaders', 'Web Audio API']
  },
  {
    id: 'memory-open-source',
    title: 'First 100+ GitHub Stars on Open-Source Tools',
    category: 'Milestones',
    date: 'January 2025',
    location: 'Global Open-Source Community',
    polaroidCaption: 'When code written in this bedroom is deployed across 12 countries',
    emoji: '🌟',
    story:
      'What started out as an internal CLI helper to automate dataset batching and benchmark model inferences grew into an open-source utility. Waking up one morning to find pull requests from developers in Europe and Japan, alongside a flurry of GitHub stars crossing 100+, was surreal. It was my first firsthand taste of writing software that genuinely solved headaches for people thousands of miles away.',
    takeaway:
      'Write documentation as if the user is tired and hurried. Design API ergonomics so the easiest path is naturally the safe and correct path.',
    tapeColor: '#4ade80',
    accentColor: '#16a34a',
    tags: ['Open Source', '100+ Stars', 'Developer Tools', 'Global Impact']
  },
  {
    id: 'memory-csi-mentorship',
    title: 'Mentoring 200+ Freshmen at CSI Machine Learning Bootcamp',
    category: 'Community',
    date: 'August 2024',
    location: 'VIT Auditorium & Labs',
    polaroidCaption: 'From asking shy questions as a junior to teaching the next cohort',
    emoji: '🎓',
    story:
      'As part of the Computer Society of India student branch, I co-designed and led a hands-on AI & Machine Learning workshop series for 200+ first-year students. Watching students who had never written a Python script successfully train, visualize, and test their very first neural network models reminded me of why I fell in love with computer science in the first place.',
    takeaway:
      "You don't truly understand a concept deeply until you can explain it intuitively without jargon to someone on their very first day of coding.",
    tapeColor: '#c084fc',
    accentColor: '#9333ea',
    tags: ['CSI Student Chapter', '200+ Students', 'AI/ML Bootcamp', 'Mentorship']
  },
  {
    id: 'memory-fuse-filesystem',
    title: 'The 2 AM FUSE Kernel Panic & Inode Table Odyssey',
    category: 'Milestones',
    date: 'February 2025',
    location: 'Linux Kernel Sandbox',
    polaroidCaption: 'When you forget to unlock the superblock mutex before returning -ENOENT',
    emoji: '💻',
    story:
      'Writing an in-memory user-space file system in C/Rust with custom block allocators. A subtle deadlocked mutex caused the kernel test mount to freeze solid at 2:30 AM. After 3 cups of tea, dissecting GDB stack traces, and fixing pointer arithmetic in the inode table, the filesystem passed 10,000 rapid file I/O stress tests with zero memory leaks. A true systems programming rite of passage.',
    takeaway:
      'Never guess when you can measure. Debugging complex systems requires instrumentation, patience, and absolute respect for memory boundaries.',
    tapeColor: '#fb923c',
    accentColor: '#ea580c',
    tags: ['Systems Programming', 'FuseFS', 'Linux Kernel', 'GDB Tracing']
  }
];

export const CLOSET_FAVORITES_DATA = {
  topSongs: [
    { title: 'Sirikaadhey', artist: 'Anirudh Ravichander & Arjun Kanungo', vibe: 'Breezy acoustic melody & coding rhythm' },
    { title: 'Munbe Vaa', artist: 'A.R. Rahman, Shreya Ghoshal & Naresh Iyer', vibe: 'Soulful melodic masterpiece · late-night focus' },
    { title: 'Un Vizhigalil', artist: 'Anirudh Ravichander & Shruti Haasan', vibe: 'Serene acoustic flow state' },
    { title: 'New York Nagaram', artist: 'A.R. Rahman', vibe: 'Nostalgic rainy night architecture sessions' },
    { title: 'Idhu Varai', artist: 'Yuvan Shankar Raja & Andrea Jeremiah', vibe: 'Chill acoustic groove & debugging loops' },
    { title: 'Pirai Thedum', artist: 'G.V. Prakash Kumar & Saindhavi', vibe: 'Emotional strings & late-night code sprints' }
  ],
  favGames: [
    { title: 'Cyberpunk 2077', genre: 'Sci-Fi Action RPG · Night City', note: 'Immersive dystopian world, incredible narrative, and ray-traced neon aesthetics.' },
    { title: 'Red Dead Redemption 2', genre: 'Open World Masterpiece · Western', note: 'Unmatched world detail, storytelling, and Arthur Morgan’s unforgettable journey.' },
    { title: 'Minecraft', genre: 'Sandbox & Redstone Engineering', note: 'Designing automated redstone contraptions, farms, and endless creative worlds.' },
    { title: 'Elden Ring', genre: 'Dark Fantasy Action RPG · Soulslike', note: 'Peak world exploration in the Lands Between, challenging boss mechanics, and build variety.' },
    { title: 'Call of Duty', genre: 'Tactical First-Person Shooter', note: 'Fast-paced multiplayer reflexes and high-stakes squad clutches.' }
  ],
  favAnime: [
    { title: 'Attack on Titan', highlight: 'Masterpiece storytelling & plot twists', note: 'Unmatched intensity, complex morality, and jaw-dropping foreshadowing from start to finish.' },
    { title: 'One Piece', highlight: 'Peak world-building & grand adventure', note: 'Gear 5, the Straw Hat crew, and the greatest fictional odyssey ever written.' },
    { title: 'My Teen Romantic Comedy (Oregairu)', highlight: 'Philosophical dialogue & character depth', note: 'Hachiman’s genuine search for authenticity and sharp social observations.' },
    { title: 'Erased', highlight: 'Gripping time-leap psychological thriller', note: 'Edge-of-your-seat mystery, emotional rescue missions, and chilling suspense.' },
    { title: 'Vinland Saga', highlight: 'Profound character evolution & historical epic', note: 'Thorfinn’s transformative path from vengeance to true peace ("I have no enemies").' },
    { title: 'Parasyte', highlight: 'Sci-fi psychological horror & human nature', note: 'Shinichi and Migi’s symbiotic bond, high-stakes moral dilemmas, and gripping action.' },
    { title: 'Code Geass', highlight: 'Tactical genius & legendary finale', note: 'Lelouch’s brilliant chess-like mind games and one of anime’s greatest endings in Zero Requiem.' }
  ]
};

export const DEVELOPER_PROFILE = {
  name: 'Yeswanth Ram JP',
  degree: 'B.Tech Computer Science and Engineering (AI & ML)',
  institution: 'VIT Chennai',
  email: 'yeswanthram.2007@gmail.com',
  phone: '+916383744523',
  githubUrl: 'https://github.com/yeswanthram28',
  location: 'Chennai, India',
  shortBio:
    'im a goofy ahh dev\nnothing much to say\nbut one thing before meeting me in irl expect the unexpected',
  introduction: [
    'im a goofy ahh dev',
    'nothing much to say',
    'but one thing before meeting me in irl expect the unexpected'
  ],
  education: {
    degree: 'B.Tech in Computer Science and Engineering (Artificial Intelligence & Machine Learning)',
    institution: 'VIT Chennai',
    focusAreas: [
      'Data Structures',
      'Web Dev',
      'Databases',
      'Software Engineering'
    ]
  },
  interests: [
    {
      title: 'Artificial Intelligence & Autonomous Agents',
      description: 'Designing local-first LLM workflows, retrieval-augmented generation (RAG), and multi-step autonomous agents.'
    },
    {
      title: 'Full-Stack Software Development',
      description: 'Architecting APIs with FastAPI, NodeJS, and PostgreSQL paired with responsive React and Three.js interfaces.'
    }
  ],
  philosophy: [
    {
      principle: 'Expect the Unexpected',
      detail: 'im a goofy ahh dev — nothing much to say, but one thing before meeting me in irl expect the unexpected.'
    }
  ],
  resumeConfig: {
    pdfUrl: '',
    lastUpdated: '2026',
    sections: {
      education: 'B.Tech in CSE (AI & ML) — VIT Chennai (GPA: 8.55)',
      coreStack: 'C, C++, Java, Python, JavaScript, React, FastAPI, NodeJS, PostgresSQL, MySQL, ML, Computer Vision, LLMs, RAG',
      communities: 'IEEE RAS Software lead ( present ) · CSI tech lead (present)'
    }
  },
  socialLinks: [
    {
      id: 'email',
      label: 'Email Direct',
      handle: 'yeswanthram.2007@gmail.com',
      url: 'mailto:yeswanthram.2007@gmail.com',
      verified: true,
      note: 'Direct email for internships, collaborations, and projects.'
    },
    {
      id: 'github',
      label: 'GitHub Profile',
      handle: 'github.com/yeswanthram28',
      url: 'https://github.com/yeswanthram28',
      verified: true,
      note: 'Explore repositories, AI agents (Jarvis, Friday, TerraGuard), and systems code.'
    },
    {
      id: 'linkedin',
      label: 'Phone / Contact',
      handle: '+91 6383744523',
      url: 'tel:+916383744523',
      verified: true,
      note: 'Direct phone contact from resume.'
    }
  ],
  personalInterests: [],
  cupboardStash: []
};

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'jarvis',
    title: 'Jarvis — Local AI Assistant',
    subtitle: 'Offline-Capable Voice & Reasoning Desktop Assistant',
    category: 'AI/ML',
    secondaryCategories: ['Automation', 'Systems'],
    status: 'Completed',
    shortDescription:
      'A privacy-first local AI assistant powered by Ollama, llama.cpp, and RAG over personal notes and system workflows.',
    detailedDescription:
      'Jarvis is a locally hosted personal AI assistant built to execute desktop automation, semantic document retrieval, and contextual conversations without sending private data to third-party cloud APIs.',
    problemStatement:
      'Cloud-based assistants introduce latency, require constant connectivity, and expose personal documents and system state to external servers.',
    solution:
      'Engineered an on-device orchestration pipeline combining quantized local LLMs via Ollama and llama.cpp with FAISS vector indexing and deterministic tool-calling hooks.',
    contribution:
      'Designed the local RAG ingestion pipeline, low-latency prompt router, and modular tool execution sandbox in Python.',
    technologies: ['Python', 'Ollama', 'llama.cpp', 'LangChain', 'FAISS', 'RAG', 'FastAPI'],
    features: [
      'Zero-cloud local inference using quantized GGUF models via llama.cpp and Ollama',
      'Local FAISS vector store for instant semantic lookup across technical notes and PDFs',
      'Safe command-dispatch layer for system status checks, file organization, and reminders',
      'Streaming token response pipeline with persistent conversation memory'
    ],
    architectureSummary:
      'Voice/Text Input -> Intent Router -> Local FAISS RAG Context Builder -> Ollama / llama.cpp Inference Engine -> Tool Sandbox & Response Stream.',
    architectureNodes: [
      { id: 'in', label: 'CLI / Voice Input', role: 'Captures user query & session context', tier: 'input' },
      { id: 'rag', label: 'FAISS Retriever', role: 'Embeds & ranks local document chunks', tier: 'core' },
      { id: 'llm', label: 'Ollama / llama.cpp', role: 'Runs local quantized LLM inference', tier: 'core' },
      { id: 'out', label: 'Action Sandbox', role: 'Executes verified local automation tasks', tier: 'output' }
    ],
    accentColor: '#d97724'
  },
  {
    id: 'codesentinel',
    title: 'CodeSentinel — Autonomous AI DevOps Agent',
    subtitle: 'Multi-Agent CI/CD Diagnostics, Log Triage & Patch Synthesis',
    category: 'AI/ML',
    secondaryCategories: ['Automation', 'Full Stack'],
    status: 'Completed',
    shortDescription:
      'An autonomous multi-agent DevOps workflow using LangGraph that analyzes build failures, pinpoints root causes, and proposes verified patches.',
    detailedDescription:
      'CodeSentinel watches continuous integration pipelines and repository commits, using a stateful LangGraph agent graph to parse stack traces, inspect AST diffs, and generate actionable remediation reports.',
    problemStatement:
      'Developers lose hours diagnosing flaky CI pipelines, dependency regressions, and cryptic build logs across microservices.',
    solution:
      'Built a cyclic multi-agent system with specialized Log Analyzer, Code Context Retriever, and Remediation Verifier nodes orchestrated via LangGraph and FastAPI.',
    contribution:
      'Architected the stateful LangGraph workflow, repository context indexer, and web dashboard for inspecting agent reasoning steps.',
    technologies: ['Python', 'LangGraph', 'LangChain', 'FastAPI', 'PostgreSQL', 'Docker', 'Git', 'React'],
    features: [
      'Stateful multi-agent loop (Triage -> Code Inspection -> Patch Draft -> Validation)',
      'AST-aware diff analyzer that correlates failing stack frames with recent Git commits',
      'Automated webhook integration with n8n and containerized test runners',
      'Interactive timeline view of agent diagnostics and suggested code fixes'
    ],
    architectureSummary:
      'CI Webhook -> FastAPI Ingestion -> LangGraph Supervisor (Log Parser + Repo RAG + Patch Synthesizer) -> Docker Sandbox Check -> Dashboard Alert.',
    architectureNodes: [
      { id: 'ci', label: 'Git / CI Webhook', role: 'Streams build logs & commit diffs', tier: 'input' },
      { id: 'graph', label: 'LangGraph Orchestrator', role: 'Coordinates triage & patch agents', tier: 'core' },
      { id: 'db', label: 'PostgreSQL + Vector Store', role: 'Stores incident traces & repo embeddings', tier: 'storage' },
      { id: 'ui', label: 'DevOps Console', role: 'Presents root-cause analysis & diff patch', tier: 'output' }
    ],
    accentColor: '#2563eb'
  },
  {
    id: 'mediscan',
    title: 'MediScan AI — Medical Report Analyzer',
    subtitle: 'Structured Clinical Biomarker Extraction & Patient-Friendly Summaries',
    category: 'AI/ML',
    secondaryCategories: ['Full Stack'],
    status: 'Completed',
    shortDescription:
      'An AI-assisted medical lab report parser that extracts lab parameters, highlights out-of-range biomarkers, and generates clear educational explanations.',
    detailedDescription:
      'MediScan AI transforms dense diagnostic lab reports into structured biomarker tables and plain-language summaries backed by curated medical reference ranges.',
    problemStatement:
      'Patients often struggle to interpret complex pathology tables and medical terminology in diagnostic laboratory reports.',
    solution:
      'Combined OCR/document parsing with RAG-grounded LLM extraction and a FastAPI + React dashboard that visually maps biomarkers against standard reference intervals.',
    contribution:
      'Implemented the structured extraction schema, RAG grounding pipeline against reference guidelines, and interactive report viewer.',
    technologies: ['Python', 'PyTorch', 'Hugging Face', 'LangChain', 'RAG', 'FastAPI', 'React', 'PostgreSQL'],
    features: [
      'Automated extraction of biomarker names, measured values, units, and reference intervals',
      'RAG-grounded plain-language explanations with strict medical disclaimer guardrails',
      'Visual range indicators highlighting normal vs. attention-needed parameters',
      'Historical trend comparison across multiple uploaded report sessions'
    ],
    architectureSummary:
      'Report Upload -> Document Parser -> Hugging Face / PyTorch Entity Extractor -> Reference RAG Grounding -> Interactive Biomarker Dashboard.',
    architectureNodes: [
      { id: 'doc', label: 'Document Ingestion', role: 'Normalizes PDF/image lab reports', tier: 'input' },
      { id: 'ner', label: 'Biomarker Extractor', role: 'Parses structured test values & units', tier: 'core' },
      { id: 'rag', label: 'Medical Reference RAG', role: 'Grounds explanations in verified ranges', tier: 'storage' },
      { id: 'web', label: 'Patient Report UI', role: 'Renders clear tables & trend charts', tier: 'output' }
    ],
    accentColor: '#059669'
  },
  {
    id: 'soceng',
    title: 'Social Engineering Detection Platform',
    subtitle: 'Multi-Modal Phishing, Pretexting & Deceptive Link Classifier',
    category: 'AI/ML',
    secondaryCategories: ['Full Stack', 'Systems'],
    status: 'Completed',
    shortDescription:
      'A cybersecurity analysis platform that detects social engineering patterns, urgency manipulation, and malicious URLs in communications.',
    detailedDescription:
      'Designed to protect users and organizations from spear-phishing and psychological manipulation by analyzing linguistic urgency cues, sender anomalies, and URL structures.',
    problemStatement:
      'Modern phishing attacks rely on context-aware psychological manipulation (authority, urgency, pretexting) that bypass traditional keyword spam filters.',
    solution:
      'Trained and integrated NLP classification models with heuristic URL inspection and a real-time FastAPI + React triage console.',
    contribution:
      'Developed the linguistic manipulation scoring pipeline, REST API endpoints, and interactive threat breakdown interface.',
    technologies: ['Python', 'PyTorch', 'Hugging Face', 'FastAPI', 'SQLAlchemy', 'PostgreSQL', 'React'],
    features: [
      'Detects psychological triggers including artificial urgency, authority impersonation, and credential harvesting',
      'Inspects domain homoglyphs, redirect chains, and suspicious payload signatures',
      'Generates explainable threat breakdowns showing exact phrases that triggered alerts',
      'Batch and real-time message triage interface for security awareness training'
    ],
    architectureSummary:
      'Message/URL Input -> Linguistic & URL Feature Extractor -> Transformer Classifier -> Explainability Engine -> Security Triage UI.',
    architectureNodes: [
      { id: 'msg', label: 'Message / URL Input', role: 'Ingests email, chat, or link payload', tier: 'input' },
      { id: 'nlp', label: 'PyTorch / HF Classifier', role: 'Scores pretexting & urgency intent', tier: 'core' },
      { id: 'url', label: 'Heuristic Inspector', role: 'Checks domain spoofing & redirects', tier: 'core' },
      { id: 'rep', label: 'Explainable Alert View', role: 'Highlights risky spans & remediation', tier: 'output' }
    ],
    accentColor: '#dc2626'
  },
  {
    id: 'fusefs',
    title: 'FuseFS — Custom File System',
    subtitle: 'User-Space Virtual File System Built on Linux FUSE',
    category: 'Systems',
    secondaryCategories: ['Automation'],
    status: 'Completed',
    shortDescription:
      'A custom POSIX-compatible user-space file system in C/C++ utilizing Linux FUSE with custom inode indexing, caching, and metadata tagging.',
    detailedDescription:
      'FuseFS implements core file system operations (`getattr`, `readdir`, `open`, `read`, `write`, `mkdir`, `unlink`) in user space via libfuse, exploring block allocation, directory trees, and transparent file policies.',
    problemStatement:
      'Understanding operating system storage internals requires hands-on implementation of VFS hooks, inode tables, and buffer management without risking kernel panics.',
    solution:
      'Built a modular user-space file system daemon in C and C++ over Linux FUSE with an in-memory/backed block store and deterministic unit test harness.',
    contribution:
      'Implemented the VFS callback table, hierarchical path resolver, block allocation bitmap, and POSIX compliance test suite.',
    technologies: ['C', 'C++', 'Linux', 'Git', 'Docker'],
    features: [
      'Full implementation of core POSIX file and directory lifecycle operations in user space',
      'Custom inode table and fixed-size block allocator with free-space bitmap tracking',
      'Read/write LRU page cache to minimize redundant disk I/O operations',
      'Extended virtual status file (`/.fs_stats`) exposing live inode and block utilization'
    ],
    architectureSummary:
      'User Process (ls/cat/vim) -> Linux VFS Kernel Layer -> /dev/fuse Character Device -> FuseFS C/C++ Daemon -> Inode & Block Manager.',
    architectureNodes: [
      { id: 'vfs', label: 'POSIX Syscalls', role: 'Standard open/read/write/readdir calls', tier: 'input' },
      { id: 'fuse', label: 'Linux FUSE Bridge', role: 'Forwards VFS ops to user-space daemon', tier: 'core' },
      { id: 'inode', label: 'Inode & Path Engine', role: 'Resolves directory trees & permissions', tier: 'core' },
      { id: 'blk', label: 'Block Store & Cache', role: 'Manages data blocks & LRU buffers', tier: 'storage' }
    ],
    accentColor: '#7c3aed'
  },
  {
    id: 'neurosync',
    title: 'NeuroSync',
    subtitle: 'Adaptive Cognitive Focus & Study Workflow Synchronizer',
    category: 'Full Stack',
    secondaryCategories: ['AI/ML', 'Automation'],
    status: 'Completed',
    shortDescription:
      'An intelligent study and deep-work orchestration platform that synchronizes task complexity, spaced repetition, and focus sessions.',
    detailedDescription:
      'NeuroSync helps students and engineers structure complex learning roadmaps by pairing adaptive session scheduling with RAG-backed concept synthesis and progress analytics.',
    problemStatement:
      'Static to-do lists fail to account for cognitive load, concept dependencies, and retention decay across technical subjects.',
    solution:
      'Created a full-stack study workspace combining FastAPI, Supabase/PostgreSQL, and React with automated review scheduling and knowledge-graph linking.',
    contribution:
      'Built the full-stack application, spaced-repetition scheduler, and interactive concept workspace.',
    technologies: ['React', 'FastAPI', 'PostgreSQL', 'Supabase', 'Python', 'LangChain'],
    features: [
      'Dynamic study block scheduler calibrated by topic difficulty and past recall accuracy',
      'Linked technical note cards with instant semantic search across related topics',
      'Clean session telemetry tracking deep-work streaks without distracting gamification clutter',
      'Automated workflow hooks for syncing reading queues and milestone summaries'
    ],
    architectureSummary:
      'React Workspace -> FastAPI Scheduler Service -> Supabase / PostgreSQL Persistence -> Spaced-Recall & Semantic Link Engine.',
    architectureNodes: [
      { id: 'ui', label: 'Focus Workspace UI', role: 'Interactive study sessions & note graph', tier: 'input' },
      { id: 'api', label: 'FastAPI Engine', role: 'Computes recall intervals & task queues', tier: 'core' },
      { id: 'sup', label: 'Supabase / PostgreSQL', role: 'Persists user sessions & knowledge nodes', tier: 'storage' },
      { id: 'sync', label: 'Review Scheduler', role: 'Generates daily balanced study blocks', tier: 'output' }
    ],
    accentColor: '#0284c7'
  },
  {
    id: 'warranty',
    title: 'Digital Warranty Tracker',
    subtitle: 'Automated Receipt Vault, Expiry Lifecycle & Claim Assistant',
    category: 'Full Stack',
    secondaryCategories: ['Automation'],
    status: 'Completed',
    shortDescription:
      'A full-stack asset and warranty management application that organizes purchase receipts, tracks expiration timelines, and automates renewal reminders.',
    detailedDescription:
      'Digital Warranty Tracker eliminates lost paper invoices by storing structured product metadata, serial numbers, warranty durations, and automated n8n reminder workflows in a clean web portal.',
    problemStatement:
      'Consumers frequently miss warranty claim windows because thermal paper receipts fade and purchase records are scattered across email inboxes.',
    solution:
      'Built a centralized digital vault backed by FastAPI, SQLAlchemy, PostgreSQL, and React, paired with automated expiration notifications.',
    contribution:
      'Designed the relational database schema, RESTful CRUD API, receipt metadata parser, and responsive frontend dashboard.',
    technologies: ['React', 'FastAPI', 'PostgreSQL', 'SQLAlchemy', 'n8n', 'HTML', 'CSS', 'JavaScript'],
    features: [
      'Centralized vault for hardware serial numbers, invoices, and warranty coverage terms',
      'Automated countdown calculation with 30-day and 7-day pre-expiry alert workflows via n8n',
      'Instant filtering by product category, retailer, and active/expiring warranty status',
      'One-click export of claim-ready product dossiers'
    ],
    architectureSummary:
      'Receipt Entry -> FastAPI + SQLAlchemy -> PostgreSQL Vault -> n8n Scheduled Expiry Watcher -> User Alert & Claim Dossier.',
    architectureNodes: [
      { id: 'in', label: 'Asset & Receipt Form', role: 'Captures purchase date, serial & invoice', tier: 'input' },
      { id: 'api', label: 'FastAPI + SQLAlchemy', role: 'Validates & manages lifecycle state', tier: 'core' },
      { id: 'pg', label: 'PostgreSQL Database', role: 'Stores relational asset & warranty records', tier: 'storage' },
      { id: 'n8n', label: 'n8n Alert Workflow', role: 'Dispatches timely pre-expiry notifications', tier: 'output' }
    ],
    accentColor: '#d97706'
  },
  {
    id: 'agrios',
    title: 'AgriOS — IoT Gateway and Monitoring System',
    subtitle: 'Edge-to-Cloud Agricultural Telemetry & Automated Irrigation Control',
    category: 'IoT',
    secondaryCategories: ['Systems', 'Full Stack', 'Automation'],
    status: 'Completed',
    shortDescription:
      'An end-to-end IoT gateway and real-time environmental monitoring system for smart agriculture, bridging edge sensor nodes with an analytics backend.',
    detailedDescription:
      'AgriOS collects soil moisture, ambient temperature, humidity, and light telemetry from edge sensor nodes, aggregates packets through a local Linux gateway, and provides automated actuation rules and live dashboards.',
    problemStatement:
      'Small-to-mid scale agricultural setups often lack reliable, low-power telemetry gateways that can operate smoothly across intermittent network links.',
    solution:
      'Engineered a lightweight C++/Python IoT gateway service with local buffering, FastAPI + PostgreSQL time-series logging, n8n automation triggers, and a React monitoring interface.',
    contribution:
      'Developed the gateway packet aggregator, fault-tolerant local queue, backend telemetry API, and real-time sensor dashboard.',
    technologies: ['C++', 'Python', 'Linux', 'FastAPI', 'PostgreSQL', 'React', 'n8n', 'Docker'],
    features: [
      'Multi-sensor telemetry ingestion (soil moisture, temperature, humidity, NPK/light indices)',
      'Store-and-forward edge gateway buffer ensuring zero data loss during connectivity drops',
      'Rule-based threshold automation via n8n for irrigation valve and alert triggers',
      'Real-time web dashboard displaying zone health and historical sensor curves'
    ],
    architectureSummary:
      'Field Sensor Nodes -> C++/Linux Edge Gateway -> FastAPI Telemetry Ingestion -> PostgreSQL Time-Series Store -> React Control Room & n8n Actuators.',
    architectureNodes: [
      { id: 'edge', label: 'Edge Sensor Nodes', role: 'Samples soil moisture, temp & humidity', tier: 'input' },
      { id: 'gw', label: 'Linux IoT Gateway', role: 'Aggregates, buffers & forwards packets', tier: 'core' },
      { id: 'db', label: 'FastAPI + PostgreSQL', role: 'Persists telemetry logs & zone state', tier: 'storage' },
      { id: 'act', label: 'AgriOS UI & n8n Rules', role: 'Visualizes zones & triggers irrigation', tier: 'output' }
    ],
    accentColor: '#16a34a'
  }
];

export const EXPERIMENTAL_PROTOTYPES = [
  {
    id: 'proto-1',
    title: 'Quantized Edge-RAG on Raspberry Pi / Linux SBC',
    status: 'Experimental Lab Prototype',
    stack: ['C++', 'llama.cpp', 'FAISS', 'Linux'],
    description:
      'Benchmarking sub-3B parameter GGUF models with memory-mapped FAISS indices on constrained ARM Linux boards for completely air-gapped field diagnostics.'
  },
  {
    id: 'proto-2',
    title: 'Multi-Agent Kernel Log Debugger',
    status: 'Unfinished R&D Concept',
    stack: ['Python', 'LangGraph', 'C', 'Linux'],
    description:
      'Streaming `dmesg` and `strace` output into a local diagnostic state machine that correlates syscall failures with source line numbers.'
  },
  {
    id: 'proto-3',
    title: 'Procedural 3D Spatial Knowledge Graph',
    status: 'Active Sandbox',
    stack: ['Three.js', 'React', 'TypeScript'],
    description:
      'Turning markdown engineering vaults into navigable 3D rooms and bookshelves—the very experiment that evolved into this Nobita’s Room portfolio!'
  }
];

export const SKILLS_DATA: SkillItem[] = [
  // Programming
  {
    name: 'C',
    category: 'Programming',
    spineColor: '#991b1b',
    heightRatio: 0.92,
    summary: 'Low-level systems programming, POSIX system calls, pointers, memory allocation, and user-space file system implementation.',
    appliedIn: ['FuseFS — Custom File System', 'Operating Systems Lab']
  },
  {
    name: 'C++',
    category: 'Programming',
    spineColor: '#b91c1c',
    heightRatio: 0.96,
    summary: 'Object-oriented and systems programming, STL containers, RAII resource management, and high-throughput edge gateway services.',
    appliedIn: ['FuseFS — Custom File System', 'AgriOS — IoT Gateway']
  },
  {
    name: 'Python',
    category: 'Programming',
    spineColor: '#1d4ed8',
    heightRatio: 1.0,
    summary: 'Primary language for deep learning, multi-agent orchestration, RAG pipelines, FastAPI backends, and automation scripting.',
    appliedIn: ['Jarvis', 'CodeSentinel', 'MediScan AI', 'Social Engineering Detection Platform']
  },
  {
    name: 'Java',
    category: 'Programming',
    spineColor: '#c2410c',
    heightRatio: 0.88,
    summary: 'Object-oriented software design, data structures, multithreading, and cross-platform application architecture.',
    appliedIn: ['Core Software Engineering & Algorithms']
  },
  {
    name: 'JavaScript',
    category: 'Programming',
    spineColor: '#ca8a04',
    heightRatio: 0.94,
    summary: 'Asynchronous event-driven programming, modern ESNext/TypeScript web architecture, DOM orchestration, and interactive 3D WebGL apps.',
    appliedIn: ['Nobita’s Room 3D Portfolio', 'NeuroSync', 'Digital Warranty Tracker']
  },

  // AI/ML
  {
    name: 'PyTorch',
    category: 'AI/ML',
    spineColor: '#ea580c',
    heightRatio: 0.98,
    summary: 'Designing, training, and fine-tuning neural networks, transformer classifiers, and custom inference pipelines.',
    appliedIn: ['MediScan AI', 'Social Engineering Detection Platform']
  },
  {
    name: 'TensorFlow',
    category: 'AI/ML',
    spineColor: '#d97706',
    heightRatio: 0.91,
    summary: 'Building deep learning models, computer vision pipelines, and structured neural architectures.',
    appliedIn: ['AI/ML Coursework & Model Prototyping']
  },
  {
    name: 'LangChain',
    category: 'AI/ML',
    spineColor: '#059669',
    heightRatio: 0.95,
    summary: 'Composable LLM chains, document loaders, structured output parsers, and retrieval-augmented generation workflows.',
    appliedIn: ['Jarvis', 'CodeSentinel', 'MediScan AI', 'NeuroSync']
  },
  {
    name: 'LangGraph',
    category: 'AI/ML',
    spineColor: '#047857',
    heightRatio: 0.97,
    summary: 'Stateful, cyclic multi-agent architectures with deterministic control flow, tool execution loops, and human-in-the-loop checkpoints.',
    appliedIn: ['CodeSentinel — Autonomous AI DevOps Agent']
  },
  {
    name: 'RAG',
    category: 'AI/ML',
    spineColor: '#0f766e',
    heightRatio: 0.93,
    summary: 'Retrieval-Augmented Generation architecture: chunking strategies, hybrid semantic search, context reranking, and hallucination grounding.',
    appliedIn: ['Jarvis — Local AI Assistant', 'MediScan AI', 'CodeSentinel']
  },
  {
    name: 'FAISS',
    category: 'AI/ML',
    spineColor: '#115e59',
    heightRatio: 0.89,
    summary: 'High-speed dense vector similarity search and clustering for local, low-latency embedding retrieval.',
    appliedIn: ['Jarvis — Local AI Assistant']
  },
  {
    name: 'Hugging Face',
    category: 'AI/ML',
    spineColor: '#eab308',
    heightRatio: 0.94,
    summary: 'Working with open-weights transformers, tokenizers, embeddings, and domain-specific NLP classification models.',
    appliedIn: ['MediScan AI', 'Social Engineering Detection Platform']
  },

  // Backend
  {
    name: 'FastAPI',
    category: 'Backend',
    spineColor: '#0d9488',
    heightRatio: 0.96,
    summary: 'High-performance asynchronous Python REST & WebSocket APIs with Pydantic validation and OpenAPI documentation.',
    appliedIn: ['CodeSentinel', 'MediScan AI', 'NeuroSync', 'Digital Warranty Tracker', 'AgriOS']
  },
  {
    name: 'PostgreSQL',
    category: 'Backend',
    spineColor: '#2563eb',
    heightRatio: 0.95,
    summary: 'Relational schema design, indexing, transactional integrity, and structured + time-series telemetry persistence.',
    appliedIn: ['CodeSentinel', 'Digital Warranty Tracker', 'AgriOS', 'NeuroSync']
  },
  {
    name: 'SQLAlchemy',
    category: 'Backend',
    spineColor: '#4f46e5',
    heightRatio: 0.9,
    summary: 'Python ORM and SQL toolkit for clean data modeling, migrations, and connection pooling.',
    appliedIn: ['Digital Warranty Tracker', 'Social Engineering Detection Platform']
  },
  {
    name: 'Supabase',
    category: 'Backend',
    spineColor: '#16a34a',
    heightRatio: 0.91,
    summary: 'Postgres-backed backend-as-a-service with real-time subscriptions, row-level security, and pgvector integration.',
    appliedIn: ['NeuroSync']
  },

  // Frontend
  {
    name: 'React',
    category: 'Frontend',
    spineColor: '#0284c7',
    heightRatio: 0.96,
    summary: 'Component-driven UI engineering, custom hooks, state machines, and interactive desktop-grade web applications.',
    appliedIn: ['Nobita’s Room 3D Portfolio', 'CodeSentinel', 'MediScan AI', 'NeuroSync']
  },
  {
    name: 'Three.js',
    category: 'Frontend',
    spineColor: '#7c3aed',
    heightRatio: 0.98,
    summary: '3D procedural scene construction, PBR lighting, raycasting interaction managers, camera kinematics, and WebGL optimization.',
    appliedIn: ['Nobita’s Room — Immersive 3D Portfolio']
  },
  {
    name: 'HTML',
    category: 'Frontend',
    spineColor: '#ea580c',
    heightRatio: 0.87,
    summary: 'Semantic document structure, accessible ARIA interfaces, and canvas/DOM hybrid layering.',
    appliedIn: ['All Web & Portfolio Interfaces']
  },
  {
    name: 'CSS',
    category: 'Frontend',
    spineColor: '#2563eb',
    heightRatio: 0.89,
    summary: 'Responsive layouts, custom animations, tactile skeuomorphic themes (notebook, scrapbook, OS windows), and Tailwind CSS.',
    appliedIn: ['All Web & Portfolio Interfaces']
  },

  // Systems & Tools
  {
    name: 'Linux',
    category: 'Systems & Tools',
    spineColor: '#334155',
    heightRatio: 0.97,
    summary: 'POSIX environment, FUSE user-space file systems, shell automation, process diagnostics, and edge gateway administration.',
    appliedIn: ['FuseFS — Custom File System', 'AgriOS — IoT Gateway']
  },
  {
    name: 'Git',
    category: 'Systems & Tools',
    spineColor: '#dc2626',
    heightRatio: 0.92,
    summary: 'Distributed version control, branching workflows, commit diff inspection, and automated CI hooks.',
    appliedIn: ['CodeSentinel', 'All Engineering Projects']
  },
  {
    name: 'Docker',
    category: 'Systems & Tools',
    spineColor: '#0284c7',
    heightRatio: 0.94,
    summary: 'Containerizing multi-service AI backends, reproducible build sandboxes, and isolated microservice deployments.',
    appliedIn: ['CodeSentinel', 'AgriOS']
  },
  {
    name: 'Ollama',
    category: 'Systems & Tools',
    spineColor: '#475569',
    heightRatio: 0.93,
    summary: 'Serving and managing local large language models with low-latency REST APIs for privacy-preserving AI applications.',
    appliedIn: ['Jarvis — Local AI Assistant']
  },
  {
    name: 'llama.cpp',
    category: 'Systems & Tools',
    spineColor: '#64748b',
    heightRatio: 0.95,
    summary: 'High-efficiency C/C++ LLM inference engine for running quantized GGUF models across CPU and GPU hardware.',
    appliedIn: ['Jarvis — Local AI Assistant', 'Edge-RAG Prototype']
  },
  {
    name: 'n8n',
    category: 'Systems & Tools',
    spineColor: '#e11d48',
    heightRatio: 0.9,
    summary: 'Node-based workflow automation connecting webhooks, databases, AI agents, and IoT alert pipelines.',
    appliedIn: ['CodeSentinel', 'Digital Warranty Tracker', 'AgriOS']
  }
];

export const ACHIEVEMENTS_DATA: AchievementItem[] = [
  {
    id: 'ach-ieeeras',
    title: 'IEEE RAS Software lead ( present )',
    category: 'IEEE RAS',
    organization: 'IEEE RAS — VIT Chennai',
    period: 'present',
    summary: 'IEEE RAS Software lead ( present )',
    details: ['IEEE RAS Software lead ( present )'],
    pinColor: '#059669'
  },
  {
    id: 'ach-csi',
    title: 'CSI tech lead (present)',
    category: 'CSI',
    organization: 'CSI — VIT Chennai',
    period: 'present',
    summary: 'CSI tech lead (present)',
    details: ['CSI tech lead (present)'],
    pinColor: '#2563eb'
  },
  {
    id: 'ach-hackathons',
    title: '6xhackathon winner (as of now)',
    category: 'Hackathon',
    organization: 'Hackathons',
    period: 'as of now',
    summary: '6xhackathon winner (as of now)',
    details: ['6xhackathon winner (as of now)'],
    pinColor: '#dc2626'
  },
  {
    id: 'ach-coc',
    title: 'Clash of Clans - Clan Leader',
    category: 'Leadership',
    organization: 'Clash of Clans',
    period: 'Clan Leader',
    summary: 'Clash of Clans - Clan Leader',
    details: ['Clash of Clans - Clan Leader'],
    pinColor: '#d97706'
  }
];

export const DEVELOPER_TIMELINE = [
  {
    phase: 'Foundation Phase',
    title: 'Entered B.Tech AI & ML at VIT Chennai',
    description: 'Built core foundations in C, C++, Python, Data Structures, Linux internals, and Object-Oriented Programming in Java.'
  },
  {
    phase: 'Systems & Full-Stack Expansion',
    title: 'Engineered FuseFS, Digital Warranty Tracker & AgriOS',
    description: 'Explored Linux FUSE user-space file systems in C/C++, relational backend architectures with FastAPI & PostgreSQL, and IoT edge telemetry.'
  },
  {
    phase: 'Community & Technical Leadership',
    title: 'CSI & IEEE RAS Active Involvement',
    description: 'Contributed to technical workshops, hackathons, and robotics/automation initiatives within VIT Chennai student chapters.'
  },
  {
    phase: 'Autonomous AI & Spatial Web',
    title: 'Built Jarvis, CodeSentinel, MediScan AI & Nobita’s 3D Room',
    description: 'Focused on local LLM inference (Ollama, llama.cpp), LangGraph multi-agent DevOps workflows, RAG systems, and interactive Three.js experiences.'
  }
];

export const COLLECTIBLES_DATA: CollectibleItem[] = [
  {
    id: 'star-desk',
    name: 'Dorayaki Bit-Star #1',
    locationHint: 'Resting on the right side of the dark-walnut study desk',
    position: [0.12, 0.85, -1.92],
    jokeOrFact: 'Dev Joke #1: Why do C programmers wear glasses? Because they cannot C# — and they refuse to garbage-collect their pointers!'
  },
  {
    id: 'star-shelf',
    name: 'Memory-Bread Token #2',
    locationHint: 'Tucked atop the burgundy storage cabinet beside the green houseplant and alarm clock',
    position: [-2.18, 1.12, -2.02],
    jokeOrFact: 'Dev Joke #2: A SQL query walks into a bar, walks up to two tables and asks: "Can I JOIN you?"'
  },
  {
    id: 'star-oshiire',
    name: '4D-Pocket Gear Star #3',
    locationHint: 'Sitting inside the open right-side Oshiire closet shelf next to the white pillow',
    position: [2.25, 1.18, -0.75],
    jokeOrFact: 'Dev Joke #3: "It works on my machine!" — "Then we are shipping your machine inside a Docker container."'
  },
  {
    id: 'star-bed',
    name: 'Toy-Crate Star #4',
    locationHint: 'Inside the blue open toy box next to the rainbow ring stacker',
    position: [-2.18, 0.36, -1.15],
    jokeOrFact: 'Dev Joke #4: Debugging is like being the detective in a crime movie where you are also the murderer who wrote the race condition.'
  },
  {
    id: 'star-tatami',
    name: 'Bamboo-Copter Core #5',
    locationHint: 'Near the stacked books on the right-side tatami floor',
    position: [1.05, 0.22, 0.72],
    jokeOrFact: 'Dev Joke #5: There are 10 types of engineers: those who understand binary, and those who wondered why FuseFS returned -ENOENT.'
  }
];

export const STICKY_NOTES_DATA: StickyNoteItem[] = [
  {
    id: 'note-1',
    title: 'Desk Reminder: Local LLM Quantization',
    position: [-1.15, 1.25, -2.62],
    message: 'Remember: Q4_K_M in llama.cpp gives the sweet spot between VRAM footprint and perplexity for Jarvis!',
    authorNote: 'Pinned by Yeswanth during a 2 AM local-inference test run.'
  },
  {
    id: 'note-2',
    title: 'Bookshelf Hint: The Curious Spine',
    position: [-2.32, 1.25, 0.15],
    message: 'Psst! Have you inspected the glowing cyan volume on the dark-walnut bookshelf or clicked "Pull Mysterious Book" inside the Skills Directory?',
    authorNote: 'Unlocks the hidden R&D Developer Lab!'
  },
  {
    id: 'note-3',
    title: 'Closet Sticky: FUSE Mount Flag',
    position: [2.05, 1.42, 0.25],
    message: 'Always run `fusermount -u /tmp/fusefs` before rebuilding the inode table—otherwise your terminal stays busy!',
    authorNote: 'Systems programming survival note.'
  }
];

export const GUIDED_TOUR_STOPS: GuidedTourStop[] = [
  {
    id: 'tour-desk',
    title: '01 / 05 · The Study Table (About Me)',
    targetInteractableId: 'study_desk',
    cameraPos: [0.15, 1.48, -1.05],
    lookAt: [0.15, 0.82, -2.42],
    narration:
      'Welcome to Yeswanth Ram’s room! Right under the north window is the Study Table. Approaching it opens his Campus Notebook with background on his B.Tech in AI & ML at VIT Chennai, interests, and engineering philosophy.',
    sectionKey: 'about'
  },
  {
    id: 'tour-computer',
    title: '02 / 05 · Desktop Computer (Projects & Mini OS)',
    targetInteractableId: 'computer',
    cameraPos: [0.45, 1.48, -1.15],
    lookAt: [0.59, 1.02, -2.52],
    narration:
      'On the desk sits an interactive Desktop Computer running DoraOS. Open it to explore 8 technical projects (Jarvis, CodeSentinel, MediScan AI, FuseFS, AgriOS & more), inspect system architectures, or run commands in the simulated Terminal.',
    sectionKey: 'computer'
  },
  {
    id: 'tour-bookshelf',
    title: '03 / 05 · Tall Honey-Oak Bookshelf (Technical Skills)',
    targetInteractableId: 'bookshelf',
    cameraPos: [-0.65, 1.48, 0.88],
    lookAt: [-2.28, 1.15, 0.88],
    narration:
      'On the left wall stands the Tall Honey-Oak Bookshelf with 3 tiers of books and storage boxes on top. Each shelf groups Yeswanth’s technical stack across Programming (C/C++, Python, Java, JS), AI/ML, Backend, Frontend, and Linux Systems.',
    sectionKey: 'skills'
  },
  {
    id: 'tour-achievements',
    title: '04 / 05 · Low Amber Cabinet & Drawer (Achievements & Resume)',
    targetInteractableId: 'achievements',
    cameraPos: [-0.85, 1.48, -1.25],
    lookAt: [-2.28, 0.95, -2.12],
    narration:
      'In the back-left corner sits the Low Amber-Wood Cabinet showcasing hackathons, technical leadership, CSI, and IEEE RAS involvement—while the center pull-out Desk Drawer holds his formal Resume.',
    sectionKey: 'achievements'
  },
  {
    id: 'tour-window',
    title: '05 / 05 · The Bedroom Window (Social & Contact)',
    targetInteractableId: 'window',
    cameraPos: [0.0, 1.52, -1.05],
    lookAt: [0.0, 1.65, -2.85],
    narration:
      'Looking out the bedroom window framed by bright green curtains connects you with the outside world—offering direct verified links to Yeswanth’s GitHub, LinkedIn, and Email.',
    sectionKey: 'social'
  }
];

export const CODE_PUZZLES: CodePuzzle[] = [
  {
    id: 'puzzle-rag',
    title: 'Challenge 1: Fix the FAISS Vector Normalization Bug',
    language: 'Python (FAISS / RAG)',
    prompt: 'In Jarvis, cosine similarity with `IndexFlatIP` requires L2-normalized float32 embeddings before indexing. Which line fixes the unnormalized query bug?',
    buggySnippet: ` embeddings = encoder.encode(chunks).astype("float32")
 index = faiss.IndexFlatIP(embeddings.shape[1])
 # BUG: Inner product without L2 norm != Cosine Similarity
 index.add(embeddings)`,
    options: [
      {
        id: 'a',
        code: 'faiss.normalize_L2(embeddings)  # Normalize in-place before index.add',
        isCorrect: true,
        explanation: 'Correct! `faiss.normalize_L2` normalizes vectors in-place so Inner Product (`IndexFlatIP`) computes exact cosine similarity.'
      },
      {
        id: 'b',
        code: 'embeddings = embeddings / 255.0',
        isCorrect: false,
        explanation: 'Dividing by 255 scales pixel intensities, not vector L2 norms.'
      },
      {
        id: 'c',
        code: 'index.reset()',
        isCorrect: false,
        explanation: '`index.reset()` clears all stored vectors rather than normalizing them.'
      }
    ]
  },
  {
    id: 'puzzle-fuse',
    title: 'Challenge 2: POSIX FUSE getattr Return Code',
    language: 'C (Linux FUSE)',
    prompt: 'In FuseFS, when a requested path does not exist in the inode table during `getattr()`, what negative errno value must be returned to the kernel VFS?',
    buggySnippet: `static int fusefs_getattr(const char *path, struct stat *stbuf) {
  inode_t *node = lookup_inode(path);
  if (!node) {
    return ???; // Missing file entry
  }
  return 0;
}`,
    options: [
      {
        id: 'a',
        code: 'return -ENOENT;',
        isCorrect: true,
        explanation: 'Spot on! FUSE callbacks return `-ENOENT` (No such file or directory) so commands like `ls` and `cat` handle missing paths cleanly.'
      },
      {
        id: 'b',
        code: 'return 404;',
        isCorrect: false,
        explanation: '404 is an HTTP status code; Linux VFS expects negative `<errno.h>` constants.'
      },
      {
        id: 'c',
        code: 'return 0;',
        isCorrect: false,
        explanation: 'Returning 0 tells the kernel the file exists with an uninitialized `stat` buffer!'
      }
    ]
  },
  {
    id: 'puzzle-langgraph',
    title: 'Challenge 3: LangGraph Conditional Edge Termination',
    language: 'Python (LangGraph)',
    prompt: 'In CodeSentinel, once the Patch Verifier confirms all unit tests pass inside the Docker sandbox, where should the conditional edge route?',
    buggySnippet: `def route_after_verification(state: AgentState):
    if state["tests_passed"] or state["attempts"] >= 3:
        return ???
    return "synthesize_patch"`,
    options: [
      {
        id: 'a',
        code: 'return END  # from langgraph.graph import END',
        isCorrect: true,
        explanation: 'Exact match! Routing to `END` cleanly terminates the cyclic LangGraph state machine and emits the verified patch.'
      },
      {
        id: 'b',
        code: 'return "synthesize_patch"',
        isCorrect: false,
        explanation: 'Routing back to `synthesize_patch` when tests pass would create an infinite loop.'
      },
      {
        id: 'c',
        code: 'raise SystemExit()',
        isCorrect: false,
        explanation: 'Raising `SystemExit` crashes the FastAPI worker process instead of completing the graph run.'
      }
    ]
  }
];
