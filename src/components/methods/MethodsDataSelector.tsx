import { t } from "i18next";
import { DataSelector } from "@/components/layout/DataSelector";

interface MethodsDataSelectorProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
}

const methods = [
  "parisAgreement",
  "sources",
  "calculations",
  "companyDataCollection",
  "co2Budgets",
  "emissionTypes",
];

const MethodsDataSelector = ({
  selectedMethod,
  onMethodChange,
}: MethodsDataSelectorProps) => {
  return (
    <DataSelector
      label={t("methodsPage.dataSelector.label")}
      selectedItem={selectedMethod}
      items={methods}
      onItemChange={onMethodChange}
      getItemLabel={(method) => t(`methodsPage.accordion.${method}.title`)}
      getItemKey={(method) => method}
    />
  );
};

export default MethodsDataSelector;
