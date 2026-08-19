import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";
import { BathtubRecapGraphic } from "@/components/nation/story/NationBathtub";
import {
  NATION_STORY_CHART,
  NATION_STORY_COLORS,
  NATION_STORY_TYPE,
} from "@/components/nation/story/nationStoryColors";
import { useLanguage } from "@/components/LanguageProvider";
import { useScreenSize } from "@/hooks/useScreenSize";
import {
  createMirroredYAxisTick,
  getStoryChartMargin,
  STORY_Y_AXIS_WIDTH,
  StoryChartYAxisUnit,
} from "@/components/nation/story/storyChartAxis";
import {
  formatMton,
  NATION_BASELINE_YEAR,
  type NationStoryMetrics,
} from "@/utils/data/nationStoryMetrics";

const E_COMMERCE_MTON = 0.326;

const CHART_LAYERS = [
  {
    dataKey: "territorialFossil" as const,
    color: NATION_STORY_COLORS.territorial,
  },
  {
    dataKey: "productionBeyondTerritorial" as const,
    color: NATION_STORY_COLORS.production,
  },
  {
    dataKey: "consumptionAbroad" as const,
    color: NATION_STORY_COLORS.consumption,
  },
  { dataKey: "biogenic" as const, color: NATION_STORY_COLORS.biogenic },
];

const RECAP_ONION_DIAMETER = 168;
const RECAP_VISUAL_HEIGHT =
  "h-[13rem] story-short:h-[12rem] md:h-[11.5rem] story-compact:md:h-[10.5rem] lg:h-[13rem]";
const ONION_RECAP_MOBILE_SIZE_FACTOR = 1.12;
const ONION_RECAP_DESKTOP_SIZE_FACTOR = 1;

const RECAP_HEADLINE_CLASS = `${NATION_STORY_TYPE.emphasis} text-white w-full`;
const RECAP_HEADLINE_ROW_MOBILE =
  "flex items-start justify-center px-1 text-center";
const RECAP_HEADLINE_ROW_DESKTOP =
  "flex min-h-[3.75rem] lg:min-h-[4.25rem] items-start justify-center px-1 text-center";

type RecapItem = {
  key: string;
  headline: string;
  delay: number;
  visual: React.ReactNode;
  mobileVisualClassName?: string;
  /** Desktop-only horizontal nudge on the visual slot. */
  desktopVisualClassName?: string;
};

