import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, useScroll } from "framer-motion";
import { NationBathtub } from "@/components/nation/story/NationBathtub";
import { NationConclusion } from "@/components/nation/story/NationConclusion";
import { NationEmissionsJourney } from "@/components/nation/story/NationEmissionsJourney";
import { NationIntroPunch } from "@/components/nation/story/NationIntroPunch";
import { NationStackedChart } from "@/components/nation/story/NationStackedChart";
import { StoryScrollHint } from "@/components/nation/story/StoryScrollHint";
import {
  NATION_STORY_TEXT,
  NATION_STORY_TYPE,
} from "@/components/nation/story/nationStoryColors";
import type { NationStoryDetails } from "@/hooks/nation/useNationStoryDetails";
import type { NationStoryMetrics } from "@/utils/data/nationStoryMetrics";

type NationStoryPageProps = {
  nation: NationStoryDetails;
  metrics: NationStoryMetrics;
};

/** Thin reading-progress bar just below the fixed site header. */
function StoryProgressBar() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      aria-hidden
      className="fixed top-12 left-0 right-0 z-40 h-0.5 origin-left bg-gradient-to-r from-orange-3 to-pink-3"
      style={{ scaleX: scrollYProgress }}
    />
  );
}

function FullScreenSection({ children }: { children: React.ReactNode }) {
  return (
    <section
      data-story-section
      className="relative min-h-[70vh] md:min-h-[80vh] flex items-center justify-center px-4 md:px-8 py-8 md:py-10"
    >
      <div className="w-full max-w-4xl mx-auto">{children}</div>
    </section>
  );
}

export function NationStoryPage({
  nation: _nation,
  metrics,
}: NationStoryPageProps) {
  const { t } = useTranslation();
  const conclusionRef = useRef<HTMLElement>(null);

  return (
    <div className="bg-black text-white pb-16 md:pb-24">
      <StoryProgressBar />

      {/* Intro hero – exactly one viewport: eyebrow, headline, lede, silhouette */}
      <section
        data-story-section
        className="relative min-h-[100svh] md:h-[100svh] flex flex-col items-center justify-center px-4 md:px-8 pt-8 md:pt-10 pb-16 md:pb-20 overflow-hidden"
      >
        {/* Subtle depth behind the hero, using existing surface colors only */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_38%,var(--black-2)_0%,var(--black-3)_78%)]"
        />
        <div className="relative max-w-5xl mx-auto text-center space-y-4 md:space-y-6">
          <p
            className={`${NATION_STORY_TYPE.eyebrow} ${NATION_STORY_TEXT.eyebrow}`}
          >
            {t("nation.story.intro.eyebrow")}
          </p>
          <h1 className="text-4xl md:text-6xl font-light tracking-tight text-white">
            {t("nation.story.intro.title")}
          </h1>
          <p
            className={`${NATION_STORY_TYPE.body} ${NATION_STORY_TEXT.body} max-w-2xl mx-auto`}
          >
            {t("nation.story.intro.paragraph1")}
          </p>
          <NationIntroPunch metrics={metrics} />
        </div>
      </section>

      {/* Short transition: the explanation that follows the hero's punch */}
      <section
        data-story-section
        className="relative min-h-[50vh] md:min-h-[60vh] flex items-center justify-center px-4 md:px-8 py-12 md:py-16"
      >
        <div className="max-w-2xl mx-auto text-center space-y-5 md:space-y-6">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            className={`${NATION_STORY_TYPE.body} ${NATION_STORY_TEXT.body}`}
          >
            {t("nation.story.intro.paragraph2")}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`${NATION_STORY_TYPE.emphasis} text-white`}
          >
            {t("nation.story.intro.paragraph3")}
          </motion.p>
        </div>
      </section>

      {/* Scroll-driven journey: bubble builds up layer by layer */}
      <NationEmissionsJourney metrics={metrics} />

      {/* Bathtub metaphor – water rises with each year's emissions */}
      <NationBathtub data={metrics.bathtubData} />

      {/* Mid-story conclusion before the stacked historic chart */}
      <FullScreenSection>
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.4 }}
            className={`${NATION_STORY_TYPE.eyebrow} ${NATION_STORY_TEXT.eyebrow}`}
          >
            {t("nation.story.interlude.eyebrow")}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className={`${NATION_STORY_TYPE.title} leading-tight`}
          >
            {t("nation.story.interlude.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className={`${NATION_STORY_TYPE.body} ${NATION_STORY_TEXT.body}`}
          >
            {t("nation.story.interlude.body")}
          </motion.p>
        </div>
      </FullScreenSection>

      {/* Historic emissions: pinned, layers reveal on scroll */}
      <NationStackedChart data={metrics.stackData} />

      {/* Conclusion – the punchline tying the journey together */}
      <section
        ref={conclusionRef}
        data-story-section
        className="relative min-h-[80vh] flex items-center justify-center px-4 md:px-8 py-10 overflow-hidden"
      >
        {/* Same depth backdrop as the hero – the story ends where it began */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_45%,var(--black-2)_0%,var(--black-3)_78%)]"
        />
        <div className="relative w-full max-w-4xl mx-auto">
          <NationConclusion metrics={metrics} />
        </div>
      </section>

      <StoryScrollHint endRef={conclusionRef} />
    </div>
  );
}
