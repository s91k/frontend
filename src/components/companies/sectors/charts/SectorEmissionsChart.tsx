import React from "react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Pattern,
} from "recharts";
import { useCompanyColors } from "@/hooks/companies/useCompanyFilters";
import { EmissionsUtils } from "@/types/emissions";
import { RankedCompany } from "@/types/company";
import { useTranslation } from "react-i18next";
import { NoDataIndicator } from "@/components/ui/NoDataIndicator";

interface SectorEmissionsChartProps {
  companies: RankedCompany[];
}

// Create a pattern component for no-data bars
const NoDataPattern = () => (
  <Pattern
    id="no-data-pattern"
    patternUnits="userSpaceOnUse"
    width="8"
    height="8"
    patternTransform="rotate(45)"
  >
    <rect width="8" height="8" fill="#333333" />
    <line x1="0" y1="0" x2="0" y2="8" stroke="#555555" strokeWidth="2" />
  </Pattern>
);

const SectorEmissionsChart: React.FC<SectorEmissionsChartProps> = ({
  companies,
}) => {
  const { t } = useTranslation();

  // Function to get colors for companies
  const getColor = (companyName: string) => {
    const companyColors = useCompanyColors();
    // Use a simple hash of the company name to get a consistent index
    const index =
      companyName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      6;
    return companyColors(index).base;
  };

  // Prepare chart data
  const chartData = companies.map((company) => {
    const emissions = EmissionsUtils.getTotal(
      company.reportingPeriods[0]?.emissions
    );

    return {
      name: company.name,
      value: emissions, // Can be null
      displayValue: EmissionsUtils.format(emissions, { showNoData: true }),
      hasData: emissions !== null,
    };
  });

  // Custom tooltip that handles null values
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-black-2 border border-black-1 p-3 rounded-md shadow-md">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">
            {data.hasData
              ? `${t("companiesPage.sectorGraphs.totalEmissions")}: ${
                  data.displayValue
                } tCO₂e`
              : t("common.noEmissionsData")}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[400px]">
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
          >
            <defs>
              <NoDataPattern />
            </defs>
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={70}
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
            />
            <YAxis
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              tickFormatter={(value) => EmissionsUtils.format(value)}
            />
            <Tooltip content={<CustomTooltip />} />
            {chartData.map((item) => (
              <Bar
                key={item.name}
                dataKey={item.hasData ? "value" : undefined}
                fill={item.hasData ? getColor(item.name) : "#cccccc"}
                // Add a pattern fill for no-data items
                {...(item.hasData ? {} : { fill: "url(#no-data-pattern)" })}
              >
                {item.hasData && (
                  <Cell key={`cell-${item.name}`} fill={getColor(item.name)} />
                )}
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full">
          <NoDataIndicator message={t("companiesPage.noCompaniesInSector")} />
        </div>
      )}
    </div>
  );
};

export default SectorEmissionsChart;
