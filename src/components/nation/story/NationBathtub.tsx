import { useId, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "framer-motion";
import {
  formatMton,
  NATION_BASELINE_YEAR,
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
 * Scroll-driven bathtub steps: 1990 baseline, four decade ranges, then a
 * caption-free screenshot beat at the full cumulative total.
 */
const BATHTUB_DECADE_RANGES = [
  { from: 1991, to: 2000 },
  { from: 2001, to: 2010 },
  { from: 2011, to: 2020 },
] as const;

type BathtubCaption =
  | { kind: "baseline"; year: number; valueMton: number }
  | { kind: "range"; fromYear: number; toYear: number; valueMton: number };

type BathtubDisplayStep = {
  cumulativeMton: number;
  caption: BathtubCaption | null;
};

function sumAnnualMton(
  data: NationBathtubDataPoint[],
  fromYear: number,
  toYear: number,
): number {
  return data
    .filter((point) => point.year >= fromYear && point.year <= toYear)
    .reduce((sum, point) => sum + point.annualMton, 0);
}

function buildBathtubDisplaySteps(
  data: NationBathtubDataPoint[],
): BathtubDisplayStep[] {
  if (data.length === 0) return [];

  const byYear = new Map(data.map((point) => [point.year, point]));
  const latestYear = data.at(-1)!.year;
  const baseline = byYear.get(NATION_BASELINE_YEAR);
  if (!baseline) return [];

  const steps: BathtubDisplayStep[] = [
    {
      cumulativeMton: baseline.cumulativeMton,
      caption: {
        kind: "baseline",
        year: NATION_BASELINE_YEAR,
        valueMton: baseline.annualMton,
      },
    },
  ];

  for (const { from, to } of BATHTUB_DECADE_RANGES) {
    const endPoint = byYear.get(to);
    if (!endPoint) continue;
    steps.push({
      cumulativeMton: endPoint.cumulativeMton,
      caption: {
        kind: "range",
        fromYear: from,
        toYear: to,
        valueMton: sumAnnualMton(data, from, to),
      },
    });
  }

  const latestPoint = byYear.get(latestYear);
  if (latestPoint && latestYear > 2020) {
    steps.push({
      cumulativeMton: latestPoint.cumulativeMton,
      caption: {
        kind: "range",
        fromYear: 2021,
        toYear: latestYear,
        valueMton: sumAnnualMton(data, 2021, latestYear),
      },
    });
  }

  steps.push({
    cumulativeMton: data.at(-1)!.cumulativeMton,
    caption: null,
  });

  return steps;
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
 * The tub artwork is scaled up around its centre while the caption text keeps
 * its own size, giving the text more room inside the basin. Only the drawn
 * shapes get this transform – text elements stay in unscaled coordinates.
 */
const TUB_ZOOM = "translate(260 150) scale(1.13 1.1) translate(-260 -150)";

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

/**
 * Scroll distance per bathtub milestone segment. The effective scroll per
 * segment is smaller (the pin distance loses one viewport height: 55vh
 * nominal ≈ 30vh real), so this mainly guards against a single lazy swipe
 * skipping two decades at once – the water snaps per milestone regardless.
 */
const BATHTUB_STEP_VH = 55;
/** Extra pinned scroll before the steps – the tub eases in from below. */
export const BATHTUB_ENTER_VH = 40;

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);
const smoothstep = (t: number) => t * t * (3 - 2 * t);

type TubCaption = {
  /** Accumulated total incl. unit, e.g. "1 850 Mton CO₂e" */
  value: string;
};

type TubGraphicProps = {
  idPrefix: string;
  /** SVG y coordinate of the current water surface. */
  waterTop: number;
  /** Accumulated-total caption rendered inside the basin. */
  caption: TubCaption;
  /** Larger relative type on small screens where the whole SVG shrinks. */
  compact?: boolean;
  /** Skip motion – used for the conclusion recap snapshot. */
  static?: boolean;
  className?: string;
  viewBox?: string;
};

function TubGraphic({
  idPrefix,
  waterTop,
  caption,
  compact = false,
  static: isStatic = false,
  className,
  viewBox = "0 0 520 262",
}: TubGraphicProps) {
  const reducedMotion = useReducedMotion();
  const clipId = `${idPrefix}-clip`;
  const gradientId = `${idPrefix}-gradient`;
  const enamelId = `${idPrefix}-enamel`;
  const waterHeight = Math.max(TUB_INNER_BOTTOM - waterTop, 0);
  const waterTransition =
    isStatic || reducedMotion ? { duration: 0 } : WATER_SPRING;
  // Water surface ellipse matches the basin width at the current level
  const surfaceRx = Math.max(basinHalfWidthAt(waterTop) - 3, 0);
  const surfaceRy = Math.max(surfaceRx * 0.055, 4);
  const freezeMotion = isStatic || reducedMotion;

  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      className={className}
      aria-hidden
    >
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

      {/* Everything drawn below the text (water, enamel, faucet) – scaled up */}
      <g transform={TUB_ZOOM}>
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
        {freezeMotion ? (
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
          {freezeMotion ? (
            <rect
              x={TUB_WATER_LEFT}
              width={TUB_WATER_WIDTH}
              y={waterTop}
              height={waterHeight}
              fill={svgLocalUrl(gradientId)}
            />
          ) : (
            <motion.rect
              x={TUB_WATER_LEFT}
              width={TUB_WATER_WIDTH}
              initial={false}
              animate={{ y: waterTop, height: waterHeight }}
              transition={waterTransition}
              fill={svgLocalUrl(gradientId)}
            />
          )}
        </g>
        {/* Surface sits above the fill and outside the clip so it stays visible when full */}
        {freezeMotion ? (
          <ellipse
            cx={260}
            cy={waterTop}
            rx={surfaceRx}
            ry={surfaceRy}
            fill="var(--blue-2)"
            fillOpacity={0.32}
            stroke="var(--blue-2)"
            strokeWidth="2"
          />
        ) : (
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
        )}
      </g>

      {/* Accumulated total inside the basin – the main focal point */}
      <g style={{ fontFamily: "inherit" }}>
        <text
          x={260}
          y={compact ? 168 : 162}
          textAnchor="middle"
          fill="#ffffff"
          fontSize={compact ? 46 : 38}
          fontWeight={500}
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {caption.value}
        </text>
      </g>

      {/* Tub outline drawn above the text – same zoom as the artwork below */}
      <g transform={TUB_ZOOM}>
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
      </g>
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
  const steps = useMemo(() => buildBathtubDisplaySteps(data), [data]);
  const stepCount = Math.max(steps.length, 1);
  const maxCumulative = data.at(-1)?.cumulativeMton ?? 1;

  const { ref, step, enterProgress, sectionVh, stageStyle } = usePinnedSteps(
    stepCount,
    BATHTUB_STEP_VH,
    {
      enterVh: BATHTUB_ENTER_VH,
    },
  );

  const displayedIndex = reducedMotion
    ? stepCount - 1
    : Math.min(step, stepCount - 1);
  const current = steps[displayedIndex];
  if (!current) return null;

  const isFinalStep = current.caption === null;
  const captionForLayout =
    current.caption ?? steps[displayedIndex - 1]?.caption ?? null;

  // Enter morph (scroll-lerped): the tub and copy ease in from below. `progress`
  // covers the steps span only, so the water rests at the 1990 level until
  // this is done.
  const enterT = reducedMotion ? 1 : smoothstep(clamp01(enterProgress));
  const enterOpacity = reducedMotion ? 1 : clamp01(enterT / 0.65);

  const fillRatio = Math.min(current.cumulativeMton / maxCumulative, 1);
  const waterTop = TUB_INNER_BOTTOM - fillRatio * TUB_WATER_HEIGHT;

  const periodCaption = (() => {
    if (!captionForLayout) return null;
    const value = formatMton(captionForLayout.valueMton, currentLanguage, 0);
    if (captionForLayout.kind === "baseline") {
      return t("nation.story.bathtub.baselineCaption", {
        year: captionForLayout.year,
        value,
      });
    }
    return t("nation.story.bathtub.rangeCaption", {
      fromYear: captionForLayout.fromYear,
      toYear: captionForLayout.toYear,
      value,
    });
  })();

  const tubCaption: TubCaption = {
    value: `${formatMton(current.cumulativeMton, currentLanguage, 0)} ${t("nation.story.unit.mtonCo2e")}`,
  };

  return (
    <section
      ref={ref}
      data-story-section
      data-story-chapter="bathtub"
      data-story-step={displayedIndex}
      data-story-steps={stepCount}
      data-story-snap="round"
      data-story-step-vh={BATHTUB_STEP_VH}
      data-story-enter-vh={BATHTUB_ENTER_VH}
      className="relative"
      style={{ height: `${sectionVh}vh` }}
    >
      <div
        className="h-[100svh] min-h-0 flex flex-col justify-center px-4 md:px-8 pt-[var(--story-stage-pad-top)] pb-[var(--story-stage-pad-bottom)] md:pt-8 story-compact:pt-6 md:pb-8 story-compact:pb-6 lg:pt-10 lg:pb-10 xl:pt-8 xl:pb-8 overflow-hidden"
        style={stageStyle}
      >
        <div
          className="mx-auto flex w-full max-w-3xl shrink-0 flex-col gap-2 max-md:gap-1.5 story-short:gap-1 md:gap-2.5 lg:gap-3"
          style={{
            opacity: enterOpacity,
            transform: `translateY(${(1 - enterT) * 24}px) scale(${0.94 + 0.06 * enterT})`,
            transformOrigin: "50% 50%",
          }}
        >
          {/* Copy above the tub on all breakpoints */}
          <div className="max-w-2xl mx-auto shrink-0 text-center space-y-1 max-md:space-y-0.5 story-short:space-y-0.5 md:space-y-2 lg:space-y-2.5">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.4 }}
              className={`${NATION_STORY_TYPE.title} text-white`}
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
              {t("nation.story.bathtub.text")}{" "}
              {t(
                isMobile
                  ? "nation.story.bathtub.swipeCta"
                  : "nation.story.bathtub.scrollCta",
              )}
            </motion.p>
          </div>

          <div className="flex max-md:flex-none md:flex-none md:py-0">
            <TubGraphic
              idPrefix={idPrefix}
              waterTop={waterTop}
              caption={tubCaption}
              compact={isMobile}
              className="w-full max-w-[18rem] story-short:max-w-[15rem] md:max-w-sm story-compact:max-w-[17rem] lg:max-w-md mx-auto h-auto max-h-[22svh] story-short:max-h-[18svh] md:max-h-[20svh] story-compact:max-h-[19svh] lg:max-h-[24svh] xl:max-h-[26svh]"
            />
          </div>

          {periodCaption && (
            <div
              className={`shrink-0 text-center ${isFinalStep ? "invisible" : ""}`}
              aria-hidden={isFinalStep}
            >
              <p className="sr-only">{tubCaption.value}</p>
              <motion.p
                key={periodCaption}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${NATION_STORY_TYPE.meta} ${NATION_STORY_TEXT.secondary}`}
              >
                {periodCaption}
              </motion.p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/** Tighter crop for recap cards – keeps faucet + claw feet after TUB_ZOOM. */
const TUB_RECAP_VIEWBOX = "16 8 488 254";

/** Full tub snapshot for the conclusion recap (final scroll step). */
export function BathtubRecapGraphic({
  cumulativeMton,
  className,
  cropped = false,
}: {
  cumulativeMton: number;
  className?: string;
  cropped?: boolean;
}) {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const idPrefix = `tub-recap-${useId().replace(/:/g, "")}`;
  const tubCaption: TubCaption = {
    value: `${formatMton(cumulativeMton, currentLanguage, 0)} ${t("nation.story.unit.mtonCo2e")}`,
  };

  return (
    <TubGraphic
      idPrefix={idPrefix}
      waterTop={TUB_WATER_TOP}
      caption={tubCaption}
      compact
      static
      viewBox={cropped ? TUB_RECAP_VIEWBOX : undefined}
      className={className}
    />
  );
}
