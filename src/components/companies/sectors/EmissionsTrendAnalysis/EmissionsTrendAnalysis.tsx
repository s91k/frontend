import React, { useState } from "react";
import { RankedCompany } from "@/types/company";
import { useTrendAnalysis } from "@/hooks/companies/useTrendAnalysis";
import TrendCards from "./TrendCards";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface EmissionsTrendAnalysisProps {
  companies: RankedCompany[];
  selectedSectors: string[];
}

const EmissionsTrendAnalysis: React.FC<EmissionsTrendAnalysisProps> = ({
  companies,
  selectedSectors,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<
    "decreasing" | "increasing" | "noComparable" | null
  >(null);
  const trends = useTrendAnalysis(companies, selectedSectors);
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="mt-12 space-y-6">
      <div className={`flex ${isMobile ? "flex-col" : "items-center"} gap-2`}>
        <h2 className="text-xl font-light text-white">
          Emissions Trend Analysis
        </h2>
        <span className="text-sm text-grey">(From Base Year)</span>
      </div>

      <TrendCards
        trends={trends}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />
    </div>
  );
};

export default EmissionsTrendAnalysis;
