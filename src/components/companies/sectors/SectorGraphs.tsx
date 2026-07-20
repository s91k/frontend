import React from "react";
import { RankedCompany } from "@/types/company";
import type { CompanySector } from "@/lib/constants/sectors";
import { useSectorNames } from "@/hooks/companies/useCompanySectors";
import SectorEmissionsChart from "@/components/companies/sectors/charts/SectorEmissionsChart";

interface SectorGraphsProps {
  companies: RankedCompany[];
  sectors?: CompanySector[];
  selectedSector: CompanySector | null;
}

const SectorGraphs: React.FC<SectorGraphsProps> = ({
  companies,
  sectors = [],
  selectedSector,
}) => {
  // Convert selectedSectors to string[] for SectorEmissionsChart
  const sectorCodes = sectors.filter((sector) => sector !== "all");
  const sectorNames = useSectorNames();

  return (
    <div className="bg-black space-y-4">
      <SectorEmissionsChart
        companies={companies}
        sectors={
          sectorCodes.length > 0
            ? sectorCodes
            : Object.keys(sectorNames).filter((key) => key !== "all")
        }
        selectedSector={selectedSector}
      />
    </div>
  );
};

export default SectorGraphs;
