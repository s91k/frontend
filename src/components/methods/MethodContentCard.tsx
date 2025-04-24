import { Trans, useTranslation } from "react-i18next";
import { LinkButton } from "@/components/layout/LinkButton";
import { Text } from "@/components/ui/text";

interface MethodContentCardProps {
  method: string;
}

export function MethodContentCard({ method }: MethodContentCardProps) {
  const { t } = useTranslation();

  const renderContent = () => {
    switch (method) {
      case "parisAgreement":
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
              <LinkButton
                title={t("methodsPage.accordion.parisAgreement.link.title")}
                text={t("methodsPage.accordion.parisAgreement.link.text")}
                link="https://www.naturvardsverket.se/parisavtalet"
              />
            </div>
          </div>
        );

      case "sources":
        return (
          <div className="prose prose-invert w-[90%] max-w-5xl mx-auto space-y-8">
            <p>{t("methodsPage.accordion.sources.paragraph1")}</p>
            <p>{t("methodsPage.accordion.sources.paragraph2")}</p>
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
        );

      case "calculations":
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

      case "companyDataCollection":
        return (
          <div className="prose prose-invert w-[90%] max-w-5xl mx-auto space-y-8">
            <p>{t("methodsPage.accordion.companyDataCollection.paragraph1")}</p>
            <div className="space-y-6 max-w-3xl">
              <LinkButton
                title={t("methodsPage.accordion.companyDataCollection.link1")}
                text={t(
                  "methodsPage.accordion.companyDataCollection.paragraph2",
                )}
                link="/companies"
              />
            </div>
            <p>{t("methodsPage.accordion.companyDataCollection.paragraph3")}</p>
            <p>{t("methodsPage.accordion.companyDataCollection.paragraph4")}</p>
            <div className="space-y-6 max-w-3xl">
              <LinkButton
                title={t("methodsPage.accordion.companyDataCollection.link2")}
                text={t(
                  "methodsPage.accordion.companyDataCollection.paragraph5",
                )}
                link="https://ghgprotocol.org/"
              />
            </div>

            <div className="space-y-4">
              <Text className="text-blue-2 font-bold text-2xl">
                {t(
                  "methodsPage.accordion.companyDataCollection.companiesIncluded.title",
                )}
              </Text>
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
              <div className="space-y-6 max-w-3xl">
                <LinkButton
                  title={t("methodsPage.accordion.companyDataCollection.link2")}
                  text={t(
                    "methodsPage.accordion.companyDataCollection.companiesIncluded.paragraph3",
                  )}
                  link="https://www.msci.com/our-solutions/indexes/gics"
                />
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
            </div>

            <div className="space-y-4">
              <Text className="text-blue-2 font-bold text-2xl">
                {t(
                  "methodsPage.accordion.companyDataCollection.dataPresented.title",
                )}
              </Text>
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
            </div>

            <div className="space-y-4">
              <Text className="text-blue-2 font-bold text-2xl">
                {t(
                  "methodsPage.accordion.companyDataCollection.fiscalYear.title",
                )}
              </Text>
              <p>
                {t(
                  "methodsPage.accordion.companyDataCollection.fiscalYear.paragraph1",
                )}
              </p>
            </div>

            <div className="space-y-4">
              <Text className="text-blue-2 font-bold text-2xl">
                {t("methodsPage.accordion.companyDataCollection.scope2.title")}
              </Text>
              <p>
                {t(
                  "methodsPage.accordion.companyDataCollection.scope2.paragraph1",
                )}
              </p>
            </div>

            <div className="space-y-4">
              <Text className="text-blue-2 font-bold text-2xl">
                {t("methodsPage.accordion.companyDataCollection.scope3.title")}
              </Text>
              <p>
                {t(
                  "methodsPage.accordion.companyDataCollection.scope3.paragraph1",
                )}
              </p>
              <p>
                {t(
                  "methodsPage.accordion.companyDataCollection.scope3.paragraph2",
                )}
              </p>
              <div className="space-y-6 max-w-3xl">
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

            <div className="space-y-4">
              <Text className="text-blue-2 font-bold text-2xl">
                {t(
                  "methodsPage.accordion.companyDataCollection.financedEmissions.title",
                )}
              </Text>
              <p>
                {t(
                  "methodsPage.accordion.companyDataCollection.financedEmissions.paragraph1",
                )}
              </p>
            </div>

            <div className="space-y-4">
              <Text className="text-blue-2 font-bold text-2xl">
                {t(
                  "methodsPage.accordion.companyDataCollection.biogenicEmissions.title",
                )}
              </Text>
              <p>
                {t(
                  "methodsPage.accordion.companyDataCollection.biogenicEmissions.paragraph1",
                )}
              </p>
            </div>

            <div className="space-y-4">
              <Text className="text-blue-2 font-bold text-2xl">
                {t("methodsPage.accordion.companyDataCollection.goals.title")}
              </Text>
              <p>
                {t(
                  "methodsPage.accordion.companyDataCollection.goals.paragraph1",
                )}
              </p>
            </div>

            <div className="space-y-4">
              <Text className="text-blue-2 font-bold text-2xl">
                {t(
                  "methodsPage.accordion.companyDataCollection.historicEmissions.title",
                )}
              </Text>
              <p>
                {t(
                  "methodsPage.accordion.companyDataCollection.historicEmissions.paragraph1",
                )}
              </p>
            </div>

            <div className="space-y-4">
              <Text className="text-blue-2 font-bold text-2xl">
                {t(
                  "methodsPage.accordion.companyDataCollection.emissionOffsets.title",
                )}
              </Text>
              <p>
                {t(
                  "methodsPage.accordion.companyDataCollection.emissionOffsets.paragraph1",
                )}
              </p>
            </div>
          </div>
        );

      case "co2Budgets":
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

      case "emissionTypes":
        return (
          <div className="prose prose-invert w-[90%] max-w-5xl mx-auto space-y-8">
            {[...Array(6).keys()].map((i) => (
              <p key={i}>
                {t(`methodsPage.accordion.emissionTypes.paragraph${i + 1}`)}
              </p>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return <div className="bg-black-2 rounded-2xl p-8">{renderContent()}</div>;
}
