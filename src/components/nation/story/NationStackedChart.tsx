import { FC, useMemo } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  formatMton,
  NATION_BASELINE_YEAR,
  type NationStackDataPoint,
} from "@/utils/data/nationStoryMetrics";
import { useLanguage } from "@/components/LanguageProvider";
import { useScreenSize } from "@/hooks/useScreenSize";
import { ChartTooltip, getXAxisProps } from "@/components/charts";
import {
  NATION_STORY_CHART,
  NATION_STORY_COLORS,
  NATION_STORY_TEXT,
  NATION_STORY_TYPE,
} from "@/components/nation/story/nationStoryColors";
import { usePinnedSteps } from "@/components/nation/story/usePinnedSteps";

/** Story chart needs room for Y ticks; shared chart margins are negative and clip them. */
function getStoryChartMargin(isMobile: boolean) {
  return {
    top: 8,
    right: isMobile ? 4 : 12,
    left: isMobile ? 4 : 20,
    bottom: 0,
  };
}

const LAYERS = [
  {
    dataKey: "territorialFossil" as const,
    color: NATION_STORY_COLORS.territorial,
    translationKey: "nation.story.graph.territorialFossil",
    captionKey: "nation.story.stacked.layerCaption1",
  },
  {
    dataKey: "productionBeyondTerritorial" as const,
    color: NATION_STORY_COLORS.production,
    translationKey: "nation.story.graph.productionBeyondTerritorial",
    captionKey: "nation.story.stacked.layerCaption2",
  },
  {
    dataKey: "consumptionAbroad" as const,
    color: NATION_STORY_COLORS.consumption,
    translationKey: "nation.story.graph.consumptionAbroad",
    captionKey: "nation.story.stacked.layerCaption3",
  },
  {
    dataKey: "biogenic" as const,
    color: NATION_STORY_COLORS.biogenic,
    translationKey: "nation.story.graph.biogenic",
    captionKey: "nation.story.stacked.layerCaption4",
  },
];

interface NationStackedChartProps {
  data: NationStackDataPoint[];
  className?: string;
}

export const NationStackedChart: FC<NationStackedChartProps> = ({
  data,
  className,
}) => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const { isMobile } = useScreenSize();
  const latestYear = data.at(-1)?.year ?? NATION_BASELINE_YEAR;
  const xAxisTicks = useMemo(() => {
    const ticks = [1990, 2000, 2010, 2020];
    if (latestYear > 2020) ticks.push(latestYear);
    return ticks;
  }, [latestYear]);

  // Scroll-driven: each step reveals one more area layer.
  const { ref, step, sectionVh, stageStyle } = usePinnedSteps(LAYERS.length);
  const visibleLayers = step + 1;

  const latestPoint = data.at(-1);
  const chartHeight = isMobile ? 190 : 330;

  return (
    <section
      ref={ref}
      data-story-section
      data-story-step={step}
      data-story-steps={LAYERS.length}
      data-story-step-vh={90}
      className="relative"
      style={{ height: `${sectionVh}vh` }}
    >
      <div
        className="h-[100svh] flex items-center px-4 md:px-8 py-3 md:py-0 overflow-hidden"
        style={stageStyle}
      >
        {/* Same depth backdrop as the hero and journey chapters */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_45%,var(--black-2)_0%,var(--black-3)_78%)]"
        />
        <div className={`relative w-full max-w-4xl mx-auto ${className ?? ""}`}>
          <p
            className={`${NATION_STORY_TYPE.eyebrow} ${NATION_STORY_TEXT.eyebrow} mb-2 md:mb-3`}
          >
            {t("nation.story.stacked.layerCounter", {
              current: visibleLayers,
              total: LAYERS.length,
            })}
          </p>
          <h2 className={`${NATION_STORY_TYPE.title} text-white mb-2 md:mb-4`}>
            {t("nation.story.stacked.title")}
          </h2>

          {/* Caption explaining the layer currently being drawn */}
          <div className="min-h-[2rem] md:min-h-[2.5rem] mb-2 md:mb-4">
            <motion.p
              key={visibleLayers}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={`flex items-center gap-2 md:gap-3 ${NATION_STORY_TYPE.emphasis} text-white`}
            >
              <span
                className="w-3 h-3 md:w-4 md:h-4 rounded-full shrink-0"
                style={{ backgroundColor: LAYERS[visibleLayers - 1].color }}
              />
              {t(LAYERS[visibleLayers - 1].captionKey)}
            </motion.p>
          </div>

          <div style={{ width: "100%", height: chartHeight }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={getStoryChartMargin(isMobile)}>
                <XAxis
                  {...getXAxisProps(
                    "year",
                    [NATION_BASELINE_YEAR, latestYear],
                    xAxisTicks,
                  )}
                />
                <YAxis
                  stroke="var(--grey)"
                  tickLine={false}
                  axisLine={false}
                  width={isMobile ? 36 : 56}
                  tick={{ fill: "var(--grey)", fontSize: isMobile ? 10 : 12 }}
                  tickFormatter={(value: number) =>
                    formatMton(value, currentLanguage, 0)
                  }
                  domain={[0, "auto"]}
                  {...(!isMobile
                    ? {
                        label: {
                          value: t("nation.story.unit.mton"),
                          angle: -90,
                          position: "insideLeft" as const,
                          style: {
                            fill: "var(--grey)",
                            fontSize: 12,
                            textAnchor: "middle",
                          },
                        },
                      }
                    : {})}
                />
                <Tooltip
                  content={
                    <ChartTooltip
                      unit={t("nation.story.unit.mton")}
                      customFormatter={(value) =>
                        formatMton(value, currentLanguage, 1)
                      }
                    />
                  }
                  wrapperStyle={{ outline: "none", zIndex: 60 }}
                />
                {LAYERS.slice(0, visibleLayers).map((layer) => (
                  <Area
                    key={layer.dataKey}
                    type="monotone"
                    dataKey={layer.dataKey}
                    stackId="emissions"
                    stroke={layer.color}
                    strokeWidth={NATION_STORY_CHART.strokeWidth}
                    fill={layer.color}
                    fillOpacity={NATION_STORY_CHART.fillOpacity}
                    name={t(layer.translationKey)}
                    connectNulls={false}
                    isAnimationActive
                    animationDuration={1000}
                    animationEasing="ease-out"
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Legend in the story's own styling: revealed layers inline,
              each with its latest-year contribution */}
          <div className="mt-3 md:mt-5 border-t border-white/10 pt-2.5 md:pt-3 space-y-1.5 md:space-y-2">
            <div className="flex flex-wrap items-center gap-x-5 md:gap-x-8 gap-y-1.5">
              {LAYERS.slice(0, visibleLayers).map((layer) => (
                <motion.span
                  key={layer.dataKey}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.1 }}
                  className={`flex items-center gap-2 md:gap-2.5 ${NATION_STORY_TYPE.meta}`}
                >
                  <span
                    className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 rounded-full shrink-0"
                    style={{ backgroundColor: layer.color }}
                  />
                  <span className={NATION_STORY_TEXT.secondary}>
                    {t(layer.translationKey)}
                  </span>
                  <span className="text-white tabular-nums">
                    {formatMton(
                      latestPoint?.[layer.dataKey] ?? 0,
                      currentLanguage,
                      0,
                    )}{" "}
                    {t("nation.story.unit.mton")}
                  </span>
                </motion.span>
              ))}
            </div>
            <p
              className={`${NATION_STORY_TYPE.meta} ${NATION_STORY_TEXT.secondary}`}
            >
              {t("nation.story.journey.dataYear", { year: latestYear })}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
