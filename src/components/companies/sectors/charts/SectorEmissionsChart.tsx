import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LegendProps,
} from "recharts";
import {
  sectorColors,
  useSectorNames,
  getCompanyColors,
} from "@/hooks/companies/useCompanyFilters";
import { RankedCompany } from "@/hooks/companies/useCompanies";
import { useScreenSize } from "@/hooks/useScreenSize";
import { useChartData } from "@/hooks/companies/useChartData";
import CustomTooltip from "./tooltips/CustomTooltip";
import ChartHeader from "./ChartHeader";
import { useTranslation } from "react-i18next";
import PieChartView from "./PieChartView";
import { useResponsiveChartSize } from "@/hooks/useResponsiveChartSize";
import { cn } from "@/lib/utils";

interface EmissionsChartProps {
  companies: RankedCompany[];
  selectedSectors: string[];
}

type ChartType = "stacked-total" | "pie";

export interface SectorPieChartData {
  name: string;
  value: number;
  sectorCode?: string;
}

type BarClickData = {
  activePayload?: { dataKey: string }[];
  activeLabel?: string;
};

const formatYAxisTick = (value: number): string => {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  } else if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  } else if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}k`;
  }
  return value.toString();
};

const StackedTotalLegend = ({
  payload,
}: {
  payload: LegendProps["payload"];
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {payload?.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className={cn("w-3 h-3 rounded", `bg-[${entry.color}]`)} />
          <span className="text-sm text-grey">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

const SectorEmissionsChart: React.FC<EmissionsChartProps> = ({
  companies,
  selectedSectors,
}) => {
  const { t } = useTranslation();
  const sectorNames = useSectorNames();

  const [chartType, setChartType] = useState<ChartType>("pie");
  const [selectedYear, setSelectedYear] = useState<string>("2023");
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const screenSize = useScreenSize();
  const { size } = useResponsiveChartSize();

  const { chartData, pieChartData, totalEmissions, years } = useChartData(
    companies,
    selectedSectors,
    selectedSector,
    chartType,
    selectedYear,
  );

  const handleBarClick = (data: BarClickData) => {
    if (chartType === "stacked-total") {
      return;
    }
    if (!data || !data.activePayload || !data.activePayload[0]) {
      return;
    }
    const [sector] = data.activePayload[0].dataKey.split("_scope");
    const sectorCode = Object.entries(sectorNames).find(
      ([, name]) => name === sector,
    )?.[0];

    if (sectorCode) {
      setSelectedSector(sectorCode);
      setSelectedYear(data.activeLabel!);
    }
  };

  const handlePieClick = (data: SectorPieChartData) => {
    if (!selectedSector && data?.sectorCode) {
      setSelectedSector(data.sectorCode);
    }
  };

  const pieChartDataWithColor = pieChartData.map((entry, index) => ({
    ...entry,
    color: selectedSector
      ? getCompanyColors(index).base
      : "sectorCode" in entry
        ? sectorColors[entry.sectorCode as keyof typeof sectorColors]?.base ||
          "var(--grey)"
        : "var(--grey)",
  }));

  return (
    <div className="w-full space-y-6">
      <ChartHeader
        selectedSector={selectedSector}
        chartType={chartType}
        totalEmissions={totalEmissions}
        selectedYear={selectedYear}
        years={years}
        onSectorClear={() => setSelectedSector(null)}
        onChartTypeChange={setChartType}
        onYearChange={setSelectedYear}
        selectedSectors={selectedSectors}
      />

      <div>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "pie" ? (
            <PieChartView
              pieChartData={pieChartDataWithColor}
              selectedLabel={selectedSector}
              size={size}
              handlePieClick={handlePieClick}
              handlePieMouseEnter={() => {}}
              layout={screenSize.isMobile ? "mobile" : "desktop"}
            />
          ) : (
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 15, left: 20, bottom: 5 }}
              onClick={
                chartType !== "stacked-total" ? handleBarClick : undefined
              }
              barGap={0}
              barCategoryGap="30%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
              <XAxis
                dataKey="year"
                tick={{ fill: "#888888" }}
                axisLine={{ stroke: "#2A2A2A" }}
                tickLine={{ stroke: "#2A2A2A" }}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis
                label={{
                  value: t("emissionsUnit"),
                  angle: -90,
                  position: "insideLeft",
                  fill: "#888888",
                  style: { textAnchor: "middle" },
                  offset: -15,
                }}
                tick={{ fill: "#888888" }}
                axisLine={{ stroke: "#2A2A2A" }}
                tickLine={{ stroke: "#2A2A2A" }}
                tickFormatter={formatYAxisTick}
                width={60}
              />
              <Tooltip content={<CustomTooltip />} />
              {selectedSectors.map((sectorCode) => {
                const sectorName =
                  sectorNames[sectorCode as keyof typeof sectorNames];
                const colors =
                  sectorColors[sectorCode as keyof typeof sectorColors];
                return (
                  <Bar
                    key={sectorCode}
                    dataKey={sectorName}
                    stackId="total"
                    fill={colors.base}
                    name={sectorName}
                    cursor="default"
                  />
                );
              })}
              <Legend
                content={(props) => (
                  <StackedTotalLegend payload={props.payload || []} />
                )}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SectorEmissionsChart;
