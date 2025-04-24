import { t } from "i18next";
import { useMunicipalityKPIs } from "../../../hooks/useMunicipalityKPIs";
import { KPIValue } from "@/types/municipality";
import { DataSelector } from "@/components/layout/DataSelector";

interface MunicipalityDataSelectorProps {
  selectedKPI: KPIValue;
  onDataPointChange: (kpiValue: KPIValue) => void;
}

const MunicipalityDataSelector = ({
  selectedKPI,
  onDataPointChange,
}: MunicipalityDataSelectorProps) => {
  const municipalityKPIs = useMunicipalityKPIs();

  return (
    <DataSelector<KPIValue>
      label={t("municipalities.list.dataSelector.label")}
      selectedItem={selectedKPI}
      items={municipalityKPIs}
      onItemChange={onDataPointChange}
      getItemLabel={(kpi: KPIValue) =>
        t(`municipalities.list.kpis.${kpi.key}.label`)
      }
      getItemKey={(kpi: KPIValue) => kpi.key}
    />
  );
};

export default MunicipalityDataSelector;
