import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { animate, motion, useReducedMotion } from "framer-motion";
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

const OUTER_GROW_TRANSITION = {
  type: "spring" as const,
  stiffness: 42,
  damping: 20,
  mass: 1,
  delay: PINK_MAP_REVEAL_DELAY_S,
};

/** Pink callout trails the map expansion slightly. */
const PINK_CALLOUT_FADE = {
  duration: 0.45,
  delay: PINK_MAP_REVEAL_DELAY_S + 0.12,
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

type StatCalloutProps = {
  label: string;
  value: string;
  unitShort: string;
  unitLong: string;
  colorClass: string;
  className?: string;
};

function StatCallout({
  label,
  value,
  unitShort,
  unitLong,
  colorClass,
  className,
}: StatCalloutProps) {
  return (
    <div className={`min-w-0 ${className ?? ""}`}>
      <div className="md:hidden flex flex-col items-center text-center px-0.5">
        <p className={`${NATION_STORY_TYPE.display} ${colorClass}`}>{value}</p>
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

      <div className="hidden md:block text-center">
        <p
          className={`${NATION_STORY_TYPE.meta} ${NATION_STORY_TEXT.secondary} mb-1`}
        >
          {label}
        </p>
        <p
          className={`${NATION_STORY_TYPE.display} leading-none ${colorClass}`}
        >
          {value}{" "}
          <span
            className={`${NATION_STORY_TYPE.meta} ${NATION_STORY_TEXT.secondary} font-normal align-baseline whitespace-nowrap`}
          >
            {unitLong}
          </span>
        </p>
      </div>
    </div>
  );
}

type DelayedStatCalloutProps = StatCalloutProps & {
  reducedMotion: boolean | null;
};

function DelayedStatCallout({
  reducedMotion,
  className,
  ...props
}: DelayedStatCalloutProps) {
  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reducedMotion ? { duration: 0 } : PINK_CALLOUT_FADE}
    >
      <StatCallout {...props} />
    </motion.div>
  );
}

/**
 * Hero visual: a smaller orange Sweden (what we usually discuss) nested inside
 * a larger pink silhouette (the full picture). The pink ring between them is
 * the emissions gap the story unpacks.
 */
export function NationIntroPunch({ metrics }: NationIntroPunchProps) {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const reducedMotion = useReducedMotion();

  const reportedValue = metrics.territorialLatestMton;
  const fullValue = Math.max(metrics.combinedLatestMton, reportedValue);
  const reported = formatMton(reportedValue, currentLanguage, 0);
  const full = formatMton(fullValue, currentLanguage, 0);
  const fillRatio = reportedValue / fullValue;
  const innerScale = Math.sqrt(fillRatio);
  const unitShort = t("nation.story.unit.mtonCo2e");
  const unitLong = t("nation.story.unit.millionTco2e");

  const [outerScale, setOuterScale] = useState(() => (reducedMotion ? 1 : 0));

  useEffect(() => {
    if (reducedMotion) {
      setOuterScale(1);
      return;
    }
    setOuterScale(0);
    const controls = animate(0, 1, {
      ...OUTER_GROW_TRANSITION,
      onUpdate: (value) => setOuterScale(value),
    });
    return () => controls.stop();
  }, [reducedMotion]);

  return (
    <div className="mx-auto flex w-fit max-w-full flex-col items-center justify-center gap-2 max-md:gap-1.5 story-short:gap-1 md:flex-row md:items-center md:gap-10 lg:gap-14">
      <div className="relative h-[clamp(130px,24svh,280px)] story-short:h-[clamp(110px,20svh,200px)] md:h-[clamp(260px,44svh,460px)] aspect-[100/220]">
        <svg
          viewBox={SWEDEN_OUTLINE_VIEWBOX}
          className="h-full w-auto max-w-full mx-auto block"
          role="img"
          aria-label={`${reported}–${full} ${unitLong}`}
        >
          <SwedenSilhouette
            scale={outerScale}
            fill={NATION_STORY_COLORS.consumption}
          />
          <SwedenSilhouette
            scale={innerScale}
            fill={NATION_STORY_COLORS.territorial}
            nudgeX={INNER_MAP_NUDGE_X}
          />
        </svg>
      </div>

      <div className="grid grid-cols-2 gap-x-3 md:flex md:w-auto md:flex-col md:items-center md:gap-10 w-full max-w-[20rem] md:max-w-none mx-auto">
        <StatCallout
          label={t("nation.story.intro.usualLabel")}
          value={reported}
          unitShort={unitShort}
          unitLong={unitLong}
          colorClass="text-orange-3"
          className="order-1"
        />
        <DelayedStatCallout
          reducedMotion={reducedMotion}
          label={t("nation.story.intro.fullLabel")}
          value={full}
          unitShort={unitShort}
          unitLong={unitLong}
          colorClass="text-pink-3"
          className="order-2"
        />
      </div>
    </div>
  );
}
