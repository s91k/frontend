import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  AnimatePresence,
  animate,
  motion,
  useReducedMotion,
  type AnimationPlaybackControls,
} from "framer-motion";
import { BATHTUB_ENTER_VH } from "@/components/nation/story/NationBathtub";
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

/**
 * Private e-commerce estimate (~326 000 t CO₂e). Shown as its own tally row,
 * but excluded from the running total: the amount is too small to move the
 * rounded 159 Mton figure and is presented as an addition outside official
 * statistics.
 */
const E_COMMERCE_MTON = 0.326;

/**
 * Small additions need decimals to not round to zero – three of them, so the
 * e-commerce delta (0.326 Mton) matches the 326 000 tonnes cited in the copy.
 */
function deltaDecimals(delta: number): number {
  return delta > 0 && delta < 1 ? 3 : 0;
}

/** Desktop onion diameter; mobile scales down so text + bubble fit one screen. */
const DESKTOP_MAX_DIAMETER = 300;
const MOBILE_MAX_DIAMETER = 148;
/** Scroll distance per journey step – higher = more time to watch each layer grow. */
const JOURNEY_STEP_VH = 115;
/**
 * Extra pinned scroll after the last step for the exit morph: the finished
 * bubble compresses into a water drop and falls toward the bathtub scene.
 * Entering this zone triggers an auto-scroll ride through the whole hand-off,
 * so the zone mainly sets the morph's pacing during that ride.
 */
const JOURNEY_EXIT_VH = 90;
/** Size the bubble shrinks to before falling – matches the tub's faucet drip. */
const DROPLET_DIAMETER = 14;

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);
const smoothstep = (t: number) => t * t * (3 - 2 * t);
/**
 * Layer diameters are lerped from scroll progress; this spring only smooths
 * between scroll events, so it tracks tighter than the old step-change spring.
 */
