import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { getMethodById } from "@/lib/methods/methodologyData";
import { Trans } from "react-i18next";
import { LinkButton } from "@/components/layout/LinkButton";
import { SourcesContent } from "./content/SourcesContent";
import { CompanyDataOverviewContent } from "./content/CompanyDataOverview";
import { CompanyDataCollectionContent } from "./content/CompanyDataCollectionContent";
import { DataCollectionProcessContent } from "./content/DataCollectionProcess";
import { EmissionsAndCategoriesContent } from "./content/Emissions and Categories";
import { HistoricalDataContent } from "./content/HistoricalData";
import { ParisAgreementContent } from "./content/ParisAgreementContent";
import { CO2BudgetsContent } from "./content/CO2BudgetsContent";
import { EmissionTypesContent } from "./content/EmissionTypesContent";
import { CalculationsContent } from "./content/CalculationsContent";

interface MethodContent {
  paragraph1?: string;
  paragraph2?: string;
  paragraph3?: string;
  paragraph4?: string;
  paragraph5?: string;
  paragraph6?: string;
  link1?: string;
  link2?: string;
  link?: {
    title: string;
    text: string;
  };
  [key: string]: any;
}

interface SectionProps {
  title?: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <div className="space-y-4 mb-8">
      {title && <h2 className="text-xl font-semibold text-white">{title}</h2>}
      {children}
    </div>
  );
}

interface MethodologyContentProps {
  method: string;
  onNavigate: (methodId: string) => void;
}

export function MethodologyContent({ method }: MethodologyContentProps) {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(true);
  const methodData = getMethodById(method);

  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [method]);

  if (!methodData) {
    return (
      <div className="card-dark">
        <p className="text-grey">{t("methodsPage.methodNotFound")}</p>
      </div>
    );
  }

  const renderContent = () => {
    const content = t(`methodsPage.accordion.${method}`, {
      returnObjects: true,
    }) as MethodContent;

    switch (method) {
      case "sources":
        return <SourcesContent />;

      case "parisAgreement":
        return <ParisAgreementContent />;

      case "co2Budgets":
        return <CO2BudgetsContent />;

      case "emissionTypes":
        return <EmissionTypesContent />;

      case "companyDataOverview":
        return <CompanyDataOverviewContent />;

      case "emissionCategories":
        return <EmissionsAndCategoriesContent />;

      case "historicalData":
        return <HistoricalDataContent />;

      case "calculations":
        return <CalculationsContent />;

      case "companyDataCollection":
        return <DataCollectionProcessContent />;
    }
  };

  return (
    <div
      className={`transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
    >
      <div className="bg-black-2 rounded-level-1 p-16">
        <div className="border-b border-black-1 pb-6 mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">
            {t(`methodsPage.accordion.${method}.title`)}
          </h1>
          <p className="text-grey">
            {t(`methodsPage.accordion.${method}.description`)}
          </p>
        </div>
        <div className="prose prose-invert max-w-none">{renderContent()}</div>
      </div>
    </div>
  );
}
