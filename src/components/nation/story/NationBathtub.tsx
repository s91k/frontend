import { useId, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "framer-motion";
import {
  formatMton,
  type NationBathtubDataPoint,
} from "@/utils/data/nationStoryMetrics";
import { useLanguage } from "@/components/LanguageProvider";
import { useScreenSize } from "@/hooks/useScreenSize";
import {
  NATION_STORY_TEXT,
  NATION_STORY_TYPE,
} from "@/components/nation/story/nationStoryColors";
import { svgLocalUrl } from "@/components/nation/story/svgLocalUrl";
import { usePinnedSteps } from "@/components/nation/story/usePinnedSteps";

/**
 * Sample years so the caption advances in decade milestones
 * (1990, 2000, 2010, 2020 + the latest year) – four scrolls to the end.
 */
function sampleBathtubYears(
  data: NationBathtubDataPoint[],
): NationBathtubDataPoint[] {
  if (data.length === 0) return [];
  const sampled: NationBathtubDataPoint[] = [];
  for (const point of data) {
    const isMilestone = (point.year - data[0].year) % 10 === 0;
    const isLast = point === data.at(-1);
    if ((isMilestone || isLast) && !sampled.includes(point))
      sampled.push(point);
  }
  return sampled;
}

/** Cumulative level interpolated between milestone steps for the current scroll segment. */
function levelAtStepProgress(
  steps: NationBathtubDataPoint[],
  step: number,
  progress: number,
  stepCount: number,
): number {
  if (steps.length === 0) return 0;
  const current = steps[step];
  if (!current) return 0;

  const stepProgress = Math.min(Math.max(progress * stepCount - step, 0), 1);
  const previousCumulative =
    step === 0 ? 0 : (steps[step - 1]?.cumulativeMton ?? 0);

  return (
    previousCumulative +
    stepProgress * (current.cumulativeMton - previousCumulative)
  );
}

type NationBathtubProps = {
  data: NationBathtubDataPoint[];
};

/**
 * Claw-foot tub geometry (viewBox 520×260): elliptical rim with a visible
 * lip, curved basin walls, two claw feet and a rim-mounted faucet.
 */
const TUB_WATER_TOP = 84;
const TUB_INNER_BOTTOM = 212;
const TUB_WATER_HEIGHT = TUB_INNER_BOTTOM - TUB_WATER_TOP;
const TUB_WATER_LEFT = 58;
const TUB_WATER_WIDTH = 404;
/** Inner basin: walls curving to a rounded floor, closed straight across the top. */
const TUB_WATER_CLIP_PATH =
  "M58 84 C58 158 88 204 150 212 L370 212 C432 204 462 158 462 84 Z";
/** Outer wall, from left rim edge down around the basin to the right rim edge. */
const TUB_BODY_PATH =
  "M40 78 C40 160 74 214 142 224 L378 224 C446 214 480 160 480 78";
/** Body outline closed along the underside of the rim – fillable enamel shape. */
const TUB_BODY_FILL_PATH = `${TUB_BODY_PATH} A220 16 0 0 1 40 78 Z`;
/** Rolled rim: band between the outer lip and the inner opening. */
const TUB_RIM_BAND_PATH =
  "M40 78 a220 16 0 1 0 440 0 a220 16 0 1 0 -440 0 " +
  "M58 80 a202 10 0 1 0 404 0 a202 10 0 1 0 -404 0";
const TUB_STROKE = "rgba(255,255,255,0.4)";

/**
 * Basin interior half-width sampled along the wall curve, so the water
 * surface ellipse can match the tub's width at the current level.
 */
const BASIN_HALF_WIDTH_SAMPLES: ReadonlyArray<readonly [number, number]> = [
  [84, 202],
  [134, 196],
  [173, 179],
  [199, 150],
  [208, 128],
  [212, 110],
];

function basinHalfWidthAt(y: number): number {
  const samples = BASIN_HALF_WIDTH_SAMPLES;
  if (y <= samples[0][0]) return samples[0][1];
  for (let i = 1; i < samples.length; i++) {
    const [y1, w1] = samples[i];
    if (y <= y1) {
      const [y0, w0] = samples[i - 1];
      return w0 + ((y - y0) / (y1 - y0)) * (w1 - w0);
    }
  }
  return samples[samples.length - 1][1];
}

const WATER_SPRING = {
  type: "spring" as const,
  stiffness: 60,
  damping: 20,
  mass: 0.8,
};

/** Scroll distance per bathtub milestone step. */
const BATHTUB_STEP_VH = 70;
/**
 * Extra pinned scroll before the steps: the tub eases in while the faucet
 * drip (the droplet handed over from the onion scene) is already falling.
 * The onion scene's auto-scroll ride ends exactly at the end of this zone.
 */
export const BATHTUB_ENTER_VH = 70;

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);
const smoothstep = (t: number) => t * t * (3 - 2 * t);

