import React, { useEffect, useRef } from "react";
import { BarChart3, ChevronDown } from "lucide-react";
import { t } from "i18next";
import { useMunicipalityKPIs } from "../../../hooks/useMunicipalityKPIs";
import { KPIValue } from "@/types/municipality";

interface DataSelectorProps {
  selectedKPI: KPIValue;
  onDataPointChange: (kpiValue: KPIValue) => void;
}

const DataSelector = ({
  selectedKPI,
  onDataPointChange,
}: DataSelectorProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const municipalityKPIs = useMunicipalityKPIs();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKPISelect = (kpiValue: KPIValue) => {
    onDataPointChange(kpiValue);
    setIsOpen(false);
  };

  const getKPITranslation = (
    key: string,
    type: "label" | "detailedDescription",
  ) => t(`municipalities.list.kpis.${key}.${type}`);

  return (
    <div className="bg-black-2 rounded-2xl p-4 mb-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs text-gray-500 px-2 pb-2">
          <BarChart3 className="w-4 h-4" />
          <label className="font-medium">
            {t("municipalities.list.dataSelector.label")}
          </label>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-black-1 text-white transition-colors"
          >
            <span className="text-left font-medium">
              {getKPITranslation(selectedKPI.key, "label")}
            </span>
            <ChevronDown
              className={`w-5 h-5 text-white transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isOpen && (
            <div className="absolute z-50 w-full mt-2 bg-black-1 rounded-xl shadow-lg overflow-hidden backdrop-blur-sm">
              {municipalityKPIs.map((kpiValue) => {
                const isSelected = selectedKPI.key === kpiValue.key;
                return (
                  <button
                    key={kpiValue.key}
                    onClick={() => handleKPISelect(kpiValue)}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                      isSelected
                        ? "bg-gray-700/80 text-blue-300"
                        : "text-white hover:bg-gray-700/80"
                    }`}
                  >
                    <span className="font-medium">{kpiValue.label}</span>
                    {kpiValue.description && (
                      <p className="text-xs text-white/50 mt-1">
                        {t(kpiValue.description)}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <p className="leading-relaxed text-sm px-2 py-1 text-gray-500">
          {getKPITranslation(selectedKPI.key, "detailedDescription")}
        </p>
      </div>
    </div>
  );
};

export default DataSelector;
