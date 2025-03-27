import React from "react";
import { useTranslation } from "react-i18next";
import {
  useSectorColors,
  useCompanyColors,
} from "@/hooks/companies/useCompanyFilters";
import { useScreenSize } from "@/hooks/useScreenSize";

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
  const isMobile = useScreenSize();
  const { t } = useTranslation();
  const navigateToCompany = (wikidataId: string) => {
    window.location.href = `/companies/${wikidataId}`;
  };

  if (!payload) return null;

  const handleItemClick = (entry: any) => {
    if (selectedSector) {
      // If we're viewing companies within a sector, navigate to company detail page
      if (entry.wikidataId) {
        navigateToCompany(entry.wikidataId);
      } else if (entry.payload && entry.payload.wikidataId) {
        navigateToCompany(entry.payload.wikidataId);
      } else {
        console.log("No wikidataId found in entry:", entry);
      }
    } else {
      // If we're viewing sectors, handle the sector selection
      handlePieClick(entry);
    }
  };

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[200px] overflow-y-auto pr-2 ${
        isMobile ? "mt-4" : "mt-8"
      }`}
    >
      {payload.map((entry, index) => {
        console.log("Entry in map:", entry);
        const percentage = (
          (entry.payload.value / entry.payload.total) *
          100
        ).toFixed(1);

        let color;
        if (selectedSector) {
          const companyColors = useCompanyColors();
          color = companyColors(index).base;
        } else if (entry.payload && entry.payload.sectorCode) {
          // Use the sectorCode from payload
          const sectorCode = entry.payload.sectorCode;
          const sectorColors = useSectorColors();
          color = sectorColors(sectorCode);
        } else {
          color = "#888888";
        }

        return (
          <div
            key={`legend-${index}`}
            className={`flex items-center gap-2 p-2 rounded bg-black-2 hover:bg-black-1 transition-colors cursor-pointer ${
              selectedSector ? "hover:ring-1 hover:ring-black-1" : ""
            }`}
            onClick={() => handleItemClick(entry)}
            title={
              selectedSector
                ? t("companies.sectorGraphs.pieLegendCompany")
                : t("companies.sectorGraphs.pieLegendSector")
            }
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
