import { Trans, useTranslation } from "react-i18next";
import { LinkButton } from "@/components/layout/LinkButton";
import { Text } from "@/components/ui/text";

interface MethodContentCardProps {
  method: string;
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section = ({ title, children }: SectionProps) => (
  <div className="space-y-4">
    <Text className="text-blue-2 font-bold text-2xl">{title}</Text>
    {children}
  </div>
);

const ParisAgreementContent = () => {
  const { t } = useTranslation();
  return (
    <div className="prose prose-invert w-[90%] max-w-5xl mx-auto space-y-4">
      <p>{t("methodsPage.accordion.parisAgreement.paragraph1")}</p>
      <p>
        <Trans
          i18nKey="methodsPage.accordion.parisAgreement.paragraph2"
          components={[
            <a
              title="IEA"
              className="underline hover:text-white transition-colors"
              href="https://www.iea.org/reports/co2-emissions-in-2023"
              target="_blank"
              rel="noopener noreferrer"
            />,
          ]}
        />
      </p>
      <p>{t("methodsPage.accordion.parisAgreement.paragraph3")}</p>
      <div className="flex justify-center">
        <div className="w-full max-w-4xl">
          <LinkButton
            title={t("methodsPage.accordion.parisAgreement.link.title")}
            text={t("methodsPage.accordion.parisAgreement.link.text")}
            link="https://www.naturvardsverket.se/parisavtalet"
          />
        </div>
      </div>
    </div>
  );
};

const SourcesContent = () => {
  const { t } = useTranslation();
  return (
    <div className="prose prose-invert w-[90%] max-w-5xl mx-auto space-y-8">
      <p>{t("methodsPage.accordion.sources.paragraph1")}</p>
      <p>{t("methodsPage.accordion.sources.paragraph2")}</p>
      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {[
            "smhi",
            "skr",
            "wikidata",
            "trafikanalys",
            "nvdb",
            "sei",
            "powerCircles",
            "klimatplaner",
            "upphandlingsmyndigheten",
            "greenpeace",
          ].map((key) => (
            <LinkButton
              key={key}
              title={t(`methodsPage.accordion.sources.links.${key}.title`)}
              text={t(`methodsPage.accordion.sources.links.${key}.text`)}
              link={t(`methodsPage.accordion.sources.links.${key}.link`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const CalculationsContent = () => {
  const { t } = useTranslation();
  return (
    <div className="prose prose-invert w-[90%] max-w-5xl mx-auto space-y-8">
      <p>{t("methodsPage.accordion.calculations.paragraph1")}</p>
      <p>
        <Trans
          i18nKey="methodsPage.accordion.calculations.paragraph2"
          components={[
            <a
              title="Här"
              className="underline hover:text-white transition-colors"
              href="https://docs.google.com/document/d/1MihysUkfunbV0LjwSUCiGSqWQSo5U03K0RMbRsVBL7U"
              target="_blank"
              rel="noopener noreferrer"
            />,
          ]}
        />
      </p>
    </div>
  );
};

const CompanyDataCollectionContent = () => {
  const { t } = useTranslation();
  return (
    <div className="prose prose-invert w-[90%] max-w-5xl mx-auto space-y-8">
      <p>{t("methodsPage.accordion.companyDataCollection.paragraph1")}</p>
      <div className="flex justify-center">
        <div className="w-full space-y-6">
          <LinkButton
            title={t("methodsPage.accordion.companyDataCollection.link1")}
            text={t("methodsPage.accordion.companyDataCollection.paragraph2")}
            link="/companies"
          />
        </div>
      </div>
      <p>{t("methodsPage.accordion.companyDataCollection.paragraph3")}</p>
      <p>{t("methodsPage.accordion.companyDataCollection.paragraph4")}</p>
      <div className="flex justify-center">
        <div className="w-full space-y-6">
          <LinkButton
            title={t("methodsPage.accordion.companyDataCollection.link2")}
            text={t("methodsPage.accordion.companyDataCollection.paragraph5")}
            link="https://ghgprotocol.org/"
          />
        </div>
      </div>

      <Section
        title={t(
          "methodsPage.accordion.companyDataCollection.companiesIncluded.title",
        )}
      >
        <p>
          {t(
            "methodsPage.accordion.companyDataCollection.companiesIncluded.paragraph1",
          )}
        </p>
        <p>
          {t(
            "methodsPage.accordion.companyDataCollection.companiesIncluded.paragraph2",
          )}
        </p>
        <div className="flex justify-center">
          <div className="w-full space-y-6">
            <LinkButton
              title={t("methodsPage.accordion.companyDataCollection.link2")}
              text={t(
                "methodsPage.accordion.companyDataCollection.companiesIncluded.paragraph3",
              )}
              link="https://www.msci.com/our-solutions/indexes/gics"
            />
          </div>
        </div>
        <p>
          {t(
            "methodsPage.accordion.companyDataCollection.companiesIncluded.paragraph4",
          )}
        </p>
        <p>
          {t(
            "methodsPage.accordion.companyDataCollection.companiesIncluded.paragraph5",
          )}
        </p>
      </Section>

      <Section
        title={t(
          "methodsPage.accordion.companyDataCollection.dataPresented.title",
        )}
      >
        <p>
          {t(
            "methodsPage.accordion.companyDataCollection.dataPresented.paragraph1",
          )}
        </p>
        <p>
          {t(
            "methodsPage.accordion.companyDataCollection.dataPresented.paragraph2",
          )}
        </p>
        <p>
          {t(
            "methodsPage.accordion.companyDataCollection.dataPresented.paragraph3",
          )}
        </p>
        <p>
          {t(
            "methodsPage.accordion.companyDataCollection.dataPresented.paragraph4",
          )}
        </p>
      </Section>

      <Section
        title={t(
          "methodsPage.accordion.companyDataCollection.fiscalYear.title",
        )}
      >
        <p>
          {t(
            "methodsPage.accordion.companyDataCollection.fiscalYear.paragraph1",
          )}
        </p>
      </Section>

      <Section
        title={t("methodsPage.accordion.companyDataCollection.scope2.title")}
      >
        <p>
          {t("methodsPage.accordion.companyDataCollection.scope2.paragraph1")}
        </p>
      </Section>

      <Section
        title={t("methodsPage.accordion.companyDataCollection.scope3.title")}
      >
        <p>
          {t("methodsPage.accordion.companyDataCollection.scope3.paragraph1")}
        </p>
        <p>
          {t("methodsPage.accordion.companyDataCollection.scope3.paragraph2")}
        </p>
        <div className="flex justify-center">
          <div className="w-full space-y-6">
            <LinkButton
              title={t(
                "methodsPage.accordion.companyDataCollection.scope3.link",
              )}
              text={t(
                "methodsPage.accordion.companyDataCollection.scope3.paragraph3",
              )}
              link="https://www.fastighetsagarna.se/globalassets/broschyrer-och-faktablad/riktlinjer/vagledning-rapportering-av-utslapp-i-scope-3-for-fastighetsagare.pdf?bustCache=1739437148312"
            />
          </div>
        </div>
      </Section>

      <Section
        title={t(
          "methodsPage.accordion.companyDataCollection.financedEmissions.title",
        )}
      >
        <p>
          {t(
            "methodsPage.accordion.companyDataCollection.financedEmissions.paragraph1",
          )}
        </p>
      </Section>

      <Section
        title={t(
          "methodsPage.accordion.companyDataCollection.biogenicEmissions.title",
        )}
      >
        <p>
          {t(
            "methodsPage.accordion.companyDataCollection.biogenicEmissions.paragraph1",
          )}
        </p>
      </Section>

      <Section
        title={t("methodsPage.accordion.companyDataCollection.goals.title")}
      >
        <p>
          {t("methodsPage.accordion.companyDataCollection.goals.paragraph1")}
        </p>
      </Section>

      <Section
        title={t(
          "methodsPage.accordion.companyDataCollection.historicEmissions.title",
        )}
      >
        <p>
          {t(
            "methodsPage.accordion.companyDataCollection.historicEmissions.paragraph1",
          )}
        </p>
      </Section>

      <Section
        title={t(
          "methodsPage.accordion.companyDataCollection.emissionOffsets.title",
        )}
      >
        <p>
          {t(
            "methodsPage.accordion.companyDataCollection.emissionOffsets.paragraph1",
          )}
        </p>
      </Section>
    </div>
  );
};

const CO2BudgetsContent = () => {
  const { t } = useTranslation();
  return (
    <div className="prose prose-invert w-[90%] max-w-5xl mx-auto space-y-8">
      <p>{t("methodsPage.accordion.co2Budgets.paragraph1")}</p>
      <p>
        <Trans
          i18nKey="methodsPage.accordion.co2Budgets.paragraph2"
          components={[
            <a
              title="Uppsala universitet"
              className="underline hover:text-white transition-colors"
              href="https://www.cemus.uu.se/wp-content/uploads/2023/12/Paris-compliant-carbon-budgets-for-Swedens-counties-.pdf"
              target="_blank"
              rel="noopener noreferrer"
            />,
          ]}
        />
      </p>
      <p>{t("methodsPage.accordion.co2Budgets.paragraph3")}</p>
      <p>{t("methodsPage.accordion.co2Budgets.paragraph4")}</p>
      <p>{t("methodsPage.accordion.co2Budgets.paragraph5")}</p>
      <p>{t("methodsPage.accordion.co2Budgets.paragraph6")}</p>
      <p>{t("methodsPage.accordion.co2Budgets.paragraph7")}</p>
      <p>
        <Trans
          i18nKey="methodsPage.accordion.co2Budgets.paragraph8"
          components={[
            <a
              title="Chalmers"
              className="underline hover:text-white transition-colors"
              href="https://research.chalmers.se/publication/530543/file/530543_Fulltext.pdf"
              target="_blank"
              rel="noopener noreferrer"
            />,
          ]}
        />
      </p>
    </div>
  );
};

const EmissionTypesContent = () => {
  const { t } = useTranslation();
  return (
    <div className="prose prose-invert w-[90%] max-w-5xl mx-auto space-y-8">
      {[...Array(6).keys()].map((i) => (
        <p key={i}>
          {t(`methodsPage.accordion.emissionTypes.paragraph${i + 1}`)}
        </p>
      ))}
    </div>
  );
};

export function MethodContentCard({ method }: MethodContentCardProps) {
  const renderContent = () => {
    switch (method) {
      case "parisAgreement":
        return <ParisAgreementContent />;
      case "sources":
        return <SourcesContent />;
      case "calculations":
        return <CalculationsContent />;
      case "companyDataCollection":
        return <CompanyDataCollectionContent />;
      case "co2Budgets":
        return <CO2BudgetsContent />;
      case "emissionTypes":
        return <EmissionTypesContent />;
      default:
        return null;
    }
  };

  return <div className="bg-black-2 rounded-2xl p-8">{renderContent()}</div>;
}
