import React from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  sectorColors,
  getCompanyColors,
} from "@/hooks/companies/useCompanyFilters";

interface PieLegendProps {
  payload: any[];
  selectedSector: string | null;
  handlePieClick: (data: any) => void;
}

const PieLegend: React.FC<PieLegendProps> = ({
  payload,
  selectedSector,
  handlePieClick,
}) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (!payload) return null;

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[200px] overflow-y-auto pr-2 ${
        isMobile ? "mt-4" : "mt-8"
      }`}
    >
      {payload.map((entry, index) => {
        const percentage = (
          (entry.payload.value / entry.payload.total) *
          100
        ).toFixed(1);

        // Debug to see what's in the entry
        console.log("Legend entry:", entry);

        // Fix color determination
        let color;
        if (selectedSector) {
          color = getCompanyColors(index).base;
        } else if (entry.payload && entry.payload.sectorCode) {
          // Use the sectorCode from payload
          const sectorCode = entry.payload.sectorCode;
          color = sectorColors[sectorCode as keyof typeof sectorColors]?.base;
        } else {
          color = "#888888";
        }

        return (
          <div
            key={`legend-${index}`}
            className="flex items-center gap-2 p-2 rounded bg-black-2 hover:bg-black-1 transition-colors cursor-pointer"
            onClick={() => handlePieClick(entry)}
          >
            <div
              className="w-3 h-3 rounded flex-shrink-0"
              style={{ backgroundColor: color }}
            />
            <div className="min-w-0 flex-1">
              <div className="text-sm text-white truncate">
                {entry.name || entry.value}
              </div>
              <div className="text-xs text-grey flex justify-between">
                <span>
                  {Math.round(entry.payload.value).toLocaleString()} tCO₂e
                </span>
                <span>{percentage}%</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PieLegend;
