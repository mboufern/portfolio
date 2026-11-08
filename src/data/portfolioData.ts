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
  video?: string;
  lottie?: string;
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
    sublabel: 'Web & Fullstack',
    accent: '#2bbece',
    bg: '#f0fafc',
    projects: [
      {
        id: 'moraja3ati',
        label: 'Moraja3ati',
        icon: 'web',
        imageLayout: 'landscape',
        category: 'EdTech & AI Platform',
        period: '2025 – 2026',
        teamRole: 'Fullstack Developer',
        description:
          'Production educational web platform for Moroccan students. Includes AI tutoring (Ostad), interactive exercises, curriculum progression, authentication, and subscription billing.',
        technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'Prisma', 'Tailwind CSS'],
        highlights: [
          'Live in production at moraja3ati.ma',
          'AI-powered student tutoring and interactive course exercises',
          'Full-stack architecture with Prisma and PostgreSQL',
        ],
        images: [
          '/assets/projects/moraja3ati/feature-ostad.png',
          '/assets/projects/moraja3ati/feature-practice.png',
          '/assets/projects/moraja3ati/hero-app-screenshot-old.png',
        ],
        demoUrl: 'https://moraja3ati.ma/',
        year: '2026',
        status: 'Live / Production',
        statusColor: '#10b981',
      },
      {
        id: 'interview-point',
        label: 'InterViewPoint',
        icon: 'web',
        imageLayout: 'landscape',
        category: 'Web Application',
        period: '2026',
        teamRole: 'Solo Developer',
        description:
          'Single-page web application for interview preparation and candidate assessment. Features interview session execution, evaluation scoring rubrics, calendar tracking, and visual analytics.',
        technologies: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Recharts'],
        highlights: [
          'Interactive rubric scoring and interview workflows',
          'Statistical chart summaries powered by Recharts',
          'Client-side state persistence and export capabilities',
        ],
        demoUrl: 'https://mboufern.github.io/InterViewPoint/',
        githubUrl: 'https://github.com/mboufern/InterViewPoint',
        images: [],
        year: '2026',
        status: 'Released',
        statusColor: '#2bbece',
      },
      {
        id: 'tak-game',
        label: 'Tak Web Game',
        icon: 'casino',
        imageLayout: 'landscape',
        category: 'Fullstack Game & Cloud',
        period: '2024',
        teamRole: 'Solo Developer',
        description:
          'Web implementation of the abstract strategy board game Tak. Includes complete rule validation, path-checking algorithms, and containerized deployment on Google Cloud Run.',
        technologies: ['JavaScript', 'HTML5 Canvas', 'Docker', 'Google Cloud Run'],
        highlights: [
          'Rule engine with road-connection graph validation',
          'Interactive canvas board with piece stacking logic',
          'Containerized deployment on Google Cloud Run',
        ],
        demoUrl: 'https://tak-game-201860504161.us-west1.run.app/',
        githubUrl: 'https://github.com/mboufern/Tak-Game',
        images: [],
        year: '2024',
        status: 'Live',
        statusColor: '#15cea9',
      },
      {
        id: 'django-gallery',
        label: 'Django Art Gallery',
        icon: 'web',
        imageLayout: 'landscape',
        category: 'Web Platform & CMS',
        period: '2024',
        teamRole: 'Fullstack Developer',
        description:
          'Web platform for showcasing artwork collections built with Django and Python. Features artwork taxonomy, image asset management, and user collections.',
        technologies: ['Python', 'Django', 'PostgreSQL', 'HTML5', 'Bootstrap'],
        highlights: [
          'Artwork curation and image hosting workflows',
          'Custom Django ORM models and admin interface',
          'Responsive gallery layouts and collection browsing',
        ],
        githubUrl: 'https://github.com/mboufern/DjangoWebsite',
        images: [],
        year: '2024',
        status: 'Completed',
        statusColor: '#3b82f6',
      },
    ],
  },
  {
    key: 'gamedev',
    route: '/gamedev',
    label: 'Game Development',
    sublabel: 'Unity & Indie',
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
        images: [
          '/assets/wnt/full.gif',
          '/assets/projects/wnt/trailer_1.png',
          '/assets/projects/wnt/alpha_1.png',
        ],
        demoUrl: 'https://store.steampowered.com/app/3868960/Walls_And_Tower_Party',
        year: '2025',
        status: 'Released',
        statusColor: '#ff779c',
      },
      {
        id: 'scrap-vanguard',
        label: 'Scrap Vanguard',
        icon: 'sports_esports',
        imageLayout: 'landscape',
        category: 'Action Survival',
        period: '2024 – 2026',
        teamRole: 'Solo Developer & Artist',
        description:
          'Sci-fi top-down survival action game featuring customizable mech combat rigs, wave survival dynamics, weapon crafting, and stylized post-processing shaders.',
        technologies: ['Unity', 'C#', 'Shader Graph', 'Blender', 'Steamworks'],
        highlights: [
          'Playable Steam demo available',
          'Dynamic wave spawning & modular weapon mechanics',
          'Custom stylized shaders and lighting',
        ],
        images: [
          '/assets/projects/scrap-vanguard/trailer_1.png',
          '/assets/projects/scrap-vanguard/gameplay_1.png',
          '/assets/projects/scrap-vanguard/trailer_2.png',
          '/assets/projects/scrap-vanguard/gameplay_2.png',
        ],
        demoUrl: 'https://store.steampowered.com/app/4743800/Scrap_Vanguard',
        year: '2026',
        status: 'Demo Available',
        statusColor: '#ffb347',
      },
      {
        id: 'under-under',
        label: 'Under Under',
        icon: 'sports_esports',
        imageLayout: 'landscape',
        category: 'Moroccan Game Jam E2',
        period: '2025',
        teamRole: 'Solo Developer & Artist',
        description:
          'Subterranean adventure game created for Moroccan Game Jam E2 (2025). Features atmospheric low-light cave exploration, environmental hazards, and puzzle mechanics.',
        technologies: ['Unity', 'C#', 'Lighting', 'Level Design', 'Blender'],
        highlights: [
          'Created for Moroccan Game Jam E2 (2025)',
          'Atmospheric volumetric lighting and cave aesthetics',
          'Physics-based exploration and environmental puzzles',
        ],
        images: [
          '/assets/projects/under-under/ss1.png',
          '/assets/projects/under-under/ss2.png',
          '/assets/projects/under-under/ss3.png',
        ],
        demoUrl: 'https://marouan-boufer.itch.io/under-under',
        year: '2025',
        status: 'Released',
        statusColor: '#15cea9',
      },
      {
        id: 'cursed-demons',
        label: 'Cursed Demons',
        icon: 'sports_esports',
        imageLayout: 'landscape',
        category: 'Brackeys Game Jam 2020.1',
        period: '2020',
        teamRole: 'Solo Developer & 3D Artist',
        description:
          'Atmospheric 3D game built in 7 days for Brackeys Game Jam 2020.1. Features custom 3D models made in Blender, real-time lighting, interactive dialogue, and physics.',
        technologies: ['Unity', 'C#', 'Blender', 'Physics', 'Dialogue System'],
        highlights: [
          'Developed in one week for Brackeys Game Jam 2020.1',
          'Custom 3D environment and character assets',
          'Real-time lighting and interactive dialogue',
        ],
        images: [
          '/assets/projects/cursed-demons/ss1.png',
          '/assets/projects/cursed-demons/ss2.png',
          '/assets/projects/cursed-demons/ss3.png',
        ],
        demoUrl: 'https://marouan-boufer.itch.io/cursed-demons',
        year: '2020',
        status: 'Released',
        statusColor: '#e11d48',
      },
      {
        id: 'agent-diplegia',
        label: 'Agent Diplegia',
        icon: 'sports_esports',
        imageLayout: 'landscape',
        category: 'GMTK Game Jam 2020',
        period: '2020',
        teamRole: 'Solo Developer',
        description:
          '2D physics game designed in 48 hours for GMTK Game Jam 2020 ("Out of Control"). Focuses on unique movement constraints and challenge levels.',
        technologies: ['Unity', 'C#', '2D Physics', 'Game Design'],
        highlights: [
          'Created in 48 hours for GMTK Game Jam 2020',
          'Constraint-based movement mechanics',
          'Custom 2D physics controller and health system',
        ],
        images: [
          '/assets/projects/agent-diplegia/ss1.png',
          '/assets/projects/agent-diplegia/ss2.png',
          '/assets/projects/agent-diplegia/ss3.png',
        ],
        demoUrl: 'https://marouan-boufer.itch.io/agent-dip',
        year: '2020',
        status: 'Released',
        statusColor: '#8b5cf6',
      },
      {
        id: 'the-paddle',
        label: 'The Paddle',
        icon: 'sports_esports',
        imageLayout: 'landscape',
        category: '2D Arcade',
        period: '2020',
        teamRole: 'Solo Developer',
        description:
          'Classic arcade paddle game built in Unity exploring 2D physics, ball bounce dynamics, collision audio synchronization, and sprite graphics.',
        technologies: ['Unity', 'C#', '2D Physics', 'Audio'],
        highlights: [
          'First Unity exploration into C# game loops and sprite rendering',
          'Bounce physics with dynamic ball acceleration',
          'Audio sound effects synchronized to gameplay events',
        ],
        images: [
          '/assets/projects/the-paddle/ss1.png',
          '/assets/projects/the-paddle/ss2.png',
          '/assets/projects/the-paddle/ss3.png',
        ],
        year: '2020',
        status: 'Completed',
        statusColor: '#06b6d4',
      },
    ],
  },
  {
    key: '3d',
    route: '/3d-art',
    label: '3D Modeling & Animation',
    sublabel: 'Blender & Motion',
    accent: '#a78bfa',
    bg: '#08070d',
    projects: [
      {
        id: '3d-animations-reel',
        label: '3D Mechanical Animation Reel',
        icon: 'landscape',
        imageLayout: 'landscape',
        category: 'Animation Reel & Physics Rigs',
        period: '2024',
        teamRole: 'Solo 3D Artist',
        video: '/assets/projects/3d-art/animations.mp4',
        images: [
          '/assets/projects/3d-art/animations.mp4',
          '/assets/projects/animations-3d/ss1.png',
          '/assets/projects/animations-3d/ss2.png',
          '/assets/projects/animations-3d/ss3.png',
        ],
        description:
          'Showcase reel of mechanical prop animations created in Blender: physics balance scale dynamics, articulated drafting compass, and firearm cylinder mechanics.',
        technologies: ['Blender', 'Keyframe Animation', 'Rigging', 'Physics', 'Lighting'],
        highlights: [
          'Kinematic mechanical rigs for complex multi-part props',
          'Physics-accurate weight balance and damping motion',
          'Turntable camera motion and studio lighting',
        ],
        year: '2024',
        status: 'Showcase Reel',
        statusColor: '#a78bfa',
      },
      {
        id: 'revolver-3d',
        label: 'Original Design Revolver',
        icon: 'landscape',
        imageLayout: 'landscape',
        category: 'Hard Surface Prop Modeling',
        period: '2021',
        teamRole: 'Solo 3D Artist',
        video: '/assets/projects/3d-art/revolver.mp4',
        images: [
          '/assets/projects/3d-art/revolver_1.png',
          '/assets/projects/3d-art/revolver_2.png',
          '/assets/projects/3d-art/revolver.mp4',
        ],
        description:
          'Detailed 10-object hard surface revolver model with clean subdivision topology (793k vertices) and procedural wood and metal materials in Blender.',
        technologies: ['Blender', 'Hard Surface', 'Procedural Texturing', 'UV Unwrapping'],
        highlights: [
          '10 objects: 7,791 base vertices to 793,297 subdivided',
          'Procedural wood and metal material shaders',
          'Functional cylinder rotation and mechanical assembly',
        ],
        year: '2021',
        status: 'Portfolio',
        statusColor: '#a78bfa',
      },
      {
        id: 'compass-3d',
        label: 'Hard Surface Compass',
        icon: 'landscape',
        imageLayout: 'landscape',
        category: 'Precision Instrument Modeling',
        period: '2023',
        teamRole: 'Solo 3D Artist',
        video: '/assets/projects/3d-art/compass.mp4',
        images: [
          '/assets/projects/3d-art/compass_1.png',
          '/assets/projects/3d-art/compass_2.png',
          '/assets/projects/3d-art/compass.mp4',
        ],
        description:
          'Precision hard surface modeling of a drafting compass with knurled adjustment screws, texture-painted displacement wear, and rotational constraint rigging.',
        technologies: ['Blender', 'Hard Surface', 'Texture Painting', 'Constraints', 'Animation'],
        highlights: [
          'Rotational constraint rigging for proportional leg movement',
          'Texture painted displacement maps and bump shading',
          '360-degree turntable studio presentation',
        ],
        year: '2023',
        status: 'Portfolio',
        statusColor: '#8b5cf6',
      },
      {
        id: 'armored-combat-unit',
        label: 'Armored Combat Unit',
        icon: 'landscape',
        imageLayout: 'landscape',
        category: 'Sci-Fi Mech Rigging & Animation',
        period: '2022',
        teamRole: 'Solo 3D Artist',
        images: [
          '/assets/projects/3d-art/mech_unit_1.png',
          '/assets/projects/3d-art/mech_unit_2.png',
        ],
        description:
          'Sci-fi bipedal mech composed of 27 separate objects (78k vertices). Features a 3-bone inverse kinematic (IK) skeletal rig and dual-path movement tracking.',
        technologies: ['Blender', 'Hard Surface', 'Inverse Kinematics', 'Rigging', 'Animation'],
        highlights: [
          '27 objects total: 78,726 vertices and 157,168 triangles',
          '3-bone inverse kinematic (IK) mechanical leg system',
          'Foot path constraints for movement and orientation tracking',
        ],
        year: '2022',
        status: 'Portfolio',
        statusColor: '#ec4899',
      },
      {
        id: 'star-ship',
        label: 'Hexa-Engine Star Ship',
        icon: 'landscape',
        imageLayout: 'landscape',
        category: 'Sci-Fi Vehicle & Shading',
        period: '2022',
        teamRole: 'Solo 3D Artist',
        images: [
          '/assets/projects/3d-art/starship_1.png',
          '/assets/projects/3d-art/starship_2.png',
        ],
        description:
          'Dynamic hexa-engine powered starship with custom bump-mapped surface wear, multi-part shading, and voxel-based volume exhaust flames.',
        technologies: ['Blender', 'Hard Surface', 'Voxel Volumes', 'Emission Shaders'],
        highlights: [
          'Hexa-engine propulsion with volumetric voxel exhaust flames',
          'Bump mapping with multi-color roughness imperfection shading',
          'Emission display shaders with bloom glare',
        ],
        year: '2022',
        status: 'Portfolio',
        statusColor: '#38bdf8',
      },
      {
        id: 'gameboy-3d',
        label: 'Hard Surface Gameboy',
        icon: 'landscape',
        imageLayout: 'landscape',
        category: 'Hard Surface & Studio Lighting',
        period: '2022',
        teamRole: 'Solo 3D Artist',
        images: [
          '/assets/projects/3d-art/gameboy_1.png',
          '/assets/projects/3d-art/gameboy_2.png',
        ],
        description:
          'Hard surface model of a classic handheld console featuring a 3-point studio lighting rig, HDRP reflections, emissive screen shaders, and bloom glare.',
        technologies: ['Blender', 'Hard Surface', 'Studio Lighting', 'HDRP', 'Shading'],
        highlights: [
          '3-light area studio setup: Behind/top, Front/right, Front/left/bottom',
          'HDRP reflections and screen display emission',
          'High fidelity button, d-pad, and cartridge slot modeling',
        ],
        year: '2022',
        status: 'Portfolio',
        statusColor: '#10b981',
      },
      {
        id: 'helmet-eradication',
        label: 'Helmet of The Eradication',
        icon: 'landscape',
        imageLayout: 'landscape',
        category: 'Sci-Fi Armor Sculpting',
        period: '2020',
        teamRole: 'Solo 3D Artist',
        images: [
          '/assets/projects/3d-art/helmet_1.png',
          '/assets/projects/3d-art/helmet_2.png',
        ],
        description:
          'Sculpted sci-fi armored helmet built with 3 objects (8,506 vertices, 16,616 triangles) showcasing clean subdivision edge flow and hard-surface bevels.',
        technologies: ['Blender', 'Subdivision Modeling', 'Topology', 'Hard Surface'],
        highlights: [
          '3 objects total: 8,506 vertices, 16,616 triangles',
          'Clean quad-dominant topology edge flow',
          'Hard surface visor and crest detailing',
        ],
        year: '2020',
        status: 'Portfolio',
        statusColor: '#f97316',
      },
      {
        id: 'maison-du-burger',
        label: 'Maison du Burger Animation',
        icon: 'web',
        imageLayout: 'landscape',
        category: 'Motion Graphics & Branding',
        period: '2026',
        teamRole: 'Motion Designer',
        lottie: '/assets/projects/maison-du-burger/logo.lottie',
        images: [
          '/assets/projects/maison-du-burger/simple_burger.png',
          '/assets/projects/maison-du-burger/logo.jpg',
        ],
        description:
          '2D brand logo animation designed in After Effects for Maison du Burger. Rendered live in the browser using the dotLottie engine.',
        technologies: ['After Effects', 'dotLottie', 'Motion Graphics', 'Branding'],
        highlights: [
          'Live vector Lottie animation running at 60fps',
          'Compact dotLottie format for instant zero-lag playback',
          'Choreographed burger ingredients reveal',
        ],
        year: '2026',
        status: 'Released',
        statusColor: '#f59e0b',
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
