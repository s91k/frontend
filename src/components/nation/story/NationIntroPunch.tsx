import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, useInView, useReducedMotion } from "framer-motion";
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
} from "@/components/nation/story/swedenOutlinePath";

type NationIntroPunchProps = {
  metrics: NationStoryMetrics;
};

/** Silhouette center for uniform scale transforms inside the viewBox. */
const MAP_CENTER_X = 50;
const MAP_CENTER_Y = 110;

const OUTER_GROW_SPRING = {
  type: "spring" as const,
  stiffness: 42,
  damping: 20,
  mass: 1,
};

type StatCalloutProps = {
  label: string;
  value: string;
  /** Compact unit for mobile (e.g. "Mton") */
  unitShort: string;
  /** Written-out unit for desktop (e.g. "miljoner ton") */
  unitLong: string;
  colorClass: string;
  delay: number;
  className?: string;
};

function StatCallout({
  label,
  value,
  unitShort,
  unitLong,
  colorClass,
  delay,
  className,
}: StatCalloutProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, delay }}
      className={`min-w-0 ${className ?? ""}`}
    >
      {/* Mobile: big number on top so both columns share a baseline */}
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

      {/* Desktop: label above value; orange callout stacks above pink */}
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
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInView = useInView(mapRef, { once: true, amount: 0.15 });

  const reportedValue = metrics.territorialLatestMton;
  const fullValue = Math.max(metrics.combinedLatestMton, reportedValue);
  const reported = formatMton(reportedValue, currentLanguage, 0);
  const full = formatMton(fullValue, currentLanguage, 0);
  const fillRatio = reportedValue / fullValue;
  /** Area-proportional inner map – territorial share inside the full silhouette. */
  const innerScale = Math.sqrt(fillRatio);
  const unitShort = t("nation.story.unit.mtonCo2e");
  const unitLong = t("nation.story.unit.millionTco2e");

  const mapShown = reducedMotion || mapInView;
  const outerScale = mapShown ? 1 : innerScale;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45 }}
      className="mx-auto flex w-fit max-w-full flex-col items-center justify-center gap-2 max-md:gap-1.5 story-short:gap-1 md:flex-row md:items-center md:gap-10 lg:gap-14"
    >
      <div
        ref={mapRef}
        className="relative h-[clamp(130px,24svh,280px)] story-short:h-[clamp(110px,20svh,200px)] md:h-[clamp(260px,44svh,460px)] aspect-[100/220]"
      >
        <svg
          viewBox={SWEDEN_OUTLINE_VIEWBOX}
          className="h-full w-auto max-w-full mx-auto"
          role="img"
          aria-label={`${reported}–${full} ${unitLong}`}
        >
          {/* Full picture – pink grows out from the orange core */}
          <motion.g
            style={{
              transformOrigin: `${MAP_CENTER_X}px ${MAP_CENTER_Y}px`,
              transformBox: "fill-box",
            }}
            initial={{ scale: innerScale }}
            animate={{ scale: outerScale }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : { ...OUTER_GROW_SPRING, delay: 0.2 }
            }
          >
            <path
              d={SWEDEN_OUTLINE_PATH}
              fill={NATION_STORY_COLORS.consumption}
              stroke={NATION_STORY_COLORS.consumption}
              strokeWidth={2}
            />
          </motion.g>

          {/* Territorial share – smaller orange map at the centre */}
          <motion.g
            style={{
              transformOrigin: `${MAP_CENTER_X}px ${MAP_CENTER_Y}px`,
              transformBox: "fill-box",
            }}
            initial={{ scale: 0.88 * innerScale, opacity: 0 }}
            animate={{
              scale: innerScale,
              opacity: mapShown ? 1 : 0,
            }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 55, damping: 18, delay: 0.05 }
            }
          >
            <path
              d={SWEDEN_OUTLINE_PATH}
              fill={NATION_STORY_COLORS.territorial}
              stroke={NATION_STORY_COLORS.territorial}
              strokeWidth={1.5}
            />
          </motion.g>
        </svg>
      </div>

      <div className="grid grid-cols-2 gap-x-3 md:flex md:w-auto md:flex-col md:items-center md:gap-10 w-full max-w-[20rem] md:max-w-none mx-auto">
        <StatCallout
          label={t("nation.story.intro.usualLabel")}
          value={reported}
          unitShort={unitShort}
          unitLong={unitLong}
          colorClass="text-orange-3"
          delay={0.15}
          className="order-1"
        />
        <StatCallout
          label={t("nation.story.intro.fullLabel")}
          value={full}
          unitShort={unitShort}
          unitLong={unitLong}
          colorClass="text-pink-3"
          delay={0.3}
          className="order-2"
        />
      </div>
    </motion.div>
  );
}
