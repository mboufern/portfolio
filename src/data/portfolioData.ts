export interface Project {
  id: string;
  label: string;
  icon: string;
  description: string;
  technologies: string[];
  images: string[];
  imageLayout: 'landscape' | 'portrait';
  year: string;
  status: string;
  statusColor: string;
  period?: string;
  teamRole?: string;
  category?: string;
  highlights?: string[];
  demoUrl?: string;
  githubUrl?: string;
}

export interface ProjectSection {
  key: string;
  route: string;
  label: string;
  sublabel: string;
  accent: string;
  bg: string;
  projects: Project[];
}

export interface Skill {
  label: string;
  r: number;
  blur: number;
  artistic: boolean;
}

export interface GameReview {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  color: string;
  accentGlow: string;
  opinion: string;
}

export interface SocialLink {
  name: string;
  url: string;
  color: string;
  icon: string;
  handle?: string;
  category?: string;
}

export const PERSONAL_INFO = {
  name: 'Marouan Boufernana',
  firstName: 'Marouan',
  lastName: 'Boufernana',
  initials: 'MB',
  email: 'boufernana17@gmail.com',
  phone: '+212636964826',
  displayPhone: '+212 636-964-826',
  location: 'Casablanca, Morocco (GMT+1)',
  titles: [
    'Software Engineer',
    'Game Developer',
    '3D Artist',
    'Web Developer',
    'Artist',
    'Game Designer',
    'Gamer',
    'Programmer',
  ],
  // High-contrast, WCAG AA compliant palette on light background (#ffffff / #f8f7fc)
  titleColors: [
    '#00839e', // Rich Deep Cyan (4.43:1 on white) — Software
    '#db2777', // Vivid Rose (4.60:1 on white) — Game Dev
    '#7c3aed', // Deep Violet (5.70:1 on white) — 3D Art
    '#0a8967', // Deep Mint (4.39:1 on white) — Experience
  ],
};