function OnionRecapSnapshot({
  metrics,
  sizeFactor = 1,
}: {
  metrics: NationStoryMetrics;
  sizeFactor?: number;
}) {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [diameter, setDiameter] = useState(RECAP_ONION_DIAMETER);

  useEffect(() => {
    const slot = containerRef.current;
    if (!slot) return;

    const update = () => {
      const base = Math.min(slot.clientWidth, slot.clientHeight);
      const next = base * sizeFactor;
      if (next > 0) setDiameter(next);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(slot);
    return () => observer.disconnect();
  }, [sizeFactor]);

  const { layers, total } = useMemo(() => {
    const territorial = metrics.territorialLatestMton;
    const production = metrics.productionLatestMton;
    const consumption = metrics.consumptionLatestMton;
    const biogenic = metrics.biogenicLatestMton;

    const steps = [
      {
        key: "step1",
        color: NATION_STORY_COLORS.territorial,
        total: territorial,
      },
      {
        key: "step2",
        color: NATION_STORY_COLORS.production,
        total: production,
      },
      {
        key: "step3",
        color: NATION_STORY_COLORS.consumption,
        total: production + consumption,
      },
      {
        key: "step4",
        color: NATION_STORY_COLORS.eCommerce,
        total: production + consumption + E_COMMERCE_MTON,
      },
      {
        key: "step5",
        color: NATION_STORY_COLORS.biogenic,
        total: production + consumption + E_COMMERCE_MTON + biogenic,
      },
    ];

    const maxTotal = steps[steps.length - 1].total;
    const diameterFor = (value: number) =>
      Math.sqrt(value / maxTotal) * diameter;

    const minRingGrowth = (10 / RECAP_ONION_DIAMETER) * diameter;
    const layerDiameters = new Map<string, number>();
    let previous = 0;
    for (const step of steps) {
      const diameter = Math.max(
        diameterFor(step.total),
        previous + minRingGrowth,
      );
      layerDiameters.set(step.key, diameter);
      previous = diameter;
    }

    return {
      total: steps[steps.length - 1].total,
      layers: steps
        .slice()
        .sort((a, b) => b.total - a.total)
        .map((step) => ({
          key: step.key,
          color: step.color,
          diameter: layerDiameters.get(step.key) ?? 0,
        })),
    };
  }, [metrics, diameter]);

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full items-start justify-center"
    >
      <div
        className="relative shrink-0"
        style={{ width: diameter, height: diameter }}
        aria-hidden
      >
        <div
          className="absolute left-1/2 top-1/2 rounded-full blur-2xl"
          style={{
            width: diameter * 1.25,
            height: diameter * 1.25,
            transform: "translate(-50%, -50%)",
            backgroundColor: NATION_STORY_COLORS.biogenic,
            opacity: 0.14,
          }}
        />
        {layers.map((layer) => (
          <div
            key={layer.key}
            className="absolute left-1/2 top-1/2 rounded-full"
            style={{
              width: layer.diameter,
              height: layer.diameter,
              transform: "translate(-50%, -50%)",
              backgroundColor: layer.color,
            }}
          />
        ))}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`${NATION_STORY_TYPE.stat} font-medium tabular-nums leading-none text-center text-black origin-center`}
            style={{
              fontSize: `${Math.max(0.72, Math.min(1.05, diameter / 168))}rem`,
            }}
          >
            {formatMton(total, currentLanguage, 0)}
            <span className="block mt-0.5 text-[0.45em] font-medium">
              {t("nation.story.unit.mton")}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

function ChartRecapSnapshot({ metrics }: { metrics: NationStoryMetrics }) {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const { isMobile } = useScreenSize();
  const latestYear =
    metrics.stackData[metrics.stackData.length - 1]?.year ??
    NATION_BASELINE_YEAR;
  const unitLabel = t("nation.story.unit.mtonCo2e");
  const mirroredYAxisTick = useMemo(
    () => createMirroredYAxisTick(currentLanguage),
    [currentLanguage],
  );
  const xAxisTicks = useMemo(() => {
    const ticks = isMobile
      ? [NATION_BASELINE_YEAR, 2000, 2010]
      : [NATION_BASELINE_YEAR, 2000, 2010];
    if (latestYear > 2020) {
      ticks.push(latestYear);
    } else {
      ticks.push(2020);
    }
    return ticks;
  }, [isMobile, latestYear]);

  const edgeAwareTick = ({
    x,
    y,
    payload,
  }: {
    x: number;
    y: number;
    payload: { value: number };
  }) => {
    const anchor =
      payload.value === NATION_BASELINE_YEAR
        ? "start"
        : payload.value === latestYear
          ? "end"
          : "middle";
    return (
      <text
        x={x}
        y={y + (isMobile ? 10 : 8)}
        textAnchor={anchor}
        fontSize={isMobile ? 10 : 10}
        fill="var(--grey)"
      >
        {payload.value}
      </text>
    );
  };

  return (
    <div className="relative h-full w-full min-h-0">
      <StoryChartYAxisUnit unit={unitLabel} />
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={metrics.stackData}
          margin={getStoryChartMargin(isMobile)}
        >
          <XAxis
            dataKey="year"
            type="number"
            domain={[NATION_BASELINE_YEAR, latestYear]}
            ticks={xAxisTicks}
            tick={edgeAwareTick}
            tickLine={false}
            axisLine={false}
            interval={0}
          />
          {CHART_LAYERS.map((layer, index) => (
            <Area
              key={layer.dataKey}
              type="monotone"
              dataKey={layer.dataKey}
              stackId="emissions"
              stroke={layer.color}
              strokeWidth={NATION_STORY_CHART.strokeWidth}
              fill={layer.color}
              fillOpacity={
                index === CHART_LAYERS.length - 1
                  ? NATION_STORY_CHART.fillOpacity
                  : NATION_STORY_CHART.fillOpacity * 0.8
              }
              connectNulls={false}
              isAnimationActive={false}
            />
          ))}
          <YAxis
            stroke="var(--grey)"
            tickLine={false}
            axisLine={false}
            mirror={isMobile}
            width={isMobile ? 36 : STORY_Y_AXIS_WIDTH}
            tickMargin={isMobile ? undefined : 4}
            tick={
              isMobile
                ? mirroredYAxisTick
                : { fill: "var(--grey)", fontSize: 10 }
            }
            tickFormatter={(value: number) =>
              formatMton(value, currentLanguage, 0)
            }
            domain={[0, "auto"]}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function BathtubRecapSnapshot({ cumulativeMton }: { cumulativeMton: number }) {
  return (
    <div className="flex h-full w-full items-start justify-center">
      <BathtubRecapGraphic
        cumulativeMton={cumulativeMton}
        className="h-full w-auto max-w-full min-w-0"
      />
    </div>
  );
}

type ConclusionStoryRecapProps = {
  metrics: NationStoryMetrics;
};

/** Recap row: final-state onion, chart and bathtub — column on mobile, aligned grid on md+. */
export function ConclusionStoryRecap({ metrics }: ConclusionStoryRecapProps) {
  const { t } = useTranslation();
  const { isMobile } = useScreenSize();
  const cumulativeMton =
    metrics.bathtubData[metrics.bathtubData.length - 1]?.cumulativeMton ?? 0;
  const onionSizeFactor = isMobile
    ? ONION_RECAP_MOBILE_SIZE_FACTOR
    : ONION_RECAP_DESKTOP_SIZE_FACTOR;

  const items: RecapItem[] = [
    {
      key: "onion",
      headline: t("nation.story.conclusion.recap.onionHeadline", {
        year: metrics.latestYear,
      }),
      delay: 0.1,
      mobileVisualClassName: "overflow-visible",
      desktopVisualClassName: "md:translate-x-5 lg:translate-x-6",
      visual: (
        <OnionRecapSnapshot metrics={metrics} sizeFactor={onionSizeFactor} />
      ),
    },
    {
      key: "chart",
      headline: t("nation.story.conclusion.recap.chartHeadline"),
      delay: 0.18,
      visual: <ChartRecapSnapshot metrics={metrics} />,
    },
    {
      key: "bathtub",
      headline: t("nation.story.conclusion.recap.bathtubHeadline"),
      delay: 0.26,
      desktopVisualClassName: "md:translate-x-3 lg:translate-x-4",
      visual: <BathtubRecapSnapshot cumulativeMton={cumulativeMton} />,
    },
  ];

  return (
    <>
      {/* Mobile: stacked sections */}
      <div className="flex flex-col md:hidden w-full max-w-7xl mx-auto px-2">
        {items.map((item) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.45, delay: item.delay }}
            className="flex flex-col gap-2 story-short:gap-1.5 text-center border-b border-white/10 pt-10 pb-16 first:pt-4 story-short:first:pt-3 last:border-b-0 last:pb-10"
          >
            <div className={RECAP_HEADLINE_ROW_MOBILE}>
              <p className={RECAP_HEADLINE_CLASS}>{item.headline}</p>
            </div>
            <div
              className={`flex w-full ${RECAP_VISUAL_HEIGHT} items-center justify-center pb-1 ${item.mobileVisualClassName ?? ""}`}
            >
              {item.visual}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Desktop: equal columns, headline + visual stacked per item */}
      <div className="hidden md:grid md:grid-cols-3 md:gap-x-6 lg:gap-x-10 w-full max-w-7xl mx-auto px-4">
        {items.map((item) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.45, delay: item.delay }}
            className="flex min-w-0 flex-col gap-2"
          >
            <div className={RECAP_HEADLINE_ROW_DESKTOP}>
              <p className={RECAP_HEADLINE_CLASS}>{item.headline}</p>
            </div>
            <div
              className={`${RECAP_VISUAL_HEIGHT} w-full min-w-0 ${item.desktopVisualClassName ?? ""}`}
            >
              {item.visual}
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}
