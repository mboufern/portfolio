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
  title: string;
  image: string;
  emoji?: string;
  rating: number;
  color: string;
  opinion: string;
}

export interface SocialLink {
  name: string;
  url: string;
  color: string;
  icon: string;
}

export const PERSONAL_INFO = {
  name: 'Marouan Boufernana',
  firstName: 'Marouan',
  lastName: 'Boufernana',
  initials: 'MB',
  email: 'boufernana17@gmail.com',
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
  titleColors: ['#2bbece', '#ff779c', '#a78bfa', '#15cea9'],
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
        description:
          'A personal portfolio and game showcase website built with React, TypeScript, and Vite. Features a custom design system, animated drip navbar, per-game cinematic detail pages, a D3-powered skills hero, and scroll-snap portfolio sections.',
        technologies: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'React Router', 'Framer Motion'],
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
        description:
          'A production-grade REST API built with Spring Boot featuring JWT authentication, role-based access control, PostgreSQL persistence, Docker deployment, and automated CI/CD pipelines via GitHub Actions.',
        technologies: ['Java', 'Spring Boot', '.Net', 'PostgreSQL', 'Docker', 'Terraform'],
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
        description:
          'A full-stack Laravel + Vue application with server-side rendering, Eloquent ORM, Redis queues for background jobs, and Stripe payment integration.',
        technologies: ['PHP', 'Laravel', 'Vue', 'MySQL', 'Redis', 'Stripe'],
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
        description:
          'An online multiplayer board game built in Unity featuring real-time synchronisation via Netcode for GameObjects, a full lobby system, animated dice rolls with particle effects, wall-building strategy mechanics, and cross-platform Android/PC/iOS support.',
        technologies: ['Unity', 'C#', 'Netcode for GameObjects', 'Firebase', 'Android', 'iOS'],
        images: ['/assets/wnt/full.gif'],
        year: '2025',
        status: 'Released',
        statusColor: '#ff779c',
      },
      {
        id: 'game-2',
        label: 'Prototype — TBA',
        icon: 'sports_esports',
        imageLayout: 'landscape',
        description:
          'A new game prototype currently in early development. Details coming soon — stay tuned.',
        technologies: ['Unity', 'C#', 'Game Design'],
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
        description:
          'A collection of hand-crafted environment assets including terrain, vegetation, and architectural elements. Full pipeline from blockout to final textured export for real-time engines.',
        technologies: ['Blender', 'Texturing', 'Rigging', 'Level Design'],
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
        description:
          'Stylised and realistic character models with full UV unwrap, PBR texture sets, and game-ready rigged skeletons. Animations created in Blender and exported for Unity.',
        technologies: ['Blender', 'Animation', 'Rigging', 'Texturing'],
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
    title: 'Hollow Knight',
    image: '/assets/games/hollow-knight.jpg',
    rating: 5,
    color: '#15cea9',
    opinion:
      'A masterpiece of metroidvania design. Haunting atmosphere, hand-drawn beauty, and one of the most satisfying exploration loops ever made.',
  },
  {
    title: 'Cyberpunk 2077',
    image: '/assets/games/cyberpunk-2077.jpg',
    rating: 4,
    color: '#ff779c',
    opinion:
      "After the 2.0 update: a breathtaking open world. Night City is one of gaming's greatest achievements in world-building and density.",
  },
  {
    title: 'Hades',
    image: '/assets/games/hades.jpg',
    rating: 5,
    color: '#2bbece',
    opinion:
      'The perfect roguelite. Every run feels fresh, the writing is razor-sharp, and the combat is endlessly satisfying.',
  },
  {
    title: 'Minecraft',
    image: '/assets/games/minecraft.png',
    rating: 5,
    color: '#15cea9',
    opinion:
      'More of a creative platform than a game. The ultimate sandbox. Thousands of hours and still finding new ideas.',
  },
  {
    title: 'Elden Ring',
    image: '/assets/games/elden-ring.jpg',
    rating: 4,
    color: '#ff779c',
    opinion:
      'Open-world Souls done right. Brutally hard but endlessly rewarding. The sense of discovery is unmatched.',
  },
  {
    title: 'Portal 2',
    image: '/assets/games/portal-2.jpg',
    rating: 5,
    color: '#2bbece',
    opinion:
      'Perfectly designed puzzles wrapped in genuinely funny writing. A timeless classic and a game design benchmark.',
  },
];

export const SOCIALS: SocialLink[] = [
  { name: 'GitHub', url: 'https://github.com/mboufern', color: '#24292e', icon: 'code' },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/mboufern', color: '#0a66c2', icon: 'work' },
  { name: 'Instagram', url: 'https://instagram.com/mboufern', color: '#e1306c', icon: 'photo_camera' },
  { name: 'Itch.io', url: 'https://itch.io', color: '#fa5c5c', icon: 'videogame_asset' },
  { name: 'YouTube', url: 'https://youtube.com', color: '#ff0000', icon: 'play_circle' },
  { name: 'Discord', url: 'https://discord.com', color: '#7289da', icon: 'forum' },
];

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
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
  { key: 'games', route: '/games', label: 'Games', icon: 'casino', accent: '#ff779c' },
  { key: 'connect', route: '/connect', label: 'Connect', icon: 'send', accent: '#15cea9' },
];
