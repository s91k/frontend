import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import {
  formatMton,
  type NationStoryMetrics,
} from "@/utils/data/nationStoryMetrics";
import { useLanguage } from "@/components/LanguageProvider";
import {
  NATION_STORY_COLORS,
  NATION_STORY_TEXT,
  NATION_STORY_TYPE,
} from "@/components/nation/story/nationStoryColors";
import {
  SWEDEN_OUTLINE_PATH,
  SWEDEN_OUTLINE_VIEWBOX,
  swedenOutlineScaleMatrix,
} from "@/components/nation/story/swedenOutlinePath";

type NationIntroPunchProps = {
  metrics: NationStoryMetrics;
};

/** Pink map grows out from the orange core shortly after mount. */
const PINK_MAP_REVEAL_DELAY_S = 0.35;

const PINK_REVEAL_TRANSITION = {
  type: "spring" as const,
  stiffness: 42,
  damping: 20,
  mass: 1,
  delay: PINK_MAP_REVEAL_DELAY_S,
};

/** Visual nudge – the silhouette reads right-heavy when nested at bbox centre. */
const INNER_MAP_NUDGE_X = -7;

type SwedenSilhouetteProps = {
  scale: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  nudgeX?: number;
  nudgeY?: number;
};

/** Scale the path around the silhouette centre via a single matrix on the path. */
function SwedenSilhouette({
  scale,
  fill,
  stroke,
  strokeWidth = 0,
  opacity = 1,
  nudgeX = 0,
  nudgeY = 0,
}: SwedenSilhouetteProps) {
  return (
    <path
      d={SWEDEN_OUTLINE_PATH}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      opacity={opacity}
      transform={swedenOutlineScaleMatrix(scale, nudgeX, nudgeY)}
    />
  );
}

type AnimatedPinkSilhouetteProps = {
  progress: MotionValue<number>;
  fill: string;
};

/** Pink map scale – SVG attribute updates without React re-renders per frame. */
function AnimatedPinkSilhouette({ progress, fill }: AnimatedPinkSilhouetteProps) {
  const ref = useRef<SVGPathElement>(null);

  const applyTransform = (scale: number) => {
    ref.current?.setAttribute("transform", swedenOutlineScaleMatrix(scale));
  };

  useMotionValueEvent(progress, "change", applyTransform);

  useEffect(() => {
    applyTransform(progress.get());
  }, [progress]);

  return <path ref={ref} d={SWEDEN_OUTLINE_PATH} fill={fill} />;
}

type IntroSwedenMapsProps = {
  pinkProgress: MotionValue<number>;
  innerScale: number;
  reported: string;
  full: string;
  unitLong: string;
};

function IntroSwedenMaps({
  pinkProgress,
  innerScale,
  reported,
  full,
  unitLong,
}: IntroSwedenMapsProps) {
  return (
    <div className="relative h-[clamp(130px,24svh,280px)] story-short:h-[clamp(110px,20svh,200px)] md:h-[clamp(260px,44svh,460px)] aspect-[100/220] shrink-0">
      <svg
        viewBox={SWEDEN_OUTLINE_VIEWBOX}
        className="h-full w-auto max-w-full mx-auto md:mx-0 block"
        role="img"
        aria-label={`${reported}–${full} ${unitLong}`}
      >
        <AnimatedPinkSilhouette
          progress={pinkProgress}
          fill={NATION_STORY_COLORS.consumption}
        />
        <SwedenSilhouette
          scale={innerScale}
          fill={NATION_STORY_COLORS.territorial}
          nudgeX={INNER_MAP_NUDGE_X}
        />
      </svg>
    </div>
  );
}

type StatCalloutProps = {
  label: string;
  value: string;
  /** Invisible width anchor so counting digits do not shift sibling layout */
  reservedValue?: string;
  unitShort: string;
  unitLong: string;
  colorClass: string;
  className?: string;
};

function StableStatValue({
  value,
  reservedValue,
  className,
}: {
  value: string;
  reservedValue: string;
  className: string;
}) {
  return (
    <span className={`inline-grid ${className}`}>
      <span
        className="col-start-1 row-start-1 invisible pointer-events-none select-none"
        aria-hidden="true"
      >
        {reservedValue}
      </span>
      <span className="col-start-1 row-start-1">{value}</span>
    </span>
  );
}

