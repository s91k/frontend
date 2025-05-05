import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { getMethodById } from "@/lib/methods/methodologyData";
import { Trans } from "react-i18next";
import { LinkButton } from "@/components/layout/LinkButton";

interface MethodContent {
  paragraph1?: string;
  paragraph2?: string;
  paragraph3?: string;
  paragraph4?: string;
  paragraph5?: string;
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

  const renderCompanyDataCollection = () => {
    const content = t(`methodsPage.accordion.companyDataCollection`, {
      returnObjects: true,
    }) as MethodContent;
    const sections = [
      "companiesIncluded",
      "dataPresented",
      "fiscalYear",
      "scope2",
      "scope3",
      "financedEmissions",
      "biogenicEmissions",
      "goals",
      "historicEmissions",
      "emissionOffsets",
    ];

    return (
      <>
        {content.paragraph1 && (
          <p className="text-grey mb-6">{content.paragraph1}</p>
        )}
        <div className="mb-8">
          <LinkButton
            title={content.link1 || ""}
            text={content.paragraph2 || ""}
            link="/companies"
          />
        </div>
        {content.paragraph3 && (
          <p className="text-grey mb-6">{content.paragraph3}</p>
        )}
        {content.paragraph4 && (
          <p className="text-grey mb-6">{content.paragraph4}</p>
        )}
        <div className="mb-8">
          <LinkButton
            title={content.link2 || ""}
            text={content.paragraph5 || ""}
            link="https://ghgprotocol.org/"
          />
        </div>

        {sections.map((sectionKey) => {
          const sectionContent = content[sectionKey];
          if (!sectionContent) return null;

          return (
            <Section key={sectionKey} title={sectionContent.title}>
              {Object.entries(sectionContent)
                .filter(([key]) => key.startsWith("paragraph"))
                .map(([key, text]) => (
                  <p key={key} className="text-grey">
                    {text as string}
                  </p>
                ))}
              {sectionContent.link && (
                <div className="mt-4">
                  <LinkButton
                    title={sectionContent.link}
                    text={sectionContent.linkText || ""}
                    link={sectionContent.linkUrl || "#"}
                  />
                </div>
              )}
            </Section>
          );
        })}
      </>
    );
  };

  const renderContent = () => {
    const content = t(`methodsPage.accordion.${method}`, {
      returnObjects: true,
    }) as MethodContent;

    switch (method) {
      case "sources":
        return (
          <>
            {content.paragraph1 && (
              <p className="text-grey mb-6">{content.paragraph1}</p>
            )}
            {content.paragraph2 && (
              <p className="text-grey mb-8">{content.paragraph2}</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </>
        );

      case "parisAgreement":
        return (
          <>
            {content.paragraph1 && (
              <p className="text-grey mb-6">{content.paragraph1}</p>
            )}
            <p className="text-grey mb-6">
              <Trans
                i18nKey="methodsPage.accordion.parisAgreement.paragraph2"
                components={[
                  <a
                    className="text-blue-3 hover:text-blue-2 underline"
                    href="https://www.iea.org/reports/co2-emissions-in-2023"
                    target="_blank"
                    rel="noopener noreferrer"
                  />,
                ]}
              />
            </p>
            {content.paragraph3 && (
              <p className="text-grey mb-8">{content.paragraph3}</p>
            )}
            {content.link && (
              <LinkButton
                title={content.link.title}
                text={content.link.text}
                link="https://www.naturvardsverket.se/parisavtalet"
              />
            )}
          </>
        );

      case "co2Budgets":
        return (
          <>
            {[...Array(8)].map((_, i) => (
              <p key={i} className="text-grey mb-6">
                <Trans
                  i18nKey={`methodsPage.accordion.co2Budgets.paragraph${i + 1}`}
                  components={[
                    <a
                      className="text-blue-3 hover:text-blue-2 underline"
                      href={
                        i === 1
                          ? "https://www.cemus.uu.se/wp-content/uploads/2023/12/Paris-compliant-carbon-budgets-for-Swedens-counties-.pdf"
                          : i === 7
                            ? "https://research.chalmers.se/publication/530543/file/530543_Fulltext.pdf"
                            : "#"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    />,
                  ]}
                />
              </p>
            ))}
          </>
        );

      case "calculations":
        return (
          <>
            {content.paragraph1 && (
              <p className="text-grey mb-6">{content.paragraph1}</p>
            )}
            <p className="text-grey mb-6">
              <Trans
                i18nKey="methodsPage.accordion.calculations.paragraph2"
                components={[
                  <a
                    className="text-blue-3 hover:text-blue-2 underline"
                    href="https://docs.google.com/document/d/1MihysUkfunbV0LjwSUCiGSqWQSo5U03K0RMbRsVBL7U"
                    target="_blank"
                    rel="noopener noreferrer"
                  />,
                ]}
              />
            </p>
          </>
        );

      case "companyDataCollection":
        return renderCompanyDataCollection();

      default:
        return Object.entries(content)
          .filter(([key]) => key.startsWith("paragraph"))
          .map(([key, text]) => (
            <p key={key} className="text-grey mb-6">
              {text as string}
            </p>
          ));
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