export const PROJECT_SECTIONS: ProjectSection[] = [
  {
    key: 'software',
    route: '/software',
    label: 'Software Engineering',
    sublabel: 'Web & Backend',
    accent: '#2bbece',
    bg: '#f0fafc',
    projects: [
      {
        id: 'mb-games-website',
        label: 'MB Games Website',
        icon: 'language',
        imageLayout: 'landscape',
        category: 'Creative Web & SPA',
        period: 'Jan 2026 – Present',
        teamRole: 'Solo Developer & Designer',
        description:
          'A personal portfolio and interactive showcase website built with React, TypeScript, and Vite. Features a bespoke design system, silk-smooth 60fps cubic scroll engine, interactive D3.js physics-driven skills hero, and Cloudflare Pages SPA deployment.',
        technologies: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'React Router', 'Framer Motion', 'D3'],
        highlights: [
          'Silky smooth RAF scroll engine with cubic easing',
          'Interactive D3 physics skill bubble simulation',
          'Hardware-accelerated 3D layered project cards',
        ],
        githubUrl: 'https://github.com/mboufern',
        demoUrl: 'https://mboufernana.com',
        images: [],
        year: '2026',
        status: 'In Progress',
        statusColor: '#2bbece',
      },
      {
        id: 'spring-api',
        label: 'REST API Platform',
        icon: 'api',
        imageLayout: 'landscape',
        category: 'Cloud Backend & Microservices',
        period: 'Oct 2024 – Feb 2025 (5 mos)',
        teamRole: 'Lead Architect · Team of 3',
        description:
          'A production-grade REST API built with Spring Boot featuring stateless JWT authentication with token rotation, fine-grained role-based access control, PostgreSQL persistence with HikariCP pooling, Docker containerization, and automated GitHub Actions CI/CD.',
        technologies: ['Java', 'Spring Boot', '.Net', 'PostgreSQL', 'Docker', 'Terraform', 'GitHub Actions'],
        highlights: [
          'JWT authentication with refresh token rotation',
          'PostgreSQL migrations & connection pooling',
          'Automated CI/CD with Docker multi-stage builds',
        ],
        githubUrl: 'https://github.com/mboufern',
        images: [],
        year: '2025',
        status: 'Released',
        statusColor: '#15cea9',
      },
      {
        id: 'laravel-app',
        label: 'Laravel Web App',
        icon: 'web',
        imageLayout: 'landscape',
        category: 'Fullstack Web Application',
        period: 'Apr 2024 – Aug 2024 (5 mos)',
        teamRole: 'Fullstack Developer · Team of 2',
        description:
          'A full-stack Laravel + Vue application with server-side rendering, Eloquent ORM, asynchronous Redis queues for distributed background jobs, and complete Stripe payment checkout with webhook verification.',
        technologies: ['PHP', 'Laravel', 'Vue', 'MySQL', 'Redis', 'Stripe'],
        highlights: [
          'Asynchronous queue processing with Redis',
          'Stripe checkout & webhook event reconciliation',
          'Eloquent ORM query optimization & caching',
        ],
        githubUrl: 'https://github.com/mboufern',
        images: [],
        year: '2024',
        status: 'Released',
        statusColor: '#15cea9',
      },
    ],
  },
  {
    key: 'gamedev',
    route: '/gamedev',
    label: 'Game Development',
    sublabel: 'Unity & Mobile',
    accent: '#ff779c',
    bg: '#fff5f8',
    projects: [
      {
        id: 'wnt-party',
        label: 'Walls & Tower Party',
        icon: 'casino',
        imageLayout: 'landscape',
        category: 'Online Multiplayer Game',
        period: 'May 2024 – Dec 2024 (8 mos)',
        teamRole: 'Solo Game Developer & Artist',
        description:
          'An online multiplayer board strategy game built in Unity featuring authoritative real-time network synchronisation via Netcode for GameObjects, room lobby matchmaking, particle dice rolling physics, wall-building strategy mechanics, and cross-platform Android/PC/iOS builds.',
        technologies: ['Unity', 'C#', 'Netcode for GameObjects', 'Firebase', 'Android', 'iOS', 'Blender'],
        highlights: [
          'Real-time sync via Netcode for GameObjects',
          'Cross-platform play across Android, PC & iOS',
          'Custom physics dice and animated board interactions',
        ],
        images: ['/assets/wnt/full.gif'],
        demoUrl: 'https://itch.io',
        year: '2025',
        status: 'Released',
        statusColor: '#ff779c',
      },
      {
        id: 'game-2',
        label: 'Chrono Rift (Prototype)',
        icon: 'sports_esports',
        imageLayout: 'landscape',
        category: 'Action Game Prototype',
        period: 'Jan 2026 – Present',
        teamRole: 'Solo Game Developer',
        description:
          'A high-octane 3D action prototype currently in active development. Features a custom state-machine character controller, dynamic hitboxes, custom HLSL shaders via Shader Graph, and procedural arena room layouts.',
        technologies: ['Unity', 'C#', 'Game Design', 'Shader Graph', 'Blender'],
        highlights: [
          'Hierarchical state-machine combat controller',
          'Procedural arena room layout generator',
          'Custom Shader Graph stylized visual effects',
        ],
        images: [],
        year: '2026',
        status: 'In Development',
        statusColor: '#ffb347',
      },
    ],
  },
  {
    key: '3d',
    route: '/3d-art',
    label: '3D Modeling',
    sublabel: 'Blender & Art',
    accent: '#a78bfa',
    bg: '#f7f4ff',
    projects: [
      {
        id: '3d-env',
        label: 'Environment Art',
        icon: 'landscape',
        imageLayout: 'landscape',
        category: 'Real-Time Game Environments',
        period: 'Jun 2024 – Nov 2024 (6 mos)',
        teamRole: 'Solo 3D Artist',
        description:
          'A collection of hand-crafted game-ready environment assets including modular architectural structures, stylized terrain biomes, and optimized foliage. Full pipeline from initial blockout to Substance Painter texturing and Unity engine export.',
        technologies: ['Blender', 'Texturing', 'Rigging', 'Level Design', 'Unity'],
        highlights: [
          'Modular kitbash kit for rapid level design',
          'PBR trim sheet & tileable material workflows',
          'Optimized draw-calls and custom collision hulls',
        ],
        images: [],
        year: '2025',
        status: 'Portfolio',
        statusColor: '#a78bfa',
      },
      {
        id: '3d-char',
        label: 'Character Models',
        icon: 'accessibility_new',
        imageLayout: 'portrait',
        category: 'PBR Rigged Characters',
        period: 'Nov 2024 – Apr 2025 (6 mos)',
        teamRole: 'Solo 3D Character Artist',
        description:
          'Stylized and realistic character models featuring clean anatomical edge loops for natural joint deformation, non-overlapping 4K UV unwraps, PBR texture sets, and game-ready Humanoid FK/IK skeletal rigs tested in Unity Mecanim.',
        technologies: ['Blender', 'Animation', 'Rigging', 'Texturing', 'Substance'],
        highlights: [
          'Deformation-friendly topology for limbs & joints',
          'Complete Humanoid FK/IK skeleton setup',
          'Substance 4K PBR material maps export',
        ],
        images: [],
        year: '2025',
        status: 'Portfolio',
        statusColor: '#a78bfa',
      },
    ],
  },
];

