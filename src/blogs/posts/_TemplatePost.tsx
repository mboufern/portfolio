import React from 'react';

/**
 * Template for creating a new custom TSX blog post:
 * 1. Duplicate this file into src/blogs/posts/<YourPost>.tsx
 * 2. Author interactive JSX inside the exported React component
 * 3. Register metadata + component inside src/blogs/registry.ts
 */
export const TemplatePost: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-zinc-200/80 shadow-sm space-y-4">
        <h2
          className="text-zinc-900 text-xl sm:text-2xl font-black m-0"
          style={{ fontFamily: 'Archivo Black, sans-serif' }}
        >
          Why Custom TSX Posts
        </h2>
        <p className="text-zinc-700 text-base leading-relaxed m-0">
          Every post on this site is authored directly as a React TypeScript component. That means articles can embed live visual demos, shader breakdowns, comparison sliders, and project news while preserving consistent typography and layout.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-sm">
          <div className="text-xs font-mono tracking-wider text-[#2bbece] font-bold mb-2">
            Architecture
          </div>
          <p className="text-zinc-600 text-sm leading-relaxed m-0">
            Decoupled weapon rigs, ScriptableObject configuration tables, and clean C# state machines keep gameplay experimentation fast.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-sm">
          <div className="text-xs font-mono tracking-wider text-[#15cea9] font-bold mb-2">
            What Comes Next
          </div>
          <p className="text-zinc-600 text-sm leading-relaxed m-0">
            Expect regular notes covering Moraja3ati engineering lessons, Walls & Tower Party networking, and upcoming Scrap Vanguard builds.
          </p>
        </div>
      </div>
    </div>
  );
};
