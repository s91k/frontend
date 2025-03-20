import React from "react";
import { RankedCompany } from "@/hooks/companies/useCompanies";
import SectorEmissionsChart from "@/components/companies/sectors/SectorEmissionsChart";
import { CompanySector } from "@/hooks/companies/useCompanyFilters";
import { SECTOR_NAMES } from "@/hooks/companies/useCompanyFilters";

interface SectorGraphsProps {
  companies: RankedCompany[];
  selectedSectors?: CompanySector[];
}

const SectorGraphs: React.FC<SectorGraphsProps> = ({
  companies,
  selectedSectors = [],
}) => {
  // Convert selectedSectors to string[] for SectorEmissionsChart
  const sectorCodes = selectedSectors.filter((sector) => sector !== "all");

  return (
    <div className="bg-black">
      <div className="bg-black-2 rounded-lg border p-6">
        <SectorEmissionsChart
          companies={companies}
          selectedSectors={
            sectorCodes.length > 0
              ? sectorCodes
              : Object.keys(SECTOR_NAMES).filter((key) => key !== "all")
          }
        />
      </div>
    </div>
  );
};

export default SectorGraphs;