export const SKILLS: Skill[] = [
  // Tech
  { label: 'Java', r: 24, blur: 1.5, artistic: false },
  { label: 'JavaScript', r: 28, blur: 1, artistic: false },
  { label: 'TypeScript', r: 26, blur: 1, artistic: false },
  { label: 'C#', r: 22, blur: 1.5, artistic: false },
  { label: '.Net', r: 22, blur: 2, artistic: false },
  { label: 'Spring Boot', r: 27, blur: 1.5, artistic: false },
  { label: 'PHP', r: 21, blur: 2, artistic: false },
  { label: 'Laravel', r: 24, blur: 1.5, artistic: false },
  { label: 'Symfony', r: 22, blur: 2, artistic: false },
  { label: 'React', r: 26, blur: 1, artistic: false },
  { label: 'Angular', r: 24, blur: 1.5, artistic: false },
  { label: 'Vue', r: 22, blur: 2, artistic: false },
  { label: 'PostgreSQL', r: 26, blur: 1.5, artistic: false },
  { label: 'MySQL', r: 23, blur: 2, artistic: false },
  { label: 'Python', r: 25, blur: 1.5, artistic: false },
  { label: 'Testing', r: 21, blur: 2, artistic: false },
  { label: 'Software Architecture', r: 32, blur: 1, artistic: false },
  { label: 'Terraform', r: 24, blur: 2, artistic: false },
  { label: 'Docker', r: 23, blur: 1.5, artistic: false },
  { label: 'DevOps', r: 23, blur: 1.5, artistic: false },
  { label: 'Agentic development', r: 30, blur: 1, artistic: false },
  // Artistic — bigger, less blurry
  { label: 'Unity', r: 30, blur: 0.5, artistic: true },
  { label: 'Blender', r: 30, blur: 0.5, artistic: true },
  { label: 'Game Design', r: 32, blur: 0.5, artistic: true },
  { label: 'UI/UX', r: 28, blur: 0.5, artistic: true },
  { label: 'Level Design', r: 30, blur: 0.5, artistic: true },
  { label: 'Texturing', r: 27, blur: 0.5, artistic: true },
  { label: 'Rigging', r: 25, blur: 0.5, artistic: true },
  { label: 'Animation', r: 27, blur: 0.5, artistic: true },
];

