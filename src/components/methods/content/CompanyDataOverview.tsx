import { useTranslation } from "react-i18next";
import { LinkButton } from "@/components/layout/LinkButton";
import { Text } from "@/components/ui/text";

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

export const CompanyDataOverviewContent = () => {
  const { t } = useTranslation();
  return (
    <div className="prose prose-invert mx-auto space-y-8">
      <p>{t("methodsPage.company.companyDataCollection.paragraph1")}</p>
      <div className="flex justify-center">
        <div className="w-full space-y-6">
          <LinkButton
            title={t("methodsPage.company.companyDataCollection.link1")}
            text={t("methodsPage.company.companyDataCollection.paragraph2")}
            link="/companies"
          />
        </div>
      </div>
      <p>{t("methodsPage.company.companyDataCollection.paragraph3")}</p>
      <p>{t("methodsPage.company.companyDataCollection.paragraph4")}</p>
      <div className="flex justify-center">
        <div className="w-full space-y-6">
          <LinkButton
            title={t("methodsPage.company.companyDataCollection.link2")}
            text={t("methodsPage.company.companyDataCollection.paragraph5")}
            link="https://ghgprotocol.org/"
          />
        </div>
      </div>

      <Section
        title={t(
          "methodsPage.company.companyDataCollection.companiesIncluded.title",
        )}
      >
        <p>
          {t(
            "methodsPage.company.companyDataCollection.companiesIncluded.paragraph1",
          )}
        </p>
        <p>
          {t(
            "methodsPage.company.companyDataCollection.companiesIncluded.paragraph2",
          )}
        </p>
        <div className="flex justify-center">
          <div className="w-full space-y-6">
            <LinkButton
              title={t("methodsPage.company.companyDataCollection.link2")}
              text={t(
                "methodsPage.company.companyDataCollection.companiesIncluded.paragraph3",
              )}
              link="https://www.msci.com/our-solutions/indexes/gics"
            />
          </div>
        </div>
        <p>
          {t(
            "methodsPage.company.companyDataCollection.companiesIncluded.paragraph4",
          )}
        </p>
        <p>
          {t(
            "methodsPage.company.companyDataCollection.companiesIncluded.paragraph5",
          )}
        </p>
      </Section>
    </div>
  );
};