function StatCallout({
  label,
  value,
  reservedValue,
  unitShort,
  unitLong,
  colorClass,
  className,
}: StatCalloutProps) {
  const widthAnchor = reservedValue ?? value;

  return (
    <div className={`min-w-0 ${className ?? ""}`}>
      <div className="md:hidden flex flex-col items-center text-center px-0.5">
        <p className={`${NATION_STORY_TYPE.display} ${colorClass}`}>
          <StableStatValue
            value={value}
            reservedValue={widthAnchor}
            className="justify-items-center"
          />
        </p>
        <p
          className={`${NATION_STORY_TYPE.meta} ${NATION_STORY_TEXT.secondary} mt-1 story-short:mt-0.5`}
        >
          {unitShort}
        </p>
        <p
          className={`${NATION_STORY_TYPE.meta} leading-snug ${NATION_STORY_TEXT.secondary} mt-2 story-short:mt-1 max-w-[9.25rem]`}
        >
          {label}
        </p>
      </div>

      <div className="hidden md:block text-left">
        <p
          className={`${NATION_STORY_TYPE.meta} ${NATION_STORY_TEXT.secondary} mb-1`}
        >
          {label}
        </p>
        <p
          className={`${NATION_STORY_TYPE.display} leading-none ${colorClass} flex items-baseline gap-x-1.5`}
        >
          <StableStatValue
            value={value}
            reservedValue={widthAnchor}
            className="justify-items-start"
          />
          <span
            className={`${NATION_STORY_TYPE.meta} ${NATION_STORY_TEXT.secondary} font-normal whitespace-nowrap`}
          >
            {unitLong}
          </span>
        </p>
      </div>
    </div>
  );
}

type PinkStatCalloutProps = {
  label: string;
  unitShort: string;
  unitLong: string;
  colorClass: string;
  className?: string;
  /** 0–1, shared with the pink map scale animation */
  progress: MotionValue<number>;
  targetMton: number;
  reducedMotion: boolean | null;
};

function PinkStatCallout({
  label,
  unitShort,
  unitLong,
  colorClass,
  className,
  progress,
  targetMton,
  reducedMotion,
}: PinkStatCalloutProps) {
  const { currentLanguage } = useLanguage();
  const reservedValue = formatMton(targetMton, currentLanguage, 0);
  const [value, setValue] = useState(() =>
    formatMton(0, currentLanguage, 0),
  );
  const lastRoundedRef = useRef(-1);

  useMotionValueEvent(progress, "change", (p) => {
    const rounded = Math.round(p * targetMton);
    if (rounded === lastRoundedRef.current) return;
    lastRoundedRef.current = rounded;
    setValue(formatMton(rounded, currentLanguage, 0));
  });

  useEffect(() => {
    if (!reducedMotion) return;
    lastRoundedRef.current = Math.round(targetMton);
    setValue(formatMton(targetMton, currentLanguage, 0));
  }, [reducedMotion, targetMton, currentLanguage]);

  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        reducedMotion
          ? { duration: 0 }
          : { delay: PINK_MAP_REVEAL_DELAY_S, duration: 0.25 }
      }
    >
      <StatCallout
        label={label}
        value={value}
        reservedValue={reservedValue}
        unitShort={unitShort}
        unitLong={unitLong}
        colorClass={colorClass}
      />
    </motion.div>
  );
}

type IntroPunchContent = {
  pinkProgress: MotionValue<number>;
  reducedMotion: boolean | null;
  innerScale: number;
  reported: string;
  full: string;
  fullValue: number;
  unitShort: string;
  unitLong: string;
  usualLabel: string;
  fullLabel: string;
};

function IntroStatCallouts({
  className,
  ...content
}: IntroPunchContent & { className?: string }) {
  const {
    pinkProgress,
    reducedMotion,
    reported,
    full,
    fullValue,
    unitShort,
    unitLong,
    usualLabel,
    fullLabel,
  } = content;

  return (
    <div
      className={`grid w-full max-w-[20rem] grid-cols-2 gap-x-3 md:flex md:w-auto md:max-w-none md:flex-col md:items-start md:gap-5 lg:gap-6 ${className ?? ""}`}
    >
      <StatCallout
        label={usualLabel}
        value={reported}
        reservedValue={reported}
        unitShort={unitShort}
        unitLong={unitLong}
        colorClass="text-orange-3"
        className="order-1"
      />
      <PinkStatCallout
        reducedMotion={reducedMotion}
        progress={pinkProgress}
        targetMton={fullValue}
        label={fullLabel}
        unitShort={unitShort}
        unitLong={unitLong}
        colorClass="text-pink-3"
        className="order-2"
      />
    </div>
  );
}

