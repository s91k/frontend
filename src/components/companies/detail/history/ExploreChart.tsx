import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Area,
} from "recharts";
import { CustomTooltip } from "../CustomTooltip";
import { ChartData } from "@/types/emissions";
import { formatEmissionsAbsoluteCompact } from "@/utils/formatting/localization";
import { generateApproximatedData } from "@/lib/calculations/trends/approximatedData";
import { selectBestTrendLineMethod } from "@/lib/calculations/trends/analysis";
import { useMemo } from "react";

interface ExploreChartProps {
  data: ChartData[];
  step: number;
  companyBaseYear?: number;
  currentLanguage: "sv" | "en";
  trendExplanation?: string;
  yDomain: [number, number];
  parisExplanation?: string;
}

export function ExploreChart({
  data,
  step,
  companyBaseYear,
  currentLanguage,
  trendExplanation,
  yDomain,
  parisExplanation,
}: ExploreChartProps) {
  // Calculate all common data once for reuse across all steps
  const exploreData = useMemo(() => {
    if (!companyBaseYear) return null;

    const emissionsData = data
      .filter((d) => d.total !== undefined && d.total !== null)
      .map((d) => ({ year: d.year, total: d.total as number }));

    if (emissionsData.length < 2) return null;

    const trendAnalysis = selectBestTrendLineMethod(
      emissionsData,
      companyBaseYear,
    );
    const lastReportedYear = Math.max(...emissionsData.map((d) => d.year));

    return {
      trendAnalysis,
      cleanData: trendAnalysis?.cleanData || [],
      baseYear: companyBaseYear,
      lastReportedYear,
      coefficients: trendAnalysis?.coefficients,
    };
  }, [data, companyBaseYear]);

  // Helper functions to reduce code duplication
  const getCommonYears = () => ({
    currentYear: new Date().getFullYear(),
    parisStartYear: 2025,
    endYear2050: 2050,
    endYearShort: new Date().getFullYear() + 5,
  });

  const generateApproximatedDataForStep = (endYear: number) => {
    if (!exploreData?.coefficients) return null;

    return generateApproximatedData(
      data,
      undefined, // regression
      endYear,
      exploreData.baseYear,
      exploreData.coefficients,
      exploreData.cleanData,
    );
  };

  const buildAreaData = (
    years: number[],
    trendSegment: { year: number; approximated: number | undefined }[],
    parisSegment: { year: number; carbonLaw: number | undefined }[],
  ) => {
    return years.map((year) => {
      const trend = trendSegment.find((d) => d.year === year)?.approximated;
      const paris = parisSegment.find((d) => d.year === year)?.carbonLaw;
      const diff =
        trend !== undefined && paris !== undefined ? trend - paris : undefined;

      return {
        year,
        approximated: trend,
        carbonLaw: paris,
        diff,
        // For area between lines, we need to create a single area that represents the difference
        areaValue: Math.abs(diff || 0),
        areaColor: diff !== undefined && diff < 0 ? "green" : "orange",
      };
    });
  };

  // Helper function to render step descriptions
  const renderStepDescription = (step: number) => {
    const descriptions = {
      2: trendExplanation && (
        <div className="text-center text-sm text-gray-400 mb-4 max-w-2xl mx-auto">
          {trendExplanation}
        </div>
      ),
      4: parisExplanation && (
        <div className="text-center text-sm text-green-3 mb-4 max-w-2xl mx-auto">
          {parisExplanation}
        </div>
      ),
      5: (
        <div className="text-center text-sm text-gray-400 mb-4 max-w-2xl mx-auto">
          The difference at 2050 is calculated as:{" "}
          <strong>Trend line value - Paris target value</strong>. A negative
          value (green area) means the company is projected to be under the
          Paris target. A positive value (orange area) means the company is
          projected to exceed the Paris target.
        </div>
      ),
      6: (
        <div className="text-center text-sm text-gray-400 mb-4 max-w-2xl mx-auto">
          The total area difference shows cumulative emissions over time. The
          area between the trend line and Paris target line represents the total
          emissions difference from current year to 2050. Green areas (below
          Paris line) reduce the total, orange areas (above Paris line) increase
          it.
        </div>
      ),
    };

    return descriptions[step as keyof typeof descriptions] || null;
  };

  // Helper functions to render common chart elements
  const renderCurrentYearReferenceLine = () => (
    <ReferenceLine
      x={getCommonYears().currentYear}
      stroke="var(--grey)"
      strokeDasharray="4 4"
      ifOverflow="extendDomain"
      label={{
        value: `${getCommonYears().currentYear}`,
        position: "top",
        dx: 15,
        fill: "white",
        fontSize: 12,
        fontWeight: "bold",
      }}
    />
  );

  const renderBaseYearReferenceLine = () =>
    companyBaseYear && (
      <ReferenceLine
        label={{
          value: "Base Year",
          position: "top",
          dx: 25,
          fill: "white",
          fontSize: 12,
          fontWeight: "normal",
        }}
        x={companyBaseYear}
        stroke="var(--grey)"
        strokeDasharray="4 4"
        ifOverflow="extendDomain"
      />
    );

  const getXAxisDomain = () => {
    const { currentYear, parisStartYear, endYear2050, endYearShort } =
      getCommonYears();

    if (step === 5) return [parisStartYear, endYear2050];
    if (step === 4) return [parisStartYear, endYear2050];
    if (step === 3 && companyBaseYear) return [companyBaseYear, endYearShort];
    if (step === 2 && companyBaseYear) return [companyBaseYear, endYearShort];

    return [data[0]?.year || 2000, data[data.length - 1]?.year || currentYear];
  };

  // Helper function for common Line component props
  const getCommonLineProps = (
    dataKey: string,
    stroke: string,
    animated: boolean = true,
  ) => ({
    type: "monotone" as const,
    dataKey,
    stroke,
    strokeWidth: 2,
    dot: false,
    isAnimationActive: animated,
    animationDuration: 1000,
    connectNulls: true,
  });

  // Helper function for common Area component props
  const getCommonAreaProps = (
    dataKey: string,
    fill: string,
    fillOpacity: number = 0.8,
  ) => ({
    type: "monotone" as const,
    dataKey,
    stroke: "none",
    fill,
    fillOpacity,
    isAnimationActive: true,
    animationDuration: 1000,
    connectNulls: true,
    yAxisId: 0,
  });

  // For step 0, filter data to only before or at base year (for white line only)
  let step0Data = data;
  if (step === 0 && companyBaseYear) {
    step0Data = data.filter((d) => d.year <= companyBaseYear);
  }
  // For step 1, filter data to only base year through last reported year (for green segment only)
  let step1GreenSegment: ChartData[] = [];
  if ((step === 1 || step === 2) && exploreData) {
    step1GreenSegment = data.filter(
      (d) =>
        d.year >= exploreData.baseYear &&
        d.year <= exploreData.lastReportedYear,
    );
  }
  //   // For step 2, calculate the extended trend segment from last reported year to current year + 5
  let step2TrendSegment: { year: number; approximated: number | undefined }[] =
    [];
  if (step === 2 && exploreData?.coefficients) {
    const { endYearShort } = getCommonYears();
    const approximatedData = generateApproximatedDataForStep(endYearShort);
    if (approximatedData) {
      // Only keep the segment from lastReportedYear to endYear
      step2TrendSegment = approximatedData
        .filter(
          (d) =>
            d.year >= exploreData.lastReportedYear &&
            d.year <= endYearShort &&
            d.approximated !== undefined &&
            d.approximated !== null,
        )
        .map((d) => ({
          year: d.year,
          approximated: d.approximated === null ? undefined : d.approximated,
        }));
    }
  }

  // For step 2, build a grey line data array that covers the full X-axis domain
  let step2GreyLine: ChartData[] = [];
  if (step === 2 && exploreData) {
    const { endYearShort } = getCommonYears();
    // Build a data array from base year to endYear
    step2GreyLine = [];
    for (let year = exploreData.baseYear; year <= endYearShort; year++) {
      const found = data.find((d) => d.year === year);
      step2GreyLine.push({
        ...found,
        year,
        total:
          year <= exploreData.baseYear
            ? (found?.total ?? undefined)
            : undefined,
      });
    }
  }
  // For step 3, build the Paris line segment from current year to projection end
  let step3ParisSegment: { year: number; carbonLaw: number | undefined }[] = [];
  let step3FullDomain: number[] = [];
  let step3GreyLine: { year: number; total?: number }[] = [];
  let step3OrangeLine: { year: number; approximated?: number }[] = [];
  if (step === 3 && exploreData?.coefficients) {
    const { endYearShort } = getCommonYears();
    step3FullDomain = Array.from(
      { length: endYearShort - exploreData.baseYear + 1 },
      (_, i) => exploreData.baseYear + i,
    );
    // Grey line: only values up to lastReportedYear
    step3GreyLine = step3FullDomain.map((year) => {
      const found = data.find((d) => d.year === year);
      return {
        year,
        total: year <= exploreData.lastReportedYear ? found?.total : undefined,
      };
    });
    // Orange line: only values after lastReportedYear, from approximatedData
    const approximatedData = generateApproximatedDataForStep(endYearShort);
    if (approximatedData) {
      step3OrangeLine = step3FullDomain.map((year) => {
        const found = approximatedData.find((d) => d.year === year);
        return {
          year,
          approximated:
            year >= exploreData.lastReportedYear
              ? (found?.approximated ?? undefined)
              : undefined,
        };
      });
      // Paris line segment: current year to projection end
      const { currentYear } = getCommonYears();
      step3ParisSegment = approximatedData
        .filter(
          (d) =>
            d.year >= currentYear &&
            d.year <= endYearShort &&
            d.carbonLaw !== undefined &&
            d.carbonLaw !== null,
        )
        .map((d) => ({ year: d.year, carbonLaw: d.carbonLaw ?? undefined }));
    }
  }

  // Step 4: Future comparison segment (current year to 2050, both lines, difference annotation, and area shading)
  let step4ParisSegment: { year: number; carbonLaw: number | undefined }[] = [];
  let step4TrendSegment: { year: number; approximated: number | undefined }[] =
    [];
  let step4Years: number[] = [];
  let step4Difference2050: number | null = null;
  let step4AreaData: {
    year: number;
    approximated?: number;
    carbonLaw?: number;
    diff?: number;
    diffTop?: number;
    diffBottom?: number;
  }[] = [];
  let step4AreaColor: string = "var(--orange-5)"; // default orange
  let step4LabelText: string = "";
  let step4LabelColor: string = "var(--orange-3)";
  if (step === 4 && exploreData?.coefficients) {
    const { parisStartYear, endYear2050 } = getCommonYears();
    step4Years = Array.from(
      { length: endYear2050 - parisStartYear + 1 },
      (_, i) => parisStartYear + i,
    );
    const approximatedData = generateApproximatedDataForStep(endYear2050);
    if (approximatedData) {
      step4ParisSegment = approximatedData
        .filter(
          (d) =>
            d.year >= parisStartYear &&
            d.year <= endYear2050 &&
            d.carbonLaw !== undefined &&
            d.carbonLaw !== null,
        )
        .map((d) => ({ year: d.year, carbonLaw: d.carbonLaw ?? undefined }));
      step4TrendSegment = approximatedData
        .filter(
          (d) =>
            d.year >= parisStartYear &&
            d.year <= endYear2050 &&
            d.approximated !== undefined &&
            d.approximated !== null,
        )
        .map((d) => ({
          year: d.year,
          approximated: d.approximated ?? undefined,
        }));
      // Build area data for shading
      step4AreaData = buildAreaData(
        step4Years,
        step4TrendSegment,
        step4ParisSegment,
      );
    }

    // Calculate the difference at 2050
    const trend2050 = step4TrendSegment.find(
      (d) => d.year === 2050,
    )?.approximated;
    const paris2050 = step4ParisSegment.find((d) => d.year === 2050)?.carbonLaw;
    if (typeof trend2050 === "number" && typeof paris2050 === "number") {
      step4Difference2050 = trend2050 - paris2050;
      if (step4Difference2050 < 0) {
        step4AreaColor = "var(--green-3)"; // green
        step4LabelColor = "var(--green-3)";
        step4LabelText = `${formatEmissionsAbsoluteCompact(Math.abs(step4Difference2050), currentLanguage)} t under Paris target`;
      } else {
        step4AreaColor = "var(--pink-5)"; // pink
        step4LabelColor = "var(--pink-3)";
        step4LabelText = `${formatEmissionsAbsoluteCompact(Math.abs(step4Difference2050), currentLanguage)} t over Paris target`;
      }
    }
  }

  // Step 5: Area under curves calculation (current year to 2050)
  let step5AreaData: {
    year: number;
    trend: number | undefined;
    paris: number | undefined;
    areaDiff: number | undefined;
  }[] = [];
  let step5TotalAreaDifference: number | null = null;
  let step5AreaLabelText: string = "";
  let step5AreaLabelColor: string = "var(--white)";

  if (step === 5 && exploreData?.coefficients) {
    const { parisStartYear, endYear2050 } = getCommonYears();

    // Get trend and Paris data from 2025 to 2050
    const approximatedData = generateApproximatedDataForStep(endYear2050);

    // Build step 5 data array from 2025 to 2050
    step5AreaData = [];
    let totalAreaDifference = 0;

    if (approximatedData) {
      for (let year = parisStartYear; year <= endYear2050; year++) {
        const trendPoint = approximatedData.find((d) => d.year === year);
        const trendValue = trendPoint?.approximated;
        const parisValue = trendPoint?.carbonLaw;

        if (typeof trendValue === "number" && typeof parisValue === "number") {
          const areaDiff = trendValue - parisValue;
          totalAreaDifference += areaDiff;

          step5AreaData.push({
            year,
            trend: trendValue,
            paris: parisValue,
            areaDiff: areaDiff,
          });
        }
      }

      step5TotalAreaDifference = totalAreaDifference;

      if (step5TotalAreaDifference < 0) {
        step5AreaLabelColor = "var(--green-3)"; // green
        step5AreaLabelText = `${formatEmissionsAbsoluteCompact(Math.abs(step5TotalAreaDifference), currentLanguage)} t total emissions saved vs Paris target`;
      } else {
        step5AreaLabelColor = "var(--pink-3)"; // orange
        step5AreaLabelText = `${formatEmissionsAbsoluteCompact(Math.abs(step5TotalAreaDifference), currentLanguage)} t total emissions excess vs Paris target`;
      }
    }
  }

  return (
    <>
      {renderStepDescription(step)}
      <ResponsiveContainer width="100%" height="100%" className="w-full">
        <LineChart
          data={
            step === 5 && step5AreaData.length > 0
              ? step5AreaData
              : step === 4 && step4AreaData.length > 0
                ? step4AreaData
                : step === 3 && companyBaseYear
                  ? step3GreyLine
                  : data
          }
          margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
        >
          <XAxis
            dataKey="year"
            stroke="var(--grey)"
            tickLine={false}
            axisLine={false}
            type="number"
            domain={getXAxisDomain()}
            tick={{ fontSize: 12, fill: "var(--grey)" }}
          />
          <YAxis
            stroke="var(--grey)"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            width={60}
            domain={yDomain}
            tickFormatter={(value) =>
              formatEmissionsAbsoluteCompact(value, currentLanguage)
            }
          />
          <Tooltip
            content={<CustomTooltip companyBaseYear={companyBaseYear} />}
          />

          {/* Step 0: Show data before base year highlighted, line stops at base year */}
          {step === 0 && (
            <>
              {/* Base year reference line */}
              {renderBaseYearReferenceLine()}
              <Line
                type="monotone"
                data={step0Data}
                dataKey="total"
                stroke="white"
                strokeWidth={2}
                dot={(props) => {
                  const { cx, cy } = props;
                  return (
                    <circle cx={cx} cy={cy} r={4} fill="white" stroke="white" />
                  );
                }}
                isAnimationActive={true}
                animationDuration={1000}
                connectNulls
              />
            </>
          )}
          {/* Step 1: Show full line in grey, overlay green segment with dots for base year to last reported year */}
          {step === 1 && (
            <>
              {/* Base year reference line */}
              {renderBaseYearReferenceLine()}
              {/* Full line in grey, no dots */}
              <Line {...getCommonLineProps("total", "var(--grey)", false)} />
              {/* Green segment with dots for base year to last reported year */}
              {companyBaseYear && step1GreenSegment.length > 0 && (
                <Line
                  key={`step1-green-${step}`}
                  type="monotone"
                  data={step1GreenSegment}
                  dataKey="total"
                  stroke="var(--orange-3)"
                  strokeWidth={2}
                  dot={(props) => {
                    const { cx, cy } = props;
                    return (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={4}
                        fill="var(--orange-3)"
                        stroke="var(--orange-3)"
                      />
                    );
                  }}
                  isAnimationActive={true}
                  animationDuration={1000}
                  connectNulls
                />
              )}
            </>
          )}
          {/* Step 2: Show full line in grey, overlay green segment, overlay orange trend segment from last reported year to current year + 5 */}
          {step === 2 && (
            <>
              {/* Base year reference line */}
              {renderBaseYearReferenceLine()}
              {/* Grey context line: base year to last reported year, no dots */}
              {companyBaseYear && step1GreenSegment.length > 0 && (
                <Line
                  {...getCommonLineProps("total", "var(--grey)", false)}
                  data={step1GreenSegment}
                />
              )}
              {companyBaseYear && step2TrendSegment.length > 0 && (
                <Line
                  key={`step2-orange-${step}`}
                  type="monotone"
                  data={step2TrendSegment}
                  dataKey="approximated"
                  stroke="var(--orange-3)"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={true}
                  animationDuration={1000}
                  connectNulls
                />
              )}
            </>
          )}
          {/* Step 3: Show grey line for reported values, orange for trend/approximated, and highlight the Paris line (green) from current year to projection end */}
          {step === 3 && (
            <>
              {/* Base year reference line */}
              {renderBaseYearReferenceLine()}
              {/* Vertical line for current year */}
              {renderCurrentYearReferenceLine()}
              {/* Grey context line: base year to last reported year, no dots, always shown for full X domain */}
              {companyBaseYear && step3GreyLine.length > 0 && (
                <Line
                  {...getCommonLineProps("total", "var(--grey)", false)}
                  data={step3GreyLine}
                />
              )}
              {/* Orange trend segment: last reported year to current year + 5 */}
              {companyBaseYear && step3OrangeLine.length > 0 && (
                <Line
                  {...getCommonLineProps(
                    "approximated",
                    "var(--orange-3)",
                    false,
                  )}
                  data={step3OrangeLine}
                />
              )}
              {/* Paris line: current year to projection end, green, no dots */}
              {step3ParisSegment.length > 0 && (
                <Line
                  {...getCommonLineProps("carbonLaw", "var(--green-3)")}
                  data={step3ParisSegment}
                />
              )}
            </>
          )}
          {/* Step 4: Show trend and Paris lines from current year to 2050, annotate the difference at 2050, and shade the area between them */}
          {step === 4 && (
            <>
              {/* Vertical line for current year */}
              {renderCurrentYearReferenceLine()}
              {/* Shaded area between trend and Paris lines */}
              {step4AreaData.length > 0 && (
                <Area
                  {...getCommonAreaProps(
                    "areaValue",
                    step4Difference2050 !== null && step4Difference2050 < 0
                      ? "var(--green-3)"
                      : "var(--orange-3)",
                    0.3,
                  )}
                  baseValue={0}
                />
              )}
              {/* Paris line: green, no dots */}
              {step4ParisSegment.length > 0 && (
                <Line
                  {...getCommonLineProps("carbonLaw", "var(--green-4)")}
                  data={step4ParisSegment}
                />
              )}
              {/* Trend line: muted orange, no dots */}
              {step4TrendSegment.length > 0 && (
                <Line
                  {...getCommonLineProps("approximated", "var(--orange-4)")}
                  data={step4TrendSegment}
                />
              )}
              {/* Difference annotation at 2050 */}
              {step4Difference2050 !== null && (
                <ReferenceLine
                  x={2050}
                  stroke="var(--grey)"
                  strokeDasharray="3 3"
                  label={{
                    value: step4LabelText,
                    position: "left",
                    fill: step4LabelColor,
                    fontSize: 12,
                    fontWeight: "bold",
                  }}
                />
              )}
            </>
          )}
          {/* Step 5: Show area under curves with total cumulative difference */}
          {step === 5 && (
            <>
              {/* Vertical line for current year */}
              {renderCurrentYearReferenceLine()}
              {/* Shaded area between trend and Paris lines */}
              {step5AreaData.length > 0 && (
                <Area
                  {...getCommonAreaProps(
                    "areaDiff",
                    step5TotalAreaDifference !== null &&
                      step5TotalAreaDifference < 0
                      ? "var(--green-3)"
                      : "var(--orange-3)",
                    0.3,
                  )}
                  baseValue={0}
                />
              )}
              {/* Paris line: green, no dots */}
              <Line {...getCommonLineProps("paris", "var(--green-4)")} />
              {/* Trend line: orange, no dots */}
              <Line {...getCommonLineProps("trend", "var(--orange-4)")} />
              {/* Total area difference annotation */}
              {step5TotalAreaDifference !== null && (
                <ReferenceLine
                  x={2050}
                  stroke="var(--grey)"
                  strokeDasharray="3 3"
                  label={{
                    value: step5AreaLabelText,
                    position: "left",
                    fill: step5AreaLabelColor,
                    fontSize: 12,
                    fontWeight: "bold",
                  }}
                />
              )}
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}