const LAYER_GROW_TRANSITION = {
  type: "spring" as const,
  stiffness: 90,
  damping: 22,
  mass: 0.8,
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
      delta: E_COMMERCE_MTON,
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

  const { ref, step, progress, exitProgress, sectionVh, stageStyle } =
    usePinnedSteps(steps.length, JOURNEY_STEP_VH, {
      exitVh: JOURNEY_EXIT_VH,
    });

  // Auto-scroll ride: scrolling into the exit zone takes over and carries the
  // page through the droplet morph and the bathtub's enter fade in one
  // continuous motion, so a slow swipe can't strand the reader in the gap
  // between the falling drop and the tub. Scrolling up (or a new touch)
  // cancels the ride; it re-arms once the reader is back above the zone.
  const prevExitRef = useRef(0);
  const rideDoneRef = useRef(false);
  const rideControlsRef = useRef<AnimationPlaybackControls | null>(null);

  useEffect(() => {
    const prevExit = prevExitRef.current;
    prevExitRef.current = exitProgress;

    if (exitProgress === 0) {
      // Back above the zone: re-arm and make sure no stale ride keeps
      // driving the scroll (e.g. after a scrollbar drag fought it upward).
      rideDoneRef.current = false;
      rideControlsRef.current?.stop();
      rideControlsRef.current = null;
      return;
    }
    if (reducedMotion || rideDoneRef.current) return;
    // Only trigger on a downward crossing into the zone, not when arriving
    // from the bathtub side or after a programmatic jump deep into the zone.
    if (!(prevExit <= 0.02 && exitProgress > 0.02 && exitProgress < 0.5))
      return;

    const tubSection = ref.current?.nextElementSibling;
    if (!(tubSection instanceof HTMLElement)) return;
    rideDoneRef.current = true;
    // Single flight: never let two rides drive the scroll at once.
    rideControlsRef.current?.stop();

    // Land where the tub has fully entered: tub top + its enter zone.
    const target =
      window.scrollY +
      tubSection.getBoundingClientRect().top +
      (BATHTUB_ENTER_VH / 100) * window.innerHeight;

    const controls = animate(window.scrollY, target, {
      duration: 2,
      ease: [0.45, 0, 0.25, 1],
      onUpdate: (value) => window.scrollTo(0, value),
    });
    rideControlsRef.current = controls;

    const cancelIfUpward = (event: WheelEvent) => {
      if (event.deltaY < 0) controls.stop();
    };
    // Any new pointer contact (touch, click, scrollbar grab) hands control back.
    const cancelOnPointer = () => controls.stop();
    const cancelIfUpwardKey = (event: KeyboardEvent) => {
      if (["ArrowUp", "PageUp", "Home"].includes(event.key)) controls.stop();
    };
    window.addEventListener("wheel", cancelIfUpward, { passive: true });
    window.addEventListener("touchstart", cancelOnPointer, { passive: true });
    window.addEventListener("pointerdown", cancelOnPointer, { passive: true });
    window.addEventListener("keydown", cancelIfUpwardKey);
    const cleanup = () => {
      window.removeEventListener("wheel", cancelIfUpward);
      window.removeEventListener("touchstart", cancelOnPointer);
      window.removeEventListener("pointerdown", cancelOnPointer);
      window.removeEventListener("keydown", cancelIfUpwardKey);
      if (rideControlsRef.current === controls) rideControlsRef.current = null;
    };
    controls.then(cleanup, cleanup);
  }, [exitProgress, reducedMotion, ref]);

  // Stop a running ride if the story unmounts mid-flight.
  useEffect(() => () => rideControlsRef.current?.stop(), []);

  const current = steps[step];
  // Scroll position within the current step (0–1), smoothstepped so layers
  // grow gently with the scroll instead of jumping per step.
  const rawStepProgress = clamp01(progress * steps.length - step);
  const stepProgress = smoothstep(rawStepProgress);
  const newestLayerKey = steps
    .slice(0, step + 1)
    .filter((s) => s.layer)
    .at(-1)?.key;
  // Total of the layer beneath the one currently growing – its start diameter.
  const previousLayerTotal =
    steps
      .slice(0, step)
      .filter((s) => s.layer)
      .at(-1)?.total ?? 0;

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

  // Diameter of the circle as currently drawn: lerped while the current
  // step's layer is growing, full-size otherwise.
  const currentStartDiameter =
    previousLayerTotal > 0 ? diameterFor(previousLayerTotal) : 0;
  const currentDrawnDiameter =
    current.layer && !reducedMotion
      ? currentStartDiameter +
        (diameterFor(current.total) - currentStartDiameter) * stepProgress
      : diameterFor(current.total);

  // Distance from the bubble center to just outside the current circle's
  // edge along the 45° upper-right diagonal (past the dashed ring when shown).
  const deltaChipOffset =
    (currentDrawnDiameter + (current.ring ? (isMobile ? 16 : 26) : 0)) /
      2 /
      Math.SQRT2 +
    (isMobile ? 8 : 12);

  // The running total sits on the smallest (innermost) circle – territorial,
  // which only grows during the first step. Until that circle is big enough
  // to sit behind the text, render the number white on the dark backdrop.
  const smallestDrawnDiameter =
    step === 0 ? currentDrawnDiameter : diameterFor(steps[0].total);
  const totalOnLayer = smallestDrawnDiameter >= (isMobile ? 64 : 116);

  // Exit morph (scroll-lerped): captions fade first, then the bubble
  // compresses into a blue droplet that sinks and finally falls off-stage
  // toward the bathtub scene. With reduced motion the stage simply fades.
  const exitFade = reducedMotion ? 1 : 1 - Math.min(exitProgress / 0.3, 1);
  const shrinkT = reducedMotion
    ? 0
    : smoothstep(clamp01((exitProgress - 0.1) / 0.7));
  const fallT = reducedMotion ? 0 : clamp01((exitProgress - 0.8) / 0.2);
  const viewportH = typeof window === "undefined" ? 800 : window.innerHeight;
  const bubbleScale = 1 + (DROPLET_DIAMETER / maxDiameter - 1) * shrinkT;
  const bubbleY = viewportH * (0.22 * shrinkT + 0.9 * fallT * fallT);
  const bubbleOpacity = 1 - fallT;
  const stageOpacity = reducedMotion ? 1 - clamp01(exitProgress / 0.5) : 1;

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
        className="h-[100svh] flex items-center px-4 md:px-8 pt-14 pb-6 md:py-0 overflow-hidden"
        style={stageStyle}
      >
        {/* Same subtle depth backdrop as the hero, tying the chapter to the intro */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_45%,var(--black-2)_0%,var(--black-3)_78%)]"
        />
        <div
          className="relative grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12 items-center w-full max-w-5xl mx-auto"
          style={{ opacity: stageOpacity }}
        >
          {/* Bubble = accumulating colored layers */}
          <div className="flex flex-col items-center gap-2 md:gap-4 order-1">
            <div
              className="relative"
              style={{
                width: maxDiameter,
                height: maxDiameter,
                transform: `translateY(${bubbleY}px) scale(${bubbleScale})`,
                transformOrigin: "50% 50%",
                opacity: bubbleOpacity,
              }}
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
                const fullDiameter = diameterFor(layer.total);
                // The newest layer grows with scroll (lerp) during its own
                // step, starting from the previous layer's edge; scrolling
                // back shrinks it the same way. Older layers stay full-size.
                const isGrowingLayer =
                  !reducedMotion &&
                  current.layer &&
                  layer.key === newestLayerKey &&
                  layer.key === current.key;
                const startDiameter =
                  previousLayerTotal > 0 ? diameterFor(previousLayerTotal) : 0;
                const d = isGrowingLayer
                  ? startDiameter +
                    (fullDiameter - startDiameter) * stepProgress
                  : fullDiameter;
                return (
                  <motion.div
                    key={layer.key}
                    className="absolute left-1/2 top-1/2 rounded-full"
                    style={{ backgroundColor: layer.color, opacity: 1 }}
                    initial={false}
                    animate={{ width: d, height: d, x: "-50%", y: "-50%" }}
                    transition={
                      reducedMotion ? { duration: 0 } : LAYER_GROW_TRANSITION
                    }
                  />
                );
              })}

              {/* Private e-commerce: thin dashed ring around the current total */}
              {showRing && ringStep && (
                <div style={{ opacity: exitFade }}>
                  <motion.span
                    className="absolute left-1/2 top-1/2 rounded-full border-2 border-dashed"
                    style={{
                      width: diameterFor(ringTotal) + (isMobile ? 16 : 26),
                      height: diameterFor(ringTotal) + (isMobile ? 16 : 26),
                      x: "-50%",
                      y: "-50%",
                      borderColor: NATION_STORY_COLORS.eCommerceRing,
                    }}
                    initial={
                      reducedMotion ? false : { opacity: 0, scale: 0.85 }
                    }
                    animate={{ opacity: 1, scale: 1 }}
                    transition={
                      reducedMotion
                        ? { duration: 0 }
                        : { duration: 0.9, ease: [0.22, 1, 0.36, 1] }
                    }
                  />
                </div>
              )}

              {/* Exit morph: the stack crossfades to water-blue while it
                  shrinks, so the droplet matches the tub's faucet drip */}
              {shrinkT > 0 && (
                <div
                  aria-hidden
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    width: maxDiameter,
                    height: maxDiameter,
                    backgroundColor: "var(--blue-2)",
                    opacity: shrinkT,
                  }}
                />
              )}

              {/* Running total on top – white on the dark backdrop until the
                  innermost circle has grown large enough to sit behind it */}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ opacity: exitFade }}
              >
                <motion.span
                  initial={false}
                  animate={{ color: totalOnLayer ? "#000000" : "#ffffff" }}
                  transition={{ duration: 0.3 }}
                  className={`${NATION_STORY_TYPE.stat} font-medium select-none leading-none text-center`}
                >
                  {formatMton(current.total, currentLanguage, 0)}
                  <span
                    className={`block ${NATION_STORY_TYPE.meta} font-medium mt-0.5 md:mt-1`}
                  >
                    {t("nation.story.unit.mton")}
                  </span>
                </motion.span>
              </div>

              {/* The step's own contribution sits just off the current circle's
                  upper-right edge, riding outward with the same spring as the
                  growing layer so it follows the circle smoothly. */}
              {step > 0 && current.delta > 0 && (
                <motion.span
                  className="absolute left-1/2 top-1/2 pointer-events-none"
                  style={{ opacity: exitFade }}
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
                      +
                      {formatMton(
                        current.delta,
                        currentLanguage,
                        deltaDecimals(current.delta),
                      )}{" "}
                      {t("nation.story.unit.mton")}
                    </motion.p>
                  </span>
                </motion.span>
              )}
            </div>

            <p
              className={`${NATION_STORY_TYPE.meta} ${NATION_STORY_TEXT.secondary} mt-1 md:mt-10`}
              style={{ opacity: exitFade }}
            >
              {t("nation.story.journey.dataYear", { year: metrics.latestYear })}
            </p>
          </div>

          {/* Caption + legend of layers added so far */}
          <div
            className="space-y-2.5 md:space-y-4 order-2 min-h-0"
            style={{ opacity: exitFade }}
          >
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
                  .filter((s) => s.layer || s.ring)
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
                        style={{
                          backgroundColor: s.ring ? "#ffffff" : s.color,
                        }}
                      />
                      <span className={`${NATION_STORY_TEXT.secondary} flex-1`}>
                        {t(s.labelKey)}
                      </span>
                      <span
                        className={`${NATION_STORY_TEXT.secondary} tabular-nums shrink-0`}
                      >
                        {i === 0 ? "" : "+"}
                        {formatMton(
                          s.delta,
                          currentLanguage,
                          deltaDecimals(s.delta),
                        )}{" "}
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
