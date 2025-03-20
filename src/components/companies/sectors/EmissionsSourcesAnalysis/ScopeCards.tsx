import React, { useState } from 'react';
import { Factory, Building2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { RankedCompany } from '@/hooks/companies/useCompanies';
import ScopeCard from './ScopeCard';
import ScopeModal from './ScopeModal';

interface ScopeCardsProps {
  scopeData: any;
  totalEmissions: number;
  companies: RankedCompany[];
  selectedSectors: string[];
  selectedYear: string;
}

const ScopeCards: React.FC<ScopeCardsProps> = ({
  scopeData,
  totalEmissions,
  companies,
  selectedSectors,
  selectedYear
}) => {
  const [selectedScope, setSelectedScope] = useState<'scope1' | 'scope2' | 'scope3_upstream' | 'scope3_downstream' | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ScopeCard
          title="Scope 1"
          icon={Factory}
          value={scopeData.scope1.total}
          companies={scopeData.scope1.companies}
          color="bg-orange-3"
          percent={(scopeData.scope1.total / totalEmissions) * 100}
          description="Direct emissions from owned or controlled sources"
          onClick={() => setSelectedScope('scope1')}
        />
        <ScopeCard
          title="Scope 2"
          icon={Building2}
          value={scopeData.scope2.total}
          companies={scopeData.scope2.companies}
          color="bg-pink-3"
          percent={(scopeData.scope2.total / totalEmissions) * 100}
          description="Indirect emissions from purchased electricity and energy"
          onClick={() => setSelectedScope('scope2')}
        />
        <ScopeCard
          title="Scope 3 (Upstream)"
          icon={ArrowUpRight}
          value={scopeData.scope3.upstream.total}
          companies={scopeData.scope3.upstream.companies}
          color="bg-blue-3"
          percent={(scopeData.scope3.upstream.total / totalEmissions) * 100}
          description="Indirect emissions from the supply chain"
          onClick={() => setSelectedScope('scope3_upstream')}
        />
        <ScopeCard
          title="Scope 3 (Downstream)"
          icon={ArrowDownRight}
          value={scopeData.scope3.downstream.total}
          companies={scopeData.scope3.downstream.companies}
          color="bg-green-3"
          percent={(scopeData.scope3.downstream.total / totalEmissions) * 100}
          description="Indirect emissions from product use and end-of-life"
          onClick={() => setSelectedScope('scope3_downstream')}
        />
      </div>

      {selectedScope && (
        <ScopeModal
          scope={selectedScope}
          title={
            selectedScope === 'scope1' ? 'Scope 1 Emissions by Sector' :
            selectedScope === 'scope2' ? 'Scope 2 Emissions by Sector' :
            selectedScope === 'scope3_upstream' ? 'Scope 3 Upstream Emissions by Sector' :
            'Scope 3 Downstream Emissions by Sector'
          }
          onClose={() => setSelectedScope(null)}
          companies={companies}
          selectedSectors={selectedSectors}
          selectedYear={selectedYear}
        />
      )}
    </>
  );
};

export default ScopeCards;