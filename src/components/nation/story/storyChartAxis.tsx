import type { SupportedLanguage } from "@/lib/languageDetection";
import { formatMton } from "@/utils/data/nationStoryMetrics";

/** Y-axis band – wide enough for tick labels + unit above. */
export const STORY_Y_AXIS_WIDTH = 44;

/** Extra headroom so the unit label clears the top Y-axis tick. */
const STORY_CHART_UNIT_BAND = 16;

/**
 * Mobile runs the plot edge-to-edge (labels mirror inside the plot).
 * Desktop reserves a narrow outside axis gutter.
 */
export function getStoryChartMargin(isMobile: boolean) {
  return {
    top: isMobile ? 8 + STORY_CHART_UNIT_BAND : 14 + STORY_CHART_UNIT_BAND,
    right: isMobile ? 0 : 16,
    left: 0,
    bottom: 0,
  };
}

type MirroredYAxisTickProps = {
  x: number;
  y: number;
  payload: { value: number };
};

/** Bold white labels inside the plot on mobile – matches the stacked chart. */
export function createMirroredYAxisTick(currentLanguage: SupportedLanguage) {
  return function MirroredYAxisTick({
    x,
    y,
    payload,
  }: MirroredYAxisTickProps) {
    if (payload.value === 0) return <g />;
    return (
      <text
        x={x + 2}
        y={y + 4}
        textAnchor="start"
        fontSize={11}
        fontWeight={600}
        fill="#ffffff"
      >
        {formatMton(payload.value, currentLanguage, 0)}
      </text>
    );
  };
}

type StoryChartYAxisUnitProps = {
  unit: string;
};

/** White unit label on one line above the top Y-axis tick – same on all breakpoints. */
export function StoryChartYAxisUnit({ unit }: StoryChartYAxisUnitProps) {
  return (
    <span
      aria-hidden
      className="absolute z-10 pointer-events-none whitespace-nowrap text-white"
      style={{
        top: 6,
        left: 2,
        fontSize: 10,
        lineHeight: 1.2,
      }}
    >
      {unit}
    </span>
  );
}
