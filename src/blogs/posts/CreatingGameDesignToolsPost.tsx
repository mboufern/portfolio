import React from 'react';
import {
  ArticleLead,
  ArticleParagraph,
  ArticleSectionHeading,
  ArticleQuote,
  ArticleMediaPlaceholder,
} from '../components/ArticlePrimitives';

export const CreatingGameDesignToolsPost: React.FC = () => {
  return (
    <div className="space-y-6">
      <ArticleLead>
        Every game mechanic feels brilliant while it is still living in your head. You
        sketch a few boxes in a notebook, picture the player clicking around with a big
        smile, and think, &ldquo;Yeah, this is going to be awesome.&rdquo; Then you open
        your game engine, spend three days writing scripts and wiring up UI, hit Play,
        and realize the whole thing feels weirdly awkward.
      </ArticleLead>

      <ArticleParagraph>
        That gap between a cool idea and how it actually feels in your hands is one of
        the biggest struggles in game design. A mechanic can sound crystal clear in a
        design doc and still fall apart the second you try to play with it. You do not
        really know if something works until you can click it, drag it, and break it.
      </ArticleParagraph>

      <ArticleSectionHeading>1. The Prototyping Struggle</ArticleSectionHeading>

      <ArticleParagraph>
        The tricky part is getting that early feel without burning a whole week on
        engine setup. Jumping straight into a game engine like Unity is great when you
        already know what you are building. When you are still figuring out the rules,
        though, every tiny experiment comes with a tax: prefabs, layouts, canvas
        settings, input hooks, and compile times.
      </ArticleParagraph>

      <ArticleParagraph>
        Before you know it, you are spending more energy fighting your UI setup than
        testing the actual idea. Worse, once you invest days into building a feature
        inside your game, it gets really hard to throw it away or change it when it
        does not feel right.
      </ArticleParagraph>

      <ArticleSectionHeading>2. My Web Dev Shortcut</ArticleSectionHeading>

      <ArticleParagraph>
        Because I come from a web development background, my instinct has always been to
        prototype mechanics and UI screens in the browser first. On the web, it is fast
        to throw boxes, buttons, and grids onto a page just to see how they look and
        feel in motion. You can tweak a layout or change a rule in seconds and test it
        right away.
      </ArticleParagraph>

      <ArticleParagraph>
        Still, even on the web, coding a throwaway prototype from scratch takes time I
        would rather spend on the real game. So across several of my recent games, I
        started using a much faster trick: letting AI build those interactive web
        prototypes for me. Instead of writing all the boilerplate myself, I describe the
        mechanic I want to test, get a working web tool in minutes, and jump straight
        into playing with it.
      </ArticleParagraph>

      <ArticleSectionHeading>3. The Merge Grid in Scrap Vanguard</ArticleSectionHeading>

      <ArticleParagraph>
        A great example of this is the <strong>Merge Grid</strong> from my game{' '}
        <em>Scrap Vanguard</em>. On paper, the idea sounded super simple. You have{' '}
        <strong>4 different types of materials</strong> and a <strong>grid</strong>{' '}
        where you can drag and drop them around. When you merge{' '}
        <strong>3 level 1 materials of the same type</strong>, they combine into a brand
        new <strong>level 2 material</strong> of that same type.
      </ArticleParagraph>

      <ArticleParagraph>
        Easy enough, right? I could have opened Unity right away and started coding.
        Instead, I opened <strong>Google AI Studio</strong>, described the grid and the
        merging idea in plain English, and asked it to build a fully working{' '}
        <strong>React</strong> web page where I could drag materials around and test it
        myself.
      </ArticleParagraph>

      {/* Replace with <ArticleFigure src="/assets/..." alt="..." caption="..." /> or a <video> once ready */}
      <ArticleMediaPlaceholder
        label="React Merge Grid Prototype (Google AI Studio)"
        description="Drop a screenshot or short video clip here showing the interactive React prototype built in Google AI Studio."
        mediaType="image or video"
        accent="#2bbece"
      />

      <ArticleParagraph>
        The moment I started dragging tiles across that React page, the &ldquo;simple&rdquo;
        mechanic started asking me very real questions I had not even thought about yet.
        All the little loopholes jumped straight out of the screen:
      </ArticleParagraph>

      <ul className="list-disc pl-6 space-y-2.5 text-zinc-700 text-base sm:text-[17px] leading-[1.8]">
        <li>
          <strong>Different material types:</strong> What happens if you drag a material
          and drop it right on top of a completely different one? Should they swap
          spots, bounce back, or block the drop?
        </li>
        <li>
          <strong>Different levels:</strong> What if the two materials are the same
          type, but one is level 1 and the other is level 2? Suddenly &ldquo;same
          type&rdquo; was not a specific enough rule.
        </li>
        <li>
          <strong>Merging six at once:</strong> What happens when a player lines up six
          matching materials in one move? Should it create two level 2 materials at
          once, or only consume three and leave the rest sitting there?
        </li>
      </ul>

      <ArticleParagraph>
        None of those questions showed up when the mechanic was just two sentences in my
        head. They only showed up because I had a real toy in front of me that I could
        poke and try to break. Every time I found a weird case, I told the AI how I
        wanted it to behave, tested the updated React page a minute later, and tried to
        break it again.
      </ArticleParagraph>

      <ArticleSectionHeading>4. From Playground to Unity</ArticleSectionHeading>

      <ArticleParagraph>
        I went through several quick rounds of tweaking and testing until dragging,
        swapping, and merging felt snappy and natural. Then came my favorite part of the
        whole workflow. Once I was happy with the React prototype, I asked the exact
        same AI to read what we had built and give me a clean list of every single rule
        the grid mechanic followed.
      </ArticleParagraph>

      <ArticleQuote accent="#2bbece">
        Figure out the rules while the prototype is cheap to break. By the time you open
        your game engine, there should be no guessing left.
      </ArticleQuote>

      <ArticleParagraph>
        With that rule list sitting right next to me, building the real Merge Grid UI in{' '}
        <strong>Unity</strong> was genuinely easy and straightforward. There were no
        surprise edge cases halfway through coding, no panicked redesigns, and no wasted
        days wondering what should happen when a player drops the wrong tile in the
        wrong slot. Every answer was already tested and locked in.
      </ArticleParagraph>

      {/* Replace with <ArticleFigure src="/assets/..." alt="..." caption="..." /> or a <video> once ready */}
      <ArticleMediaPlaceholder
        label="Final Merge Grid Inside Unity (Scrap Vanguard)"
        description="Drop a screenshot or short video clip here showing the finished Merge Grid UI running in Scrap Vanguard."
        mediaType="image or video"
        accent="#2bbece"
      />

      <ArticleSectionHeading>5. Build the Toy First</ArticleSectionHeading>

      <ArticleParagraph>
        When people hear &ldquo;create your own game design tools,&rdquo; they often
        imagine spending weeks building giant custom editors. Sometimes, though, the
        most useful tool you can make is a tiny, throwaway web page you spin up with AI
        in ten minutes.
      </ArticleParagraph>

      <ArticleParagraph>
        It lets you feel your mechanic early, catch all the sneaky loopholes while
        changes are still free, and walk into your game engine with a clear set of
        rules. Build the small toy first, break it until it feels right, and then build
        the real thing with confidence.
      </ArticleParagraph>
    </div>
  );
};
