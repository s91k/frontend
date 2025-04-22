import { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  Legend,
} from "recharts";
import { Info, X } from "lucide-react";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { interpolateScope3Categories } from "@/lib/calculations/emissions";
import type { EmissionsHistoryProps, DataView } from "@/types/emissions";
import { useScreenSize } from "@/hooks/useScreenSize";
import { getChartData } from "../../../utils/getChartData";
import { CustomTooltip } from "./CustomTooltip";
import { DataViewSelector } from "./DataViewSelector";
import { useTranslation } from "react-i18next";
import { useCategoryMetadata } from "@/hooks/companies/useCategories";
import { useLanguage } from "@/components/LanguageProvider";
import { formatEmissionsAbsolute } from "@/utils/localizeUnit";

export function EmissionsHistory({
  reportingPeriods,
  onYearSelect,
  className,
  baseYear,
  features = {
    interpolateScope3: true,
    guessBaseYear: true,
    compositeTrend: true,
    outlierDetection: true,
  },
}: EmissionsHistoryProps) {
  const { t } = useTranslation();
  const { getCategoryName, getCategoryColor } = useCategoryMetadata();

  // Validate input data
  if (!reportingPeriods?.length) {
    return (
      <div className="text-center py-12">
        <Text variant="body">
          {t("companies.emissionsHistory.noReportingPeriods")}
        </Text>
      </div>
    );
  }
  const isMobile = useScreenSize();
  const { currentLanguage } = useLanguage();

  const hasScope3Categories = useMemo(
    () =>
      reportingPeriods.some(
        (period) => period.emissions?.scope3?.categories?.length ?? 0 > 0,
      ),
    [reportingPeriods],
  );

  const [dataView, setDataView] = useState<DataView>(() => {
    if (!hasScope3Categories && "categories" === "categories") {
      return "overview";
    }
    return "overview";
  });

  const companyBaseYear = baseYear?.year;

  // Only interpolate if the feature is enabled
  const processedPeriods = useMemo(
    () =>
      features.interpolateScope3
        ? interpolateScope3Categories(reportingPeriods)
        : reportingPeriods,
    [reportingPeriods, features.interpolateScope3],
  );

  // Process data based on view
  const chartData = useMemo(
    () => getChartData(processedPeriods),
    [processedPeriods],
  );

  const trendLineData = useMemo(() => {
    if (!chartData || chartData.length < 2)
      return { pre2025: [], post2025: [] };

    const points = chartData.filter((d) => typeof d.total === "number");
    const n = points.length;
    if (n < 2) return { pre2025: [], post2025: [] };

    const sumX = points.reduce((sum, p) => sum + p.year, 0);
    const sumY = points.reduce((sum, p) => sum + p.total, 0);
    const sumXY = points.reduce((sum, p) => sum + p.year * p.total, 0);
    const sumX2 = points.reduce((sum, p) => sum + p.year * p.year, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const startYear = Math.max(...points.map((p) => p.year));
    const endYear = 2050;

    const pre2025Data = [];
    const post2025Data = [];
    for (let year = startYear; year <= endYear; year++) {
      const trendValue = slope * year + intercept;
      if (year < 2025) {
        pre2025Data.push({ year, trend: trendValue });
      } else if (year === 2025) {
        pre2025Data.push({ year, trend: trendValue });
        post2025Data.push({ year, trend: trendValue });
      } else {
        post2025Data.push({ year, trend: trendValue });
      }
    }

    return { pre2025: pre2025Data, post2025: post2025Data };
  }, [chartData]);

  const calculateTrendForYear = (year: number) => {
    if (!chartData || chartData.length < 2) return null;

    const points = chartData.filter((d) => typeof d.total === "number");
    const n = points.length;
    if (n < 2) return null;

    const sumX = points.reduce((sum, p) => sum + p.year, 0);
    const sumY = points.reduce((sum, p) => sum + p.total, 0);
    const sumXY = points.reduce((sum, p) => sum + p.year * p.total, 0);
    const sumX2 = points.reduce((sum, p) => sum + p.year * p.year, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return slope * year + intercept;
  };

  const trend2025 = calculateTrendForYear(2025);

  const declineLineData = useMemo(() => {
    const startYear = 2025;
    const endYear = 2050;
    const reductionRate13 = 0.1385;
    const reductionRate17 = 0.1756;

    const baseValue = trend2025;
    if (!baseValue || chartData.length === 0)
      return { decline13: [], decline17: [] };

    const data13: Array<{ year: number; decline13: number }> = [];
    const data17: Array<{ year: number; decline17: number }> = [];
    let currentValue13 = baseValue;
    let currentValue17 = baseValue;

    for (let year = startYear; year <= endYear; year++) {
      if (year > startYear) {
        currentValue13 *= 1 - reductionRate13;
        currentValue17 *= 1 - reductionRate17;
      }
      data13.push({ year, decline13: currentValue13 });
      data17.push({ year, decline17: currentValue17 });
    }

    return { decline13: data13, decline17: data17 };
  }, [chartData, trend2025]);

  const handleClick = (data: any) => {
    if (data?.activePayload?.[0]?.payload?.total) {
      onYearSelect?.(data.activePayload[0].payload.year.toString());
    }
  };

  // Add state for hidden scopes
  const [hiddenScopes, setHiddenScopes] = useState<
    Array<"scope1" | "scope2" | "scope3">
  >([]);

  // Add toggle handler
  const handleScopeToggle = (scope: "scope1" | "scope2" | "scope3") => {
    setHiddenScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope],
    );
  };

  // Add state for hidden categories
  const [hiddenCategories, setHiddenCategories] = useState<number[]>([]);

  const handleCategoryToggle = (categoryId: number) => {
    setHiddenCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  return (
    <div
      className={cn("bg-black-2 rounded-level-1 px-4 md:px-16 py-8", className)}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-12 gap-4 md:gap-0">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Text variant="h3">{t("companies.emissionsHistory.title")}</Text>
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-grey" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("companies.emissionsHistory.tooltip")}</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </div>
          <Text variant="body">{t("companies.emissionsHistory.unit")}</Text>
        </div>
        {/* Switch between Tabs and Dropdown based on screen size */}
        <DataViewSelector
          isMobile={isMobile}
          dataView={dataView}
          setDataView={setDataView}
          hasScope3Categories={hasScope3Categories}
        />
      </div>
      <div className="h-[300px] md:h-[400px]">
        <ResponsiveContainer width="100%" height="100%" className="w-full">
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 20, left: 10, bottom: 10 }}
            onClick={handleClick}
          >
            <ReferenceLine
              label={{
                value: t("companies.emissionsHistory.baseYear"),
                position: "top",
                fill: "white",
                fontSize: 12,
                fontWeight: "normal",
              }}
              x={companyBaseYear}
              stroke="#878787"
              strokeDasharray="4 4"
            />
            <XAxis
              dataKey="year"
              stroke="#878787"
              tickLine={false}
              axisLine={true}
              type="number"
              domain={[chartData[0]?.year || 2000, 2050]}
              tick={({ x, y, payload }) => {
                const isBaseYear = payload.value === companyBaseYear;
                return (
                  <text
                    x={x - 15}
                    y={y + 10}
                    fontSize={12}
                    fill={isBaseYear ? "white" : "#878787"}
                    fontWeight={isBaseYear ? "bold" : "normal"}
                  >
                    {payload.value}
                  </text>
                );
              }}
              padding={{ left: 0, right: 0 }}
            />

            <YAxis
              stroke="#878787"
              tickLine={false}
              axisLine={true}
              tick={{ fontSize: 12 }}
              width={80}
              domain={[0, "auto"]}
              padding={{ top: 0, bottom: 0 }}
              tickFormatter={(value) =>
                formatEmissionsAbsolute(value, currentLanguage)
              }
            />
            <Tooltip
              content={<CustomTooltip companyBaseYear={companyBaseYear} />}
            />

            {dataView === "overview" && (
              <>
                <Legend
                  verticalAlign="top"
                  align="right"
                  height={36}
                  iconType="line"
                  wrapperStyle={{ fontSize: "12px", color: "#878787" }}
                />
                <Line
                  type="monotone"
                  data={declineLineData.decline13}
                  dataKey="decline13"
                  stroke="#6c9105"
                  strokeWidth={2}
                  strokeDasharray="6 3"
                  dot={false}
                  isAnimationActive={false}
                  name={
                    t("companies.emissionsHistory.declineLine13Label") ||
                    "13% annual reduction"
                  }
                />
                <Line
                  type="monotone"
                  data={declineLineData.decline17}
                  dataKey="decline17"
                  stroke="#354702"
                  strokeWidth={2}
                  strokeDasharray="6 3"
                  dot={false}
                  isAnimationActive={false}
                  name={
                    t("companies.emissionsHistory.declineLine17Label") ||
                    "17% annual reduction"
                  }
                />
                <Line
                  type="monotone"
                  data={trendLineData.post2025}
                  dataKey="trend"
                  stroke="red"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  isAnimationActive={false}
                  name={t("companies.emissionsHistory.trendLineLabelPost2025")}
                />

                <Line
                  type="monotone"
                  data={trendLineData.pre2025}
                  dataKey="trend"
                  stroke="#808080"
                  strokeWidth={2}
                  strokeDasharray="2 2"
                  dot={false}
                  isAnimationActive={false}
                  name={"Estimated emissions"}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="white"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "white", cursor: "pointer" }}
                  activeDot={{ r: 6, fill: "white", cursor: "pointer" }}
                  connectNulls
                  name={t("companies.emissionsHistory.totalEmissions")}
                />
              </>
            )}
            {dataView === "scopes" && (
              <>
                {!hiddenScopes.includes("scope1") && (
                  <Line
                    type="monotone"
                    dataKey="scope1"
                    stroke="#F0759A"
                    strokeWidth={2}
                    dot={{
                      r: 4,
                      fill: "#F0759A",
                      cursor: "pointer",
                      onClick: () => handleScopeToggle("scope1"),
                    }}
                    activeDot={{ r: 6, fill: "#F0759A", cursor: "pointer" }}
                    name="Scope 1"
                  />
                )}
                {!hiddenScopes.includes("scope2") && (
                  <Line
                    type="monotone"
                    dataKey="scope2"
                    stroke="#E2FF8D"
                    strokeWidth={2}
                    dot={{
                      r: 4,
                      fill: "#E2FF8D",
                      cursor: "pointer",
                      onClick: () => handleScopeToggle("scope2"),
                    }}
                    activeDot={{ r: 6, fill: "#E2FF8D", cursor: "pointer" }}
                    name="Scope 2"
                  />
                )}
                {!hiddenScopes.includes("scope3") && (
                  <Line
                    type="monotone"
                    dataKey="scope3"
                    stroke="#99CFFF"
                    strokeWidth={2}
                    dot={{
                      r: 4,
                      fill: "#99CFFF",
                      cursor: "pointer",
                      onClick: () => handleScopeToggle("scope3"),
                    }}
                    activeDot={{
                      r: 6,
                      fill: "#99CFFF",
                      cursor: "pointer",
                      onClick: () => handleScopeToggle("scope3"),
                    }}
                    name="Scope 3"
                  />
                )}
              </>
            )}

            {dataView === "categories" &&
              Object.keys(chartData[0])
                .filter(
                  (key) =>
                    key.startsWith("cat") && !key.includes("Interpolated"),
                )
                .map((categoryKey) => {
                  const categoryId = parseInt(categoryKey.replace("cat", ""));
                  const isInterpolatedKey = `${categoryKey}Interpolated`;

                  // Check if the category is hidden
                  if (hiddenCategories.includes(categoryId)) return null;
                  // Calculate strokeDasharray based on the first data point
                  const strokeDasharray = chartData[0][isInterpolatedKey]
                    ? "4 4"
                    : "0";

                  return (
                    <Line
                      key={categoryKey}
                      type="monotone"
                      dataKey={categoryKey}
                      stroke={getCategoryColor(categoryId)}
                      strokeWidth={2}
                      strokeDasharray={strokeDasharray}
                      dot={(props) => {
                        const { cx, cy, payload } = props;

                        if (!payload) return undefined;

                        const value = payload.originalValues?.[categoryKey];

                        if (
                          value === null ||
                          value === undefined ||
                          isNaN(value)
                        ) {
                          return undefined;
                        }

                        return (
                          <circle
                            cx={cx}
                            cy={cy}
                            r={4}
                            fill={getCategoryColor(categoryId)}
                            stroke={getCategoryColor(categoryId)}
                            strokeWidth={2}
                            cursor="pointer"
                            onClick={() => handleCategoryToggle(categoryId)}
                          />
                        );
                      }}
                      activeDot={(props) => {
                        const { cx, cy, payload } = props;

                        if (!payload) return undefined;

                        const value = payload.originalValues?.[categoryKey];

                        if (
                          value === null ||
                          value === undefined ||
                          isNaN(value)
                        ) {
                          return undefined;
                        }

                        return (
                          <circle
                            cx={cx}
                            cy={cy}
                            r={6}
                            fill={getCategoryColor(categoryId)}
                            stroke={getCategoryColor(categoryId)}
                            strokeWidth={2}
                            cursor="pointer"
                            onClick={() => handleCategoryToggle(categoryId)}
                          />
                        );
                      }}
                      name={getCategoryName(categoryId)}
                    />
                  );
                })}
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Moved badges below graph */}
      {(hiddenScopes.length > 0 || hiddenCategories.length > 0) && (
        <div className="flex gap-2 mt-4">
          {hiddenScopes.map((scope) => (
            <button
              key={scope}
              onClick={() => handleScopeToggle(scope)}
              className="px-2 py-1 text-sm bg-black-1 rounded-md flex items-center gap-1 hover:bg-black-3 transition-colors"
              style={{
                color:
                  scope === "scope1"
                    ? "#F0759A"
                    : scope === "scope2"
                      ? "#E2FF8D"
                      : "#99CFFF",
              }}
            >
              {scope === "scope1"
                ? "Scope 1"
                : scope === "scope2"
                  ? "Scope 2"
                  : "Scope 3"}
              <X className="w-3 h-3" />
            </button>
          ))}
          {hiddenCategories.map((categoryId) => (
            <button
              key={categoryId}
              onClick={() => handleCategoryToggle(categoryId)}
              className="px-2 py-1 text-sm bg-black-1 rounded-md flex items-center gap-1 hover:bg-black-3 transition-colors"
              style={{ color: getCategoryColor(categoryId) }}
            >
              {getCategoryName(categoryId)}
              <X className="w-3 h-3" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