type TubCaption = {
  /** small line above the figure, e.g. "Sverige har totalt släppt ut" */
  prefix: string;
  /** the accumulated figure incl. unit, e.g. "4 712 Mton CO₂e" */
  value: string;
  /** small line below the figure, e.g. "sedan 1990" */
  suffix: string;
};

type TubGraphicProps = {
  idPrefix: string;
  /** SVG y coordinate of the current water surface. */
  waterTop: number;
  /** Accumulated-total caption rendered inside the basin. */
  caption: TubCaption;
  /** Larger relative type on small screens where the whole SVG shrinks. */
  compact?: boolean;
  className?: string;
};

function TubGraphic({
  idPrefix,
  waterTop,
  caption,
  compact = false,
  className,
}: TubGraphicProps) {
  const reducedMotion = useReducedMotion();
  const clipId = `${idPrefix}-clip`;
  const gradientId = `${idPrefix}-gradient`;
  const enamelId = `${idPrefix}-enamel`;
  const waterHeight = Math.max(TUB_INNER_BOTTOM - waterTop, 0);
  const waterTransition = reducedMotion ? { duration: 0 } : WATER_SPRING;
  // Water surface ellipse matches the basin width at the current level
  const surfaceRx = Math.max(basinHalfWidthAt(waterTop) - 3, 0);
  const surfaceRy = Math.max(surfaceRx * 0.055, 4);

  return (
    <svg viewBox="0 0 520 260" className={className} aria-hidden>
      <defs>
        <clipPath id={clipId}>
          <path d={TUB_WATER_CLIP_PATH} />
        </clipPath>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--blue-3)" stopOpacity="0.85" />
          <stop offset="100%" stopColor="var(--blue-4)" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id={enamelId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
        </linearGradient>
      </defs>

      {/* Rim-mounted faucet: riser with a cross handle, gooseneck spout */}
      <path
        d="M424 76 V42 Q424 26 408 26 H400 V30"
        fill="none"
        stroke={TUB_STROKE}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Handle on the riser */}
      <path
        d="M429 48 h10"
        stroke={TUB_STROKE}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle
        cx="441"
        cy="48"
        r="3"
        fill="none"
        stroke={TUB_STROKE}
        strokeWidth="2"
      />
      {/* Spout mouth */}
      <path d="M396 30 h8 v4 h-8 z" fill={TUB_STROKE} />
      {/* Drip in brand blue – falls from the spout on a loop */}
      {reducedMotion ? (
        <circle cx="400" cy="46" r="3.2" fill="var(--blue-2)" />
      ) : (
        <motion.circle
          cx={400}
          r={3.2}
          fill="var(--blue-2)"
          initial={false}
          animate={{ cy: [38, 74], opacity: [0, 1, 1, 0] }}
          transition={{
            cy: {
              repeat: Infinity,
              duration: 1.3,
              ease: "easeIn",
              repeatDelay: 0.5,
            },
            opacity: {
              repeat: Infinity,
              duration: 1.3,
              times: [0, 0.15, 0.8, 1],
              repeatDelay: 0.5,
            },
          }}
        />
      )}

      {/* Enamel body – a subtle fill so the tub reads as a solid object */}
      <path d={TUB_BODY_FILL_PATH} fill={svgLocalUrl(enamelId)} />

      {/* Single continuous water body (behind the rim so the lip overlaps it) */}
      <g clipPath={svgLocalUrl(clipId)}>
        <motion.rect
          x={TUB_WATER_LEFT}
          width={TUB_WATER_WIDTH}
          initial={false}
          animate={{ y: waterTop, height: waterHeight }}
          transition={waterTransition}
          fill={svgLocalUrl(gradientId)}
        />
      </g>
      {/* Surface sits above the fill and outside the clip so it stays visible when full */}
      <motion.ellipse
        cx={260}
        fill="var(--blue-2)"
        fillOpacity={0.32}
        stroke="var(--blue-2)"
        strokeWidth="2"
        initial={false}
        animate={{ cy: waterTop, rx: surfaceRx, ry: surfaceRy }}
        transition={waterTransition}
      />

      {/* Accumulated total inside the basin – the screenshot-friendly figure */}
      <g style={{ fontFamily: "inherit" }}>
        <text
          x={260}
          y={compact ? 122 : 126}
          textAnchor="middle"
          fill="rgba(255,255,255,0.9)"
          fontSize={compact ? 21 : 15}
        >
          {caption.prefix}
        </text>
        <text
          x={260}
          y={compact ? 162 : 164}
          textAnchor="middle"
          fill="#ffffff"
          fontSize={compact ? 42 : 32}
          fontWeight={500}
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {caption.value}
        </text>
        <text
          x={260}
          y={compact ? 192 : 190}
          textAnchor="middle"
          fill="rgba(255,255,255,0.9)"
          fontSize={compact ? 21 : 15}
        >
          {caption.suffix}
        </text>
      </g>

      {/* Basin walls and rounded floor */}
      <path
        d={TUB_BODY_PATH}
        fill="none"
        stroke={TUB_STROKE}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Rolled rim: filled band between outer lip and inner opening */}
      <path
        d={TUB_RIM_BAND_PATH}
        fill="rgba(255,255,255,0.07)"
        fillRule="evenodd"
      />
      <ellipse
        cx="260"
        cy="78"
        rx="220"
        ry="16"
        fill="none"
        stroke={TUB_STROKE}
        strokeWidth="2"
      />
      <ellipse
        cx="260"
        cy="80"
        rx="202"
        ry="10"
        fill="none"
        stroke={TUB_STROKE}
        strokeWidth="1"
        strokeOpacity="0.6"
      />

      {/* Sheen on the left enamel wall */}
      <path
        d="M76 100 C72 134 80 172 98 194"
        fill="none"
        stroke="rgba(255,255,255,0.09)"
        strokeWidth="7"
        strokeLinecap="round"
      />

      {/* Ball-claw feet, curling outward */}
      <path
        d="M152 224 Q152 238 140 245"
        fill="none"
        stroke={TUB_STROKE}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="137" cy="247" r="3.5" fill={TUB_STROKE} />
      <path
        d="M368 224 Q368 238 380 245"
        fill="none"
        stroke={TUB_STROKE}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="383" cy="247" r="3.5" fill={TUB_STROKE} />
    </svg>
  );
}