export const PLAYED_GAMES: GameReview[] = [
  {
    id: 'botw',
    title: 'The Legend of Zelda: Breath of the Wild',
    subtitle: 'Reinventing Open-World Freedom',
    image: '/assets/games/botw.jpg',
    color: '#2bbece',
    accentGlow: 'rgba(43, 190, 206, 0.45)',
    opinion:
      'The world design is not merely immersive, but engineered in a remarkably clever way that compels you to explore. It constantly keeps you on your toes, promising that there are always new secrets to uncover, NPCs to meet, and monsters to battle. Distributing the story across the world through memories and the Divine Beasts makes exploration and adventuring feel even more rewarding.',
  },
  {
    id: 'totk',
    title: 'The Legend of Zelda: Tears of the Kingdom',
    subtitle: 'Engineering Sandbox Marvel',
    image: '/assets/games/totk.jpg',
    color: '#10b981',
    accentGlow: 'rgba(16, 185, 129, 0.45)',
    opinion:
      'They expanded on the Hyrule we already knew by introducing two new layers to the world, encouraging vertical exploration across biomes that radically change how you play. The new abilities are pure genius, giving the player complete freedom over what weapons to craft and which tools to use in battle.',
  },
  {
    id: 'rdr2',
    title: 'Red Dead Redemption 2',
    subtitle: 'The Living Frontier',
    image: '/assets/games/rdr2.jpg',
    color: '#e11d48',
    accentGlow: 'rgba(225, 29, 72, 0.45)',
    opinion:
      'The level of immersion in this game is truly next level, largely thanks to the living world and NPCs who remember your actions throughout the journey, giving every choice real weight. The narrative takes you through an emotional rollercoaster, offering ample time to genuinely connect with every character.',
  },
  {
    id: 'silksong',
    title: 'Hollow Knight: Silksong',
    subtitle: 'Gothic Needle & Thread',
    image: '/assets/games/silksong.jpg',
    color: '#ff779c',
    accentGlow: 'rgba(255, 119, 156, 0.45)',
    opinion:
      'The world-building delivers a grand adventure through sharp, thrilling challenge. The enemies and bosses push you to experiment with different moves and tools, while the multifaceted rewards make every path worth exploring with a curious mind. Rooted deeply in the world and encounters, the story invites you to live the journey yourself rather than just being told it.',
  },
  {
    id: 'mgsv',
    title: 'Metal Gear Solid V: The Phantom Pain',
    subtitle: 'The Ultimate Stealth Sandbox',
    image: '/assets/games/mgsv.jpg',
    color: '#f59e0b',
    accentGlow: 'rgba(245, 158, 11, 0.45)',
    opinion:
      'The sheer freedom and variety in gameplay continues to impress me day after day. The enemy AI elevates this tremendously through how dynamically they respond to your actions in both the short and long term—adapting their equipment based on your tactics in previous missions. The story is gripping, and I enjoyed every cinematic cutscene in the game.',
  },
];

export const SOCIALS: SocialLink[] = [
  {
    name: 'GitHub',
    url: 'https://github.com/mboufern',
    color: '#181717',
    icon: 'github',
    handle: '@mboufern',
    category: 'Source Code & Architecture',
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/boufer/',
    color: '#0a66c2',
    icon: 'linkedin',
    handle: 'in/boufer',
    category: 'Professional Network',
  },
  {
    name: 'Itch.io',
    url: 'https://marouan-boufer.itch.io/',
    color: '#fa5c5c',
    icon: 'itch',
    handle: 'marouan-boufer',
    category: 'Playable Indie Games',
  },
  {
    name: 'LeetCode',
    url: 'https://leetcode.com/u/boufernana17/',
    color: '#ffa116',
    icon: 'leetcode',
    handle: 'boufernana17',
    category: 'Algorithms & Problem Solving',
  },
  {
    name: 'X (Twitter)',
    url: 'https://x.com/BouferMarouan',
    color: '#0f1419',
    icon: 'x',
    handle: '@BouferMarouan',
    category: 'Devlogs & Tech Insights',
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com/mar1boufer',
    color: '#e1306c',
    icon: 'instagram',
    handle: '@mar1boufer',
    category: '3D Renders & Game Art',
  },
];

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  startDate: string; // 'YYYY-MM'
  endDate?: string;  // 'YYYY-MM' or undefined for 'Present'
  highlights: string[];
  accent: string;
  logo?: string;
  isInternship?: boolean;
  bgColor?: string;
  glowColor?: string;
  textColor?: string;
}

