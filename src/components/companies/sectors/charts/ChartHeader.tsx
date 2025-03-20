import React from "react";
import { PieChart, BarChart3, ArrowLeft, Filter } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface ChartHeaderProps {
  selectedSector: string | null;
  chartType: "stacked-total" | "pie";
  totalEmissions: number;
  selectedYear: string;
  years: string[];
  onSectorClear: () => void;
  onChartTypeChange: (type: "stacked-total" | "pie") => void;
  onYearChange: (year: string) => void;
  selectedSectors: string[];
  SECTOR_NAMES: Record<string, string>;
}

const ChartHeader: React.FC<ChartHeaderProps> = ({
  selectedSector,
  chartType,
  totalEmissions,
  selectedYear,
  years,
  onSectorClear,
  onChartTypeChange,
  onYearChange,
  selectedSectors,
  SECTOR_NAMES,
}) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="flex flex-col gap-4">
      <div
        className={`flex ${
          isMobile ? "flex-col gap-4" : "justify-between items-center"
        }`}
      >
        <div
          className={`flex ${isMobile ? "flex-wrap" : ""} items-center gap-2`}
        >
          {selectedSector && (
            <button
              onClick={onSectorClear}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-grey hover:text-white focus:outline-none transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Back</span>
            </button>
          )}
          <div
            className={`flex ${isMobile ? "flex-wrap" : ""} items-center gap-2`}
          >
            <button
              onClick={() => onChartTypeChange("pie")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg focus:outline-none transition-colors ${
                chartType === "pie"
                  ? "bg-black-1 text-white"
                  : "text-grey hover:text-white"
              }`}
            >
              <PieChart className="h-4 w-4" />
              <span className="text-sm font-medium">Pie</span>
            </button>
            <button
              onClick={() => onChartTypeChange("stacked-total")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg focus:outline-none transition-colors ${
                chartType === "stacked-total"
                  ? "bg-black-1 text-white"
                  : "text-grey hover:text-white"
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span className="text-sm font-medium">Total</span>
            </button>
          </div>
        </div>

        {chartType === "pie" && (
          <div
            className={`flex items-center ${
              isMobile ? "justify-between w-full" : "gap-4"
            }`}
          >
            <div className={isMobile ? "text-left" : "text-right"}>
              <div className="text-sm text-grey">
                {selectedSector ? "Sector Total" : "Total"} Emissions
              </div>
              <div className="text-xl font-light text-white">
                {Math.round(totalEmissions).toLocaleString()} tCO₂e
              </div>
            </div>
            <select
              value={selectedYear}
              onChange={(e) => onYearChange(e.target.value)}
              className="bg-black-2 border border-black-1 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-3 transition-shadow"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {chartType !== "pie" && (
        <div className="flex items-center gap-2 text-sm text-grey">
          <Filter className="h-4 w-4" />
          {selectedSector ? (
            <span>Showing companies in {SECTOR_NAMES[selectedSector]}</span>
          ) : (
            <span>
              Showing {selectedSectors.length} of{" "}
              {Object.keys(SECTOR_NAMES).length} sectors
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ChartHeader;