function useIntroPunchContent(metrics: NationStoryMetrics): IntroPunchContent {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const reducedMotion = useReducedMotion();

  const reportedValue = metrics.territorialLatestMton;
  const fullValue = Math.max(metrics.combinedLatestMton, reportedValue);
  const reported = formatMton(reportedValue, currentLanguage, 0);
  const full = formatMton(fullValue, currentLanguage, 0);
  const fillRatio = reportedValue / fullValue;
  const innerScale = Math.sqrt(fillRatio);
  const pinkProgress = useMotionValue(reducedMotion ? 1 : 0);

  useEffect(() => {
    if (reducedMotion === null) return;
    if (reducedMotion) {
      pinkProgress.set(1);
      return;
    }
    pinkProgress.set(0);
    const controls = animate(pinkProgress, 1, PINK_REVEAL_TRANSITION);
    return () => controls.stop();
  }, [reducedMotion, pinkProgress]);

  return {
    pinkProgress,
    reducedMotion,
    innerScale,
    reported,
    full,
    fullValue,
    unitShort: t("nation.story.unit.mtonCo2e"),
    unitLong: t("nation.story.unit.millionTco2e"),
    usualLabel: t("nation.story.intro.usualLabel"),
    fullLabel: t("nation.story.intro.fullLabel"),
  };
}

/**
 * Hero visual: a smaller orange Sweden (what we usually discuss) nested inside
 * a larger pink silhouette (the full picture). The pink ring between them is
 * the emissions gap the story unpacks.
 */
export function NationIntroPunch({ metrics }: NationIntroPunchProps) {
  const content = useIntroPunchContent(metrics);

  return (
    <div className="mx-auto grid max-w-full grid-cols-1 justify-items-center gap-2 max-md:gap-1.5 story-short:gap-1">
      <IntroSwedenMaps
        pinkProgress={content.pinkProgress}
        innerScale={content.innerScale}
        reported={content.reported}
        full={content.full}
        unitLong={content.unitLong}
      />
      <IntroStatCallouts {...content} />
    </div>
  );
}

/** Intro hero: stacked on mobile; centered title/body with map + stats side by side on desktop. */
export function NationIntroHero({ metrics }: NationIntroPunchProps) {
  const { t } = useTranslation();
  const content = useIntroPunchContent(metrics);
  const title = t("nation.story.intro.title");
  const paragraph = t("nation.story.intro.paragraph1");

  return (
    <div className="relative w-full max-w-5xl mx-auto shrink-0 md:max-w-6xl">
      <div className="text-center space-y-1.5 max-md:space-y-1 story-short:space-y-0.5 md:hidden">
        <h1 className={`${NATION_STORY_TYPE.heroTitle} text-white`}>{title}</h1>
        <p
          className={`${NATION_STORY_TYPE.body} ${NATION_STORY_TEXT.body} max-w-2xl mx-auto`}
        >
          {paragraph}
        </p>
        <div className="pt-2 max-md:pt-1.5 story-short:pt-1">
          <div className="mx-auto grid max-w-full grid-cols-1 justify-items-center gap-2 max-md:gap-1.5 story-short:gap-1">
            <IntroSwedenMaps
              pinkProgress={content.pinkProgress}
              innerScale={content.innerScale}
              reported={content.reported}
              full={content.full}
              unitLong={content.unitLong}
            />
            <IntroStatCallouts {...content} />
          </div>
        </div>
      </div>

      <div className="hidden md:block text-center space-y-4">
        <h1 className={`${NATION_STORY_TYPE.heroTitle} text-white`}>{title}</h1>
        <p
          className={`${NATION_STORY_TYPE.body} ${NATION_STORY_TEXT.body} max-w-2xl mx-auto`}
        >
          {paragraph}
        </p>
        <div className="mx-auto flex w-fit max-w-full items-center gap-5 pt-6 lg:gap-10 lg:pt-10">
          <IntroSwedenMaps
            pinkProgress={content.pinkProgress}
            innerScale={content.innerScale}
            reported={content.reported}
            full={content.full}
            unitLong={content.unitLong}
          />
          <IntroStatCallouts {...content} />
        </div>
      </div>
    </div>
  );
}