export const EXPERIENCE_ITEMS: ExperienceItem[] = [
  {
    id: 'valinnov-lead',
    company: 'Valinnov',
    role: 'Tech Lead & Architect',
    period: 'February 2025 – Present',
    startDate: '2025-02',
    highlights: [
      'Leading the engineering development team and architecture design.',
      'Managing Git branching strategies, automated testing, and DevOps CI/CD pipelines.',
      'Supervising and maintaining a multi-tenant microservices cloud infrastructure.',
    ],
    accent: '#99ff66',
    logo: '/assets/experience/valinnov.png',
    isInternship: false,
    bgColor: '#144346',
    glowColor: '#99ff66',
    textColor: '#ffffff',
  },
  {
    id: 'valinnov-fullstack',
    company: 'Valinnov',
    role: 'Junior Fullstack Developer',
    period: 'October 2024 – February 2025',
    startDate: '2024-10',
    endDate: '2025-01',
    highlights: [
      'Fullstack web development and modular component architecture.',
      'Agile / SCRUM epic design and user story refinement.',
      'High-fidelity UX/UI interface design using Figma.',
      'Active pull request reviews and quality assurance.',
    ],
    accent: '#99ff66',
    logo: '/assets/experience/valinnov.png',
    isInternship: true,
    bgColor: '#144346',
    glowColor: '#99ff66',
    textColor: '#ffffff',
  },
  {
    id: 'dxc-tech',
    company: 'DXC Technology',
    role: 'Fullstack Developer & Team Coordinator',
    period: 'February 2024 – August 2024',
    startDate: '2024-02',
    endDate: '2024-08',
    highlights: [
      'End-to-end fullstack application design and development.',
      'Team leadership, workflow tracking, and project milestone deliveries.',
    ],
    accent: '#6399f0',
    logo: '/assets/experience/dxc.png',
    isInternship: true,
    bgColor: '#ffffff',
    glowColor: '#6399f0',
    textColor: '#1c1b20',
  },
  {
    id: 'pareto',
    company: 'Pareto',
    role: 'Fullstack Developer',
    period: 'April 2023 – July 2023',
    startDate: '2023-04',
    endDate: '2023-07',
    highlights: [
      'Fullstack solution development and feature enhancements.',
      'Project milestone tracking and cross-functional team coordination.',
    ],
    accent: '#5bb2f0',
    logo: '/assets/experience/pareto.png',
    isInternship: true,
    bgColor: '#ffffff',
    glowColor: '#c8e5ff',
    textColor: '#1c1b20',
  },
  {
    id: 'mca',
    company: 'Management Consulting and Account',
    role: 'Fullstack Developer',
    period: 'April 2022 – July 2022',
    startDate: '2022-04',
    endDate: '2022-07',
    highlights: [
      'Fullstack software engineering and internal web tooling integration.',
    ],
    accent: '#4da81f',
    isInternship: true,
    bgColor: '#ffffff',
    glowColor: '#4da81f',
    textColor: '#1c1b20',
  },
  {
    id: 'alternative-it',
    company: 'Alternative IT',
    role: 'Mobile Developer',
    period: 'June 2021 – July 2021',
    startDate: '2021-06',
    endDate: '2021-07',
    highlights: [
      'Mobile application design, cross-platform UI prototyping, and development.',
    ],
    accent: '#66c0f4',
    isInternship: true,
    bgColor: '#ffffff',
    glowColor: '#66c0f4',
    textColor: '#1c1b20',
  },
];

/**
 * Calculates cumulative total of years and months of experience compared with a reference date.
 */
export function calculateTotalExperience(
  items: ExperienceItem[] = EXPERIENCE_ITEMS,
  now: Date = new Date()
): { years: number; months: number; text: string } {
  let totalMonths = 0;

  for (const item of items) {
    if (!item.startDate) continue;
    const [startYear, startMonth] = item.startDate.split('-').map(Number);
    let endYear: number;
    let endMonth: number;

    if (item.endDate) {
      [endYear, endMonth] = item.endDate.split('-').map(Number);
    } else {
      endYear = now.getFullYear();
      endMonth = now.getMonth() + 1;
    }

    const months = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
    if (months > 0) {
      totalMonths += months;
    }
  }

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  const parts: string[] = [];
  if (years > 0) {
    parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
  }
  if (months > 0 || parts.length === 0) {
    parts.push(`${months} ${months === 1 ? 'month' : 'months'}`);
  }

  return {
    years,
    months,
    text: parts.join(' and '),
  };
}

export interface NavigationItem {
  key: string;
  route: string;
  label: string;
  icon: string;
  accent: string;
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { key: 'intro', route: '/', label: 'Overview', icon: 'person', accent: '#15cea9' },
  { key: 'experience', route: '/experience', label: 'Experience', icon: 'work', accent: '#15cea9' },
  { key: 'software', route: '/software', label: 'Software', icon: 'terminal', accent: '#2bbece' },
  { key: 'gamedev', route: '/gamedev', label: 'Game Dev', icon: 'sports_esports', accent: '#ff779c' },
  { key: '3d', route: '/3d-art', label: '3D Art', icon: 'view_in_ar', accent: '#a78bfa' },
  { key: 'games', route: '/games', label: 'Favorite Games', icon: 'casino', accent: '#ff779c' },
  { key: 'connect', route: '/connect', label: 'Connect', icon: 'send', accent: '#15cea9' },
];