export function NationBathtub({ data }: NationBathtubProps) {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const { isMobile } = useScreenSize();
  const reducedMotion = useReducedMotion();
  // useId can include ":" which is awkward in url(#…) fragments
  const idPrefix = `tub-${useId().replace(/:/g, "")}`;
  const steps = useMemo(() => sampleBathtubYears(data), [data]);
  const stepCount = Math.max(steps.length, 1);
  const maxCumulative = data.at(-1)?.cumulativeMton ?? 1;

  const { ref, step, progress, enterProgress, sectionVh, stageStyle } =
    usePinnedSteps(stepCount, BATHTUB_STEP_VH, {
      enterVh: BATHTUB_ENTER_VH,
    });

  const current = steps[step] ?? steps[0];
  if (!current) return null;

  // Enter morph (scroll-lerped): the tub and copy ease in from below while
  // the faucet drip carries over the droplet from the onion scene. `progress`
  // covers the steps span only, so the water stays at zero until this is done.
  // Opacity completes early in the zone to keep the black gap after the
  // falling droplet short.
  const enterT = reducedMotion ? 1 : smoothstep(clamp01(enterProgress));
  const enterOpacity = reducedMotion ? 1 : clamp01(enterT / 0.65);

  // Water rises smoothly within each milestone segment so fill matches captions.
  const level = levelAtStepProgress(steps, step, progress, stepCount);
  const fillRatio = Math.min(level / maxCumulative, 1);
  const waterTop = TUB_INNER_BOTTOM - fillRatio * TUB_WATER_HEIGHT;

  const previous = step === 0 ? null : steps[step - 1];
  const previousCumulative = previous?.cumulativeMton ?? 0;
  const chunkMton = current.cumulativeMton - previousCumulative;
  // Milestone chunks cover the years after the previous sample through current.
  const chunkFromYear = previous ? previous.year + 1 : current.year;
  const chunkToYear = current.year;

  const chunkCaption =
    chunkFromYear === chunkToYear
      ? t("nation.story.bathtub.chunkCaptionSingleYear", {
          value: formatMton(chunkMton, currentLanguage, 0),
          year: chunkToYear,
        })
      : t("nation.story.bathtub.chunkCaptionYearRange", {
          value: formatMton(chunkMton, currentLanguage, 0),
          fromYear: chunkFromYear,
          toYear: chunkToYear,
        });

  // Accumulated-total caption drawn inside the tub water.
  const tubCaption: TubCaption = {
    prefix: t("nation.story.bathtub.waterCaptionPrefix"),
    value: `${formatMton(current.cumulativeMton, currentLanguage, 0)} ${t("nation.story.unit.mtonCo2e")}`,
    suffix: t("nation.story.bathtub.waterCaptionSuffix"),
  };

  return (
    <section
      ref={ref}
      data-story-section
      data-story-step={step}
      data-story-steps={steps.length}
      data-story-step-vh={BATHTUB_STEP_VH}
      className="relative"
      style={{ height: `${sectionVh}vh` }}
    >
      <div
        className="h-[100svh] flex items-center px-4 md:px-8 pt-14 pb-6 md:pt-0 md:pb-28"
        style={stageStyle}
      >
        <div
          className="w-full max-w-3xl mx-auto space-y-4 md:space-y-6"
          style={{
            opacity: enterOpacity,
            transform: `translateY(${(1 - enterT) * 24}px) scale(${0.94 + 0.06 * enterT})`,
            transformOrigin: "50% 40%",
          }}
        >
          {/* Copy above the tub on all breakpoints */}
          <div className="max-w-2xl mx-auto text-center space-y-2.5 md:space-y-3">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.4 }}
              className="text-2xl md:text-3xl font-light tracking-tight text-white"
            >
              {t("nation.story.bathtub.eyebrow")}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45 }}
              className={`${NATION_STORY_TYPE.body} ${NATION_STORY_TEXT.body}`}
            >
              {t("nation.story.bathtub.text")}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className={`${NATION_STORY_TYPE.emphasis} text-white`}
            >
              {t("nation.story.bathtub.question")}
            </motion.p>
          </div>

          <TubGraphic
            idPrefix={idPrefix}
            waterTop={waterTop}
            caption={tubCaption}
            compact={isMobile}
            className="w-64 md:w-full max-w-lg mx-auto h-auto"
          />

          {/* Milestone captions below the tub: the year and this decade's addition.
              The accumulated total lives inside the tub water. */}
          <div className="text-center space-y-0.5 md:space-y-1 min-h-[3.5rem] md:min-h-[4.5rem]">
            <p className="sr-only">
              {`${tubCaption.prefix} ${tubCaption.value} ${tubCaption.suffix}`}
            </p>
            <motion.p
              key={current.year}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={NATION_STORY_TYPE.stat}
            >
              {current.year}
            </motion.p>
            <p
              className={`${NATION_STORY_TYPE.meta} ${NATION_STORY_TEXT.secondary}`}
            >
              {chunkCaption}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
