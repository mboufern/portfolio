import React from 'react';
import {
  SiReact,
  SiTypescript,
  SiJavascript,
  SiVite,
  SiTailwindcss,
  SiReactrouter,
  SiFramer,
  SiSpringboot,
  SiDotnet,
  SiPostgresql,
  SiDocker,
  SiTerraform,
  SiPhp,
  SiLaravel,
  SiVuedotjs,
  SiMysql,
  SiRedis,
  SiStripe,
  SiUnity,
  SiFirebase,
  SiAndroid,
  SiApple,
  SiBlender,
  SiPython,
  SiFigma,
  SiGodotengine,
  SiGithubactions,
  SiGitlab,
  SiLinear,
  SiJira,
  SiNotion,
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa6';
import { TbBrandCSharp, TbCode, TbCube, TbPalette, TbVector } from 'react-icons/tb';

interface TechIconProps {
  name: string;
  className?: string;
  style?: React.CSSProperties;
}

export const TechIcon: React.FC<TechIconProps> = ({ name, className = 'w-3.5 h-3.5', style }) => {
  const norm = name.trim().toLowerCase();

  switch (norm) {
    case 'react':
      return <SiReact className={className} style={style} />;
    case 'typescript':
      return <SiTypescript className={className} style={style} />;
    case 'javascript':
      return <SiJavascript className={className} style={style} />;
    case 'vite':
      return <SiVite className={className} style={style} />;
    case 'tailwind css':
    case 'tailwind':
      return <SiTailwindcss className={className} style={style} />;
    case 'react router':
      return <SiReactrouter className={className} style={style} />;
    case 'framer motion':
    case 'framer':
      return <SiFramer className={className} style={style} />;
    case 'java':
      return <FaJava className={className} style={style} />;
    case 'spring boot':
    case 'spring':
      return <SiSpringboot className={className} style={style} />;
    case '.net':
    case 'dotnet':
      return <SiDotnet className={className} style={style} />;
    case 'postgresql':
      return <SiPostgresql className={className} style={style} />;
    case 'docker':
      return <SiDocker className={className} style={style} />;
    case 'terraform':
      return <SiTerraform className={className} style={style} />;
    case 'php':
      return <SiPhp className={className} style={style} />;
    case 'laravel':
      return <SiLaravel className={className} style={style} />;
    case 'vue':
      return <SiVuedotjs className={className} style={style} />;
    case 'mysql':
      return <SiMysql className={className} style={style} />;
    case 'redis':
      return <SiRedis className={className} style={style} />;
    case 'stripe':
      return <SiStripe className={className} style={style} />;
    case 'unity':
    case 'netcode for gameobjects':
      return <SiUnity className={className} style={style} />;
    case 'c#':
    case 'csharp':
      return <TbBrandCSharp className={className} style={style} />;
    case 'firebase':
      return <SiFirebase className={className} style={style} />;
    case 'android':
      return <SiAndroid className={className} style={style} />;
    case 'ios':
      return <SiApple className={className} style={style} />;
    case 'blender':
      return <SiBlender className={className} style={style} />;
    case 'python':
      return <SiPython className={className} style={style} />;
    case 'figma':
      return <SiFigma className={className} style={style} />;
    case 'godot':
      return <SiGodotengine className={className} style={style} />;
    case 'github actions':
      return <SiGithubactions className={className} style={style} />;
    case 'gitlab':
      return <SiGitlab className={className} style={style} />;
    case 'linear':
      return <SiLinear className={className} style={style} />;
    case 'jira':
      return <SiJira className={className} style={style} />;
    case 'notion':
      return <SiNotion className={className} style={style} />;
    case 'adobe illustrator':
    case 'illustrator':
      return <TbVector className={className} style={style} />;
    case '3d':
    case 'rigging':
    case 'animation':
      return <TbCube className={className} style={style} />;
    case 'texturing':
    case 'ui/ux':
      return <TbPalette className={className} style={style} />;
    default:
      return <TbCode className={className} style={style} />;
  }
};
