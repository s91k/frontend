import React from "react";
import { ArrowUpRight, Factory, ArrowDownRight } from "lucide-react";
import { useTranslation } from "react-i18next";
interface KeyInsightsProps {
  scopeData: any;
  totalEmissions: number;
}

const KeyInsights: React.FC<KeyInsightsProps> = ({
  scopeData,
  totalEmissions,
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-black-1 border border-black-2 rounded-lg p-6">
      <h3 className="text-lg font-light text-white mb-4">
        {t("companiesPage.sectorGraphs.keyInsights")}
      </h3>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="rounded-full p-2 bg-blue-5">
            <ArrowUpRight className="h-4 w-4 text-blue-3" />
          </div>
          <div>
            <div className="text-sm font-medium text-white">
              {t("companiesPage.sectorGraphs.supplyChainImpact")}
            </div>
            <div className="text-sm text-grey">
              {t("companiesPage.sectorGraphs.scope3UpstreamDetails")}
              {(
                (scopeData.scope3.upstream.total / totalEmissions) *
                100
              ).toFixed(1)}
              %{t("companiesPage.sectorGraphs.ofTotalEmissionsDescription")}
            </div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="rounded-full p-2 bg-orange-5">
            <Factory className="h-4 w-4 text-orange-3" />
          </div>
          <div>
            <div className="text-sm font-medium text-white">
              {t("companiesPage.sectorGraphs.operationalFootprint")}
            </div>
            <div className="text-sm text-grey">
              {t("companiesPage.sectorGraphs.directEmissionsDescription")}
              {((scopeData.scope1.total / totalEmissions) * 100).toFixed(1)}%
              {t("companiesPage.sectorGraphs.ofTotalFootprintDescription")}
            </div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="rounded-full p-2 bg-green-5">
            <ArrowDownRight className="h-4 w-4 text-green-3" />
          </div>
          <div>
            <div className="text-sm font-medium text-white">
              {t("companiesPage.sectorGraphs.productLifecycle")}
            </div>
            <div className="text-sm text-grey">
              {t("companiesPage.sectorGraphs.downstreamActivitiesDescription")}
              {(
                (scopeData.scope3.downstream.total / totalEmissions) *
                100
              ).toFixed(1)}
              %{t("companiesPage.sectorGraphs.toTotalEmissions")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyInsights;
