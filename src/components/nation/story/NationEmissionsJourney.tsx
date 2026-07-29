import { useTranslation } from "react-i18next";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  formatMton,
  type NationStoryMetrics,
} from "@/utils/data/nationStoryMetrics";
import { useLanguage } from "@/components/LanguageProvider";
import { useScreenSize } from "@/hooks/useScreenSize";
import {
  NATION_STORY_COLORS,
  NATION_STORY_TEXT,
  NATION_STORY_TYPE,
} from "@/components/nation/story/nationStoryColors";
import { usePinnedSteps } from "@/components/nation/story/usePinnedSteps";

type JourneyStep = {
  key: string;
  labelKey: string;
  textKey: string;
  color: string;
  /** cumulative total in Mton after this step */
  total: number;
  /** this step's own contribution in Mton */
  delta: number;
  /** drawn as an added colored circle layer (vs a thin ring for tiny additions) */
  layer: boolean;
  /** small extra addition drawn as a dashed ring (private e-commerce) */
  ring?: boolean;
};

/** Desktop onion diameter; mobile scales down so text + bubble fit one screen. */
const DESKTOP_MAX_DIAMETER = 300;
const MOBILE_MAX_DIAMETER = 148;
/** Scroll distance per journey step – higher = more time to watch each layer grow. */
const JOURNEY_STEP_VH = 115;
/** Gentle spring so each new onion layer visibly expands. */
const LAYER_GROW_TRANSITION = {
  type: "spring" as const,
  stiffness: 48,
  damping: 16,
  mass: 1.6,
};

function buildSteps(metrics: NationStoryMetrics): JourneyStep[] {
  const territorial = metrics.territorialLatestMton;
  const production = metrics.productionLatestMton;
  const consumption = metrics.consumptionLatestMton;
  const biogenic = metrics.biogenicLatestMton;

  return [
    {
      key: "step1",
      labelKey: "nation.story.journey.step1.label",
      textKey: "nation.story.journey.step1.text",
      color: NATION_STORY_COLORS.territorial,
      total: territorial,
      delta: territorial,
      layer: true,
    },
    {
      key: "step2",
      labelKey: "nation.story.journey.step2.label",
      textKey: "nation.story.journey.step2.text",
      color: NATION_STORY_COLORS.production,
      total: production,
      delta: production - territorial,
      layer: true,
    },
    {
      key: "step3",
      labelKey: "nation.story.journey.step3.label",
      textKey: "nation.story.journey.step3.text",
      color: NATION_STORY_COLORS.consumption,
      total: production + consumption,
      delta: consumption,
      layer: true,
    },
    {
      key: "step4",
      labelKey: "nation.story.journey.step4.label",
      textKey: "nation.story.journey.step4.text",
      color: NATION_STORY_COLORS.eCommerceRing,
      total: production + consumption,
      delta: 0,
      layer: false,
      ring: true,
    },
    {
      key: "step5",
      labelKey: "nation.story.journey.step5.label",
      textKey: "nation.story.journey.step5.text",
      color: NATION_STORY_COLORS.biogenic,
      total: production + consumption + biogenic,
      delta: biogenic,
      layer: true,
    },
  ];
}

type NationEmissionsJourneyProps = {
  metrics: NationStoryMetrics;
};

export function NationEmissionsJourney({
  metrics,
}: NationEmissionsJourneyProps) {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const { isMobile } = useScreenSize();
  const reducedMotion = useReducedMotion();

  const steps = buildSteps(metrics);
  const maxTotal = steps[steps.length - 1].total;
  const maxDiameter = isMobile ? MOBILE_MAX_DIAMETER : DESKTOP_MAX_DIAMETER;

  const { ref, step, sectionVh, stageStyle } = usePinnedSteps(
    steps.length,
    JOURNEY_STEP_VH,
  );

  const current = steps[step];
  const newestLayerKey = steps
    .slice(0, step + 1)
    .filter((s) => s.layer)
    .at(-1)?.key;

  // All layer-circles revealed so far, largest drawn first (behind) so each
  // colour shows as a ring around the previous – i.e. the types stacked up.
  const revealedLayers = steps
    .slice(0, step + 1)
    .filter((s) => s.layer)
    .sort((a, b) => b.total - a.total);

  const showRing = steps.slice(0, step + 1).some((s) => s.ring);
  const ringStep = steps.find((s) => s.ring);
  const ringTotal = ringStep?.total ?? current.total;

  const diameterFor = (total: number) =>
    Math.sqrt(total / maxTotal) * maxDiameter;

  // Distance from the bubble center to just outside the current circle's
  // edge along the 45° upper-right diagonal.
  const deltaChipOffset =
    diameterFor(current.total) / 2 / Math.SQRT2 + (isMobile ? 8 : 12);

  return (
    <section
      ref={ref}
      data-story-section
      data-story-step={step}
      data-story-steps={steps.length}
      data-story-step-vh={JOURNEY_STEP_VH}
      className="relative"
      style={{ height: `${sectionVh}vh` }}
    >
      <div
        className="h-[100svh] flex items-center px-4 md:px-8 py-3 md:py-0 overflow-hidden"
        style={stageStyle}
      >
        {/* Same subtle depth backdrop as the hero, tying the chapter to the intro */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_45%,var(--black-2)_0%,var(--black-3)_78%)]"
        />
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12 items-center w-full max-w-5xl mx-auto">
          {/* Bubble = accumulating colored layers */}
          <div className="flex flex-col items-center gap-2 md:gap-4 order-1">
            <div
              className="relative"
              style={{ width: maxDiameter, height: maxDiameter }}
            >
              {/* Soft glow behind the bubble in the current step's color */}
              <AnimatePresence>
                <motion.div
                  key={`glow-${current.color}`}
                  aria-hidden
                  className="absolute left-1/2 top-1/2 rounded-full blur-3xl"
                  style={{
                    width: maxDiameter * 1.3,
                    height: maxDiameter * 1.3,
                    x: "-50%",
                    y: "-50%",
                    backgroundColor: current.color,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.18 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reducedMotion ? 0 : 0.8 }}
                />
              </AnimatePresence>

              {revealedLayers.map((layer) => {
                const d = diameterFor(layer.total);
                const isGrowingLayer = layer.key === newestLayerKey;
                return (
                  <motion.div
                    key={layer.key}
                    className="absolute left-1/2 top-1/2 rounded-full"
                    style={{ backgroundColor: layer.color, opacity: 1 }}
                    initial={
                      isGrowingLayer && !reducedMotion
                        ? { width: 0, height: 0, x: "-50%", y: "-50%" }
                        : { width: d, height: d, x: "-50%", y: "-50%" }
                    }
                    animate={{ width: d, height: d, x: "-50%", y: "-50%" }}
                    transition={
                      isGrowingLayer && !reducedMotion
                        ? LAYER_GROW_TRANSITION
                        : { duration: 0 }
                    }
                  />
                );
              })}

              {/* Private e-commerce: thin dashed ring around the current total */}
              {showRing && ringStep && (
                <motion.span
                  className="absolute left-1/2 top-1/2 rounded-full border-2 border-dashed"
                  style={{
                    width: diameterFor(ringTotal) + (isMobile ? 16 : 26),
                    height: diameterFor(ringTotal) + (isMobile ? 16 : 26),
                    x: "-50%",
                    y: "-50%",
                    borderColor: NATION_STORY_COLORS.eCommerceRing,
                  }}
                  initial={reducedMotion ? false : { opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={
                    reducedMotion
                      ? { duration: 0 }
                      : { duration: 0.9, ease: [0.22, 1, 0.36, 1] }
                  }
                />
              )}

              {/* Running total on top */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className={`${NATION_STORY_TYPE.stat} text-black font-medium select-none leading-none text-center`}
                >
                  {formatMton(current.total, currentLanguage, 0)}
                  <span
                    className={`block ${NATION_STORY_TYPE.meta} font-medium mt-0.5 md:mt-1`}
                  >
                    {t("nation.story.unit.mton")}
                  </span>
                </span>
              </div>

              {/* The step's own contribution sits just off the current circle's
                  upper-right edge, riding outward with the same spring as the
                  growing layer so it follows the circle smoothly. */}
              {step > 0 && current.delta > 0 && (
                <motion.span
                  className="absolute left-1/2 top-1/2 pointer-events-none"
                  initial={false}
                  animate={{ x: deltaChipOffset, y: -deltaChipOffset }}
                  transition={
                    reducedMotion ? { duration: 0 } : LAYER_GROW_TRANSITION
                  }
                >
                  <span className="block -translate-y-full">
                    <motion.p
                      key={`delta-${current.key}`}
                      initial={
                        reducedMotion
                          ? false
                          : { opacity: 0, y: 8, scale: 0.92 }
                      }
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.45, delay: 0.2 }}
                      className={`${NATION_STORY_TYPE.emphasis} tabular-nums whitespace-nowrap`}
                      style={{ color: current.color }}
                    >
                      +{formatMton(current.delta, currentLanguage, 0)}{" "}
                      {t("nation.story.unit.mton")}
                    </motion.p>
                  </span>
                </motion.span>
              )}
            </div>

            <p
              className={`${NATION_STORY_TYPE.meta} ${NATION_STORY_TEXT.secondary} mt-1 md:mt-10`}
            >
              {t("nation.story.journey.dataYear", { year: metrics.latestYear })}
            </p>
          </div>

          {/* Caption + legend of layers added so far */}
          <div className="space-y-2.5 md:space-y-4 order-2 min-h-0">
            <motion.div
              key={current.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-2 md:space-y-3"
            >
              <p
                className={`${NATION_STORY_TYPE.eyebrow} ${NATION_STORY_TEXT.eyebrow}`}
              >
                {t("nation.story.journey.stepCounter", {
                  current: step + 1,
                  total: steps.length,
                })}
              </p>
              <p
                className={`flex items-center gap-2.5 md:gap-3 ${NATION_STORY_TYPE.emphasis} text-white`}
              >
                <span
                  className="w-3 h-3 md:w-4 md:h-4 rounded-full shrink-0"
                  style={{ backgroundColor: current.color }}
                />
                {t(current.labelKey)}
              </p>
              <p
                className={`${NATION_STORY_TYPE.body} ${NATION_STORY_TEXT.body}`}
              >
                {t(current.textKey)}
              </p>
            </motion.div>

            {/* Running tally: builds up row by row, with a summed total line.
                Hidden while there is only one layer (it would just repeat the header). */}
            {revealedLayers.length >= 2 && (
              <div className="space-y-1 border-t border-white/10 pt-2 md:pt-3">
                {steps
                  .slice(0, step + 1)
                  .filter((s) => s.layer)
                  .map((s, i) => (
                    <motion.div
                      key={s.key}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.35, delay: 0.1 }}
                      className={`flex items-center gap-2 md:gap-2.5 ${NATION_STORY_TYPE.meta}`}
                    >
                      <span
                        className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 rounded-full shrink-0"
                        style={{ backgroundColor: s.color }}
                      />
                      <span className={`${NATION_STORY_TEXT.secondary} flex-1`}>
                        {t(s.labelKey)}
                      </span>
                      <span
                        className={`${NATION_STORY_TEXT.secondary} tabular-nums shrink-0`}
                      >
                        {i === 0 ? "" : "+"}
                        {formatMton(s.delta, currentLanguage, 0)}{" "}
                        {t("nation.story.unit.mton")}
                      </span>
                    </motion.div>
                  ))}
                <div
                  className={`flex items-center gap-2 md:gap-2.5 border-t border-white/10 pt-1.5 mt-1.5 ${NATION_STORY_TYPE.meta} text-white font-medium`}
                >
                  <span className="w-2.5 md:w-3.5 shrink-0" aria-hidden />
                  <span className="flex-1">
                    {t("nation.story.journey.totalLabel")}
                  </span>
                  <span className="tabular-nums shrink-0">
                    {formatMton(current.total, currentLanguage, 0)}{" "}
                    {t("nation.story.unit.mton")}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
