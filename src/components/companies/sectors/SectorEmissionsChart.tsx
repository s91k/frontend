import React, { useState, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  SECTOR_NAMES,
  sectorColors,
  getCompanyColors,
} from "@/hooks/companies/useCompanyFilters";
import { RankedCompany } from "@/hooks/companies/useCompanies";
import EmissionsTrendAnalysis from "./EmissionsTrendAnalysis/EmissionsTrendAnalysis";
import EmissionsSourcesAnalysis from "./EmissionsSourcesAnalysis/EmissionsSourcesAnlaysis";
import DetailPopup from "./charts/DetailPopup";
import CustomTooltip from "./charts/tooltips/CustomTooltip";
import PieChartTooltip from "./charts/tooltips/PieChartTooltip";
import CompanyTooltip from "./charts/tooltips/CompanyTooltip";
import CustomLegend from "./charts/CustomLegend";
import ChartHeader from "./charts/ChartHeader";
import { useChartData } from "@/hooks/companies/useChartData";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import PieLegend from "./charts/PieLegend";

interface EmissionsChartProps {
  companies: RankedCompany[];
  selectedSectors: string[];
}

type ChartType = "stacked-total" | "pie";

const SectorEmissionsChart: React.FC<EmissionsChartProps> = ({
  companies,
  selectedSectors,
}) => {
  const [selectedData, setSelectedData] = useState<{
    year: string;
    sector: string;
    scope1: number;
    scope2: number;
    scope3: number;
  } | null>(null);
  const [chartType, setChartType] = useState<ChartType>("pie");
  const [selectedYear, setSelectedYear] = useState<string>("2023");
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const { chartData, pieChartData, totalEmissions, years } = useChartData(
    companies,
    selectedSectors,
    selectedSector,
    chartType,
    selectedYear
  );

  const [legendData, setLegendData] = useState<any[]>([]);

  const handlePieMouseEnter = useCallback((data: any) => {
    if (data && data.payload) {
      setLegendData(data.payload);
    }
  }, []);

  const handleBarClick = (data: any) => {
    if (!data || !data.activePayload || !data.activePayload[0]) return;

    if (selectedSector) {
      const companyName = data.activePayload[0].dataKey.split("_")[0];
      const year = data.activeLabel;
      const company = companies.find((c) => c.name === companyName);
      if (!company) return;

      const periodForYear = company.reportingPeriods.find((period) =>
        period.startDate.startsWith(year)
      );
      if (!periodForYear?.emissions) return;

      setSelectedData({
        year,
        sector: companyName,
        scope1: periodForYear.emissions.scope1?.total || 0,
        scope2: periodForYear.emissions.scope2?.calculatedTotalEmissions || 0,
        scope3: periodForYear.emissions.scope3?.calculatedTotalEmissions || 0,
      });
    } else {
      let sectorCode;
      if (chartType === "stacked-total") {
        const sectorName = data.activePayload[0].dataKey;
        sectorCode = Object.entries(SECTOR_NAMES).find(
          ([_, name]) => name === sectorName
        )?.[0];
      } else {
        const [sector] = data.activePayload[0].dataKey.split("_scope");
        sectorCode = Object.entries(SECTOR_NAMES).find(
          ([_, name]) => name === sector
        )?.[0];
      }

      if (sectorCode) {
        setSelectedSector(sectorCode);
        setSelectedYear(data.activeLabel);
      }
    }
  };

  const handlePieClick = (data: any) => {
    if (!selectedSector && data?.payload?.sectorCode) {
      setSelectedSector(data.payload.sectorCode);
    }
  };

  const pieChartHeight = isMobile ? 500 : 650;

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
        SECTOR_NAMES={SECTOR_NAMES}
      />

      <div
        className={`h-[${pieChartHeight}px] mt-8`}
        style={{ height: pieChartHeight }}
      >
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "pie" ? (
            <PieChart>
              <Pie
                data={pieChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy={isMobile ? "35%" : "40%"}
                outerRadius={isMobile ? 100 : 160}
                onMouseEnter={handlePieMouseEnter}
              >
                {pieChartData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={
                      selectedSector
                        ? getCompanyColors(index).base
                        : "sectorCode" in entry
                        ? sectorColors[
                            entry.sectorCode as keyof typeof sectorColors
                          ]?.base || "#888888"
                        : "#888888"
                    }
                  />
                ))}
              </Pie>
              <Tooltip
                content={
                  selectedSector ? <CompanyTooltip /> : <PieChartTooltip />
                }
              />
              <Legend
                content={
                  <PieLegend
                    payload={pieChartData}
                    selectedSector={selectedSector}
                    handlePieClick={handlePieClick}
                  />
                }
              />
            </PieChart>
          ) : (
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              onClick={handleBarClick}
              barGap={0}
              barCategoryGap="40%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
              <XAxis
                dataKey="year"
                padding={{ left: 20, right: 20 }}
                tick={{ fill: "#888888" }}
              />
              <YAxis
                label={{
                  value: "CO₂e (tonnes)",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#888888",
                }}
                tick={{ fill: "#888888" }}
              />
              <Tooltip
                content={
                  selectedSector ? <CompanyTooltip /> : <CustomTooltip />
                }
              />
              {chartType === "stacked-total"
                ? selectedSectors.map((sectorCode) => {
                    const sectorName =
                      SECTOR_NAMES[sectorCode as keyof typeof SECTOR_NAMES];
                    const colors =
                      sectorColors[sectorCode as keyof typeof sectorColors];
                    return (
                      <Bar
                        key={sectorCode}
                        dataKey={sectorName}
                        stackId="total"
                        fill={colors.base}
                        name={sectorName}
                        cursor="pointer"
                      />
                    );
                  })
                : selectedSector
                ? companies
                    .filter(
                      (company) =>
                        company.industry?.industryGics.sectorCode ===
                        selectedSector
                    )
                    .map((company, index) => {
                      const colors = getCompanyColors(index);
                      return (
                        <React.Fragment key={company.name}>
                          <Bar
                            dataKey={`${company.name}_scope1`}
                            stackId={`stack-${company.name}`}
                            fill={colors.scope1}
                            name={`${company.name}_scope1`}
                            cursor="pointer"
                          />
                          <Bar
                            dataKey={`${company.name}_scope2`}
                            stackId={`stack-${company.name}`}
                            fill={colors.scope2}
                            name={`${company.name}_scope2`}
                            cursor="pointer"
                          />
                          <Bar
                            dataKey={`${company.name}_scope3`}
                            stackId={`stack-${company.name}`}
                            fill={colors.scope3}
                            name={`${company.name}_scope3`}
                            cursor="pointer"
                          />
                        </React.Fragment>
                      );
                    })
                : selectedSectors.map((sectorCode) => {
                    const sectorName =
                      SECTOR_NAMES[sectorCode as keyof typeof SECTOR_NAMES];
                    const colors =
                      sectorColors[sectorCode as keyof typeof sectorColors];
                    return (
                      <React.Fragment key={sectorCode}>
                        <Bar
                          dataKey={`${sectorName}_scope1`}
                          stackId={`stack-${sectorName}`}
                          fill={colors.scope1}
                          name={`${sectorName}_scope1`}
                          cursor="pointer"
                        />
                        <Bar
                          dataKey={`${sectorName}_scope2`}
                          stackId={`stack-${sectorName}`}
                          fill={colors.scope2}
                          name={`${sectorName}_scope2`}
                          cursor="pointer"
                        />
                        <Bar
                          dataKey={`${sectorName}_scope3`}
                          stackId={`stack-${sectorName}`}
                          fill={colors.scope3}
                          name={`${sectorName}_scope3`}
                          cursor="pointer"
                        />
                      </React.Fragment>
                    );
                  })}
              <Legend content={<CustomLegend payload={[]} />} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {selectedData && (
        <DetailPopup
          year={selectedData.year}
          sector={selectedData.sector}
          scope1={selectedData.scope1}
          scope2={selectedData.scope2}
          scope3={selectedData.scope3}
          onClose={() => setSelectedData(null)}
        />
      )}

      <EmissionsTrendAnalysis
        companies={companies}
        selectedSectors={selectedSectors}
      />

      <EmissionsSourcesAnalysis
        companies={companies}
        selectedSectors={selectedSectors}
        selectedYear={selectedYear}
      />
    </div>
  );
};

export default SectorEmissionsChart;
