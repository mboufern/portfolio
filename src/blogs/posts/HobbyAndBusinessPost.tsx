import React from 'react';
import {
  ArticleLead,
  ArticleParagraph,
  ArticleSectionHeading,
  ArticleQuote,
} from '../components/ArticlePrimitives';

export const HobbyAndBusinessPost: React.FC = () => {
  return (
    <div className="space-y-6">
      <ArticleLead>
        One of the coolest things about indie game development today is that a single
        person can do everything. You can write the code, build the art, compose the
        sound effects, market the game on social media, and press the publish button on
        Steam all by yourself. We have seen it work, and we have seen it change lives.
      </ArticleLead>

      <ArticleParagraph>
        Yet behind every solo success story sits a quieter reality that rarely makes it
        into interviews. When you are the artist, the programmer, and the publisher all
        at once, you end up fighting a small war inside your own head every single day.
      </ArticleParagraph>

      <ArticleSectionHeading>1. Yes, One Person Can Do It All</ArticleSectionHeading>

      <ArticleParagraph>
        Let us be clear first: wearing every hat is completely possible. Look at Eric
        Barone (ConcernedApe) building <em>Stardew Valley</em> solo, Toby Fox crafting{' '}
        <em>Undertale</em>, or Lucas Pope shipping <em>Papers, Please</em> and{' '}
        <em>Return of the Obra Dinn</em> on his own. Even recent hits like{' '}
        <em>Balatro</em> by LocalThunk prove that one developer with a clear vision can
        handle both making the game and getting it into millions of players&apos; hands.
      </ArticleParagraph>

      <ArticleParagraph>
        Stories like those are inspiring because they show there is no gatekeeper
        stopping you. If you are willing to learn a bit of marketing, figure out store
        pages, and talk to players, you do not strictly need a big studio or a publisher
        to ship something special.
      </ArticleParagraph>

      <ArticleSectionHeading>2. The Daily Tug of War</ArticleSectionHeading>

      <ArticleParagraph>
        The hidden catch is what happens when the &ldquo;business&rdquo; version of you
        starts sitting at the same desk as the &ldquo;game creator&rdquo; version of
        you. In the morning, you want to spend three days polishing a combat animation or
        adding a weird secret room just because it makes the world feel alive. By the
        afternoon, the business voice in your head is checking the calendar, worrying
        about launch dates, Steam Next Fest deadlines, and whether that secret room
        will actually sell a single extra copy.
      </ArticleParagraph>

      <ArticleParagraph>
        That constant mental tug of war is exhausting. Every creative choice suddenly
        gets weighed against time, money, and marketing pressure. Instead of asking,
        &ldquo;Is this fun?&rdquo;, you catch yourself asking, &ldquo;Is this worth the
        hours before release?&rdquo;
      </ArticleParagraph>

      <ArticleSectionHeading>3. Do Not Normalize Cutting Corners</ArticleSectionHeading>

      <ArticleParagraph>
        I have fallen into that trap more times than I would like to admit. There were
        moments where I cut corners on features, trimmed down ideas, or left out parts of
        a game just to get it delivered on time, knowing full well that what I was
        removing actually mattered.
      </ArticleParagraph>

      <ArticleParagraph>
        A lot of people in the industry treat that as completely normal. You will hear
        advice like &ldquo;scope down, cut features, just ship the game.&rdquo; And
        sure, in some cases, trimming bloated ideas is smart and necessary. What bothers
        me is how quickly we normalize sacrificing real parts of a game just to hit a
        date.
      </ArticleParagraph>

      <ArticleQuote accent="#ff779c">
        Cutting scope to stay focused is healthy. Cutting corners until the soul and
        quality of the game start leaking out is not.
      </ArticleQuote>

      <ArticleParagraph>
        Once you get comfortable saying &ldquo;good enough, ship it,&rdquo; the line
        keeps moving. First you drop a nice bonus feature. Next you rush a level or
        leave a mechanic half-baked. Before you notice, it is not just extra polish you
        are trading away; the core quality of the game itself is at risk.
      </ArticleParagraph>

      <ArticleSectionHeading>4. Separating the Maker From the Seller</ArticleSectionHeading>

      <ArticleParagraph>
        The more games I work on, the more I believe that the healthiest setup is having
        a clear wall between the people who build the game and the people who publish
        it. Ideally, they are completely different people or separate departments.
      </ArticleParagraph>

      <ArticleParagraph>
        When one person or team owns the creative direction and another owns marketing,
        deadlines, and sales, both sides can actually do their job properly. The
        developer can fight for gameplay feel, weird experiments, and player experience
        without panicking about ad copy or launch spreadsheets. Meanwhile, the
        publishing side can push back with realistic schedules and business context from
        the outside, rather than letting that stress quietly rot your creative decisions
        from the inside.
      </ArticleParagraph>

      <ArticleSectionHeading>5. Protecting the Joy of Making Games</ArticleSectionHeading>

      <ArticleParagraph>
        Of course, not every solo developer has the budget to hire a marketing team or
        partner with a publisher right away. If you have to wear both hats for now, at
        least be aware of which hat you are wearing at any given moment. Give yourself
        space to design like a player who loves games, not just like a manager trying
        to clear a checklist.
      </ArticleParagraph>

      <ArticleParagraph>
        Making games as a business is great, and shipping matters. Just never let the
        rush to deliver convince you that sacrificing quality is just part of the job.
      </ArticleParagraph>
    </div>
  );
};
