import React, { useRef, useEffect, useCallback } from 'react';
import * as d3 from 'd3';
import { SKILLS, type Skill } from '../data/portfolioData';

interface SkillNode extends d3.SimulationNodeDatum {
  r: number;
  capsW: number;
  label: string;
  blur: number;
  artistic: boolean;
  color: string;
  isDuplicate: boolean;
  image?: HTMLCanvasElement;
}

const FONT_SIZE = 13;
const PAD_X = 18;
const PAD_Y = 10;

function measureCapsule(label: string) {
  const textW = label.length * 6.8;
  const r = FONT_SIZE / 2 + PAD_Y;
  const capsW = textW / 2 + PAD_X;
  return { r, capsW };
}

function createCapsuleImage(n: SkillNode): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const pad = 24;
  canvas.width = (n.capsW + pad) * 2;
  canvas.height = (n.r + pad) * 2;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  ctx.filter = 'blur(5px)';
  ctx.beginPath();
  ctx.roundRect(cx - n.capsW, cy - n.r, n.capsW * 2, n.r * 2, n.r);
  ctx.fillStyle = 'rgba(248,247,252,0.85)';
  ctx.fill();

  ctx.strokeStyle = 'rgba(180,175,200,0.5)';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(cx - n.capsW, cy - n.r, n.capsW * 2, n.r * 2, n.r);

  const strokeGrad = ctx.createLinearGradient(cx - n.capsW, cy - n.r, cx, cy + n.r);
  strokeGrad.addColorStop(0, '#ffffff');
  strokeGrad.addColorStop(0.3, n.color);
  strokeGrad.addColorStop(0.5, 'transparent');
  strokeGrad.addColorStop(1, 'transparent');

  ctx.strokeStyle = strokeGrad;
  ctx.lineWidth = 2.0;
  ctx.shadowColor = n.color;
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = -2;
  ctx.shadowOffsetY = -2;
  ctx.stroke();
  ctx.restore();

  if (n.isDuplicate) {
    ctx.filter = 'blur(7px)';
  } else {
    ctx.filter = 'none';
  }

  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  ctx.font = `${FONT_SIZE}px 'Archivo Black', sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(110,100,155,0.72)';
  ctx.fillText(n.label, cx, cy);

  return canvas;
}

function forceRectCollide() {
  let nodes: SkillNode[];
  function force(alpha: number) {
    for (let i = 0, n = nodes.length; i < n; ++i) {
      const a = nodes[i];
      for (let j = i + 1; j < n; ++j) {
        const b = nodes[j];
        const dx = (a.x! + a.vx!) - (b.x! + b.vx!);
        const dy = (a.y! + a.vy!) - (b.y! + b.vy!);
        const minX = a.capsW + b.capsW + 30;
        const minY = a.r + b.r + 30;

        if (Math.abs(dx) < minX && Math.abs(dy) < minY) {
          const px = minX - Math.abs(dx);
          const py = minY - Math.abs(dy);
          if (px < py) {
            const shift = px * (Math.sign(dx) || 1) * alpha * 0.5;
            a.vx! += shift; b.vx! -= shift;
            a.x! += shift; b.x! -= shift;
          } else {
            const shift = py * (Math.sign(dy) || 1) * alpha * 0.5;
            a.vy! += shift; b.vy! -= shift;
            a.y! += shift; b.y! -= shift;
          }
        }
      }
    }
  }
  force.initialize = (_: SkillNode[]) => { nodes = _; };
  return force;
}

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

interface SkillCanvasProps {
  triggerWave: number;
}

export const SkillCanvas: React.FC<SkillCanvasProps> = ({ triggerWave }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const simRef = useRef<d3.Simulation<SkillNode, undefined> | null>(null);
  const nodesRef = useRef<SkillNode[]>([]);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const rafRef = useRef<number>(0);
  const waveRef = useRef<{ t: number } | null>(null);

  const buildNodes = useCallback((W: number, H: number): SkillNode[] => {
    const arr: SkillNode[] = [];
    const colors = ['#2bbece', '#ff779c', '#a78bfa', '#15cea9'];
    const shuffled = shuffle<Skill>(SKILLS);
    const allSkills = [...shuffled, ...shuffle<Skill>(SKILLS)];

    allSkills.forEach((s, i) => {
      const isDuplicate = i >= shuffled.length;
      const { capsW } = measureCapsule(s.label);
      const node: SkillNode = {
        x: (Math.random() - 0.5) * W * 0.9,
        y: (Math.random() - 0.5) * H * 0.9,
        r: s.r,
        capsW,
        label: s.label,
        blur: s.blur,
        artistic: s.artistic,
        color: colors[i % colors.length],
        isDuplicate,
      };
      node.image = createCapsuleImage(node);
      arr.push(node);
    });
    return arr;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx2d = canvas.getContext('2d');
    if (!ctx2d) return;

    const setup = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const W = canvas.width;
      const H = canvas.height;

      const nodes = buildNodes(W, H);
      nodesRef.current = nodes;

      simRef.current?.stop();

      simRef.current = d3.forceSimulation<SkillNode>(nodes)
        .alphaTarget(0.15)
        .velocityDecay(0.4)
        .force('x', d3.forceX(0).strength(0.005))
        .force('y', d3.forceY(0).strength(0.005))
        .force('collide', forceRectCollide())
        .force('charge', d3.forceManyBody<SkillNode>().strength(-25))
        .on('tick', () => {});
    };

    setup();
    const ro = new ResizeObserver(setup);
    ro.observe(canvas);

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left - canvas.width / 2;
      const my = e.clientY - rect.top - canvas.height / 2;
      mouseRef.current = { x: mx, y: my };
    };

    const onLeave = () => {
      mouseRef.current = null;
    };

    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      const nodes = nodesRef.current;
      const sim = simRef.current;
      const mouse = mouseRef.current;

      if (mouse && sim) {
        for (const n of nodes) {
          const dx = (n.x ?? 0) - mouse.x;
          const dy = (n.y ?? 0) - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const influence = 180;
          if (dist < influence) {
            const strength = (1 - dist / influence) * 0.7;
            n.vx = (n.vx ?? 0) + (dx / dist) * strength;
            n.vy = (n.vy ?? 0) + (dy / dist) * strength;
          }
        }
      }

      ctx2d.clearRect(0, 0, W, H);
      ctx2d.save();
      ctx2d.translate(W / 2, H / 2);

      if (waveRef.current) {
        const elapsed = Date.now() - waveRef.current.t;
        const maxR = Math.max(W, H) * 0.75;
        const progress = Math.min(elapsed / 900, 1);
        if (progress < 1) {
          const drawRing = (lag: number, baseAlpha: number, lw: number) => {
            const p = Math.max(0, progress - lag);
            if (p <= 0) return;
            ctx2d.beginPath();
            ctx2d.arc(0, 0, p * maxR, 0, Math.PI * 2);
            ctx2d.strokeStyle = `rgba(180,178,210,${(1 - progress) * baseAlpha})`;
            ctx2d.lineWidth = lw;
            ctx2d.stroke();
          };
          drawRing(0, 0.2, 2.5);
          drawRing(0.12, 0.13, 1.5);
        } else {
          waveRef.current = null;
        }
      }

      for (const n of nodes) {
        if (!n.image) continue;
        const nx = n.x ?? 0;
        const ny = n.y ?? 0;
        const pad = 24;
        ctx2d.drawImage(n.image, nx - n.capsW - pad, ny - n.r - pad);
      }

      ctx2d.restore();
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      simRef.current?.stop();
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, [buildNodes]);

  useEffect(() => {
    if (triggerWave === 0) return;
    waveRef.current = { t: Date.now() };
  }, [triggerWave]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      style={{ zIndex: 0 }}
    />
  );
};
