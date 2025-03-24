import React from 'react';
import { ArrowUpRight, Factory, ArrowDownRight } from 'lucide-react';

interface KeyInsightsProps {
  scopeData: any;
  totalEmissions: number;
}

const KeyInsights: React.FC<KeyInsightsProps> = ({ scopeData, totalEmissions }) => (
  <div className="bg-black-1 border border-black-2 rounded-lg p-6">
    <h3 className="text-lg font-light text-white mb-4">Key Insights</h3>
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="rounded-full p-2 bg-blue-5">
          <ArrowUpRight className="h-4 w-4 text-blue-3" />
        </div>
        <div>
          <div className="text-sm font-medium text-white">Supply Chain Impact</div>
          <div className="text-sm text-grey">
            Scope 3 upstream emissions account for {((scopeData.scope3.upstream.total / totalEmissions) * 100).toFixed(1)}% of total emissions
          </div>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <div className="rounded-full p-2 bg-orange-5">
          <Factory className="h-4 w-4 text-orange-3" />
        </div>
        <div>
          <div className="text-sm font-medium text-white">Operational Footprint</div>
          <div className="text-sm text-grey">
            Direct emissions (Scope 1) represent {((scopeData.scope1.total / totalEmissions) * 100).toFixed(1)}% of the total footprint
          </div>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <div className="rounded-full p-2 bg-green-5">
          <ArrowDownRight className="h-4 w-4 text-green-3" />
        </div>
        <div>
          <div className="text-sm font-medium text-white">Product Lifecycle</div>
          <div className="text-sm text-grey">
            Downstream activities contribute {((scopeData.scope3.downstream.total / totalEmissions) * 100).toFixed(1)}% to total emissions
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default KeyInsights