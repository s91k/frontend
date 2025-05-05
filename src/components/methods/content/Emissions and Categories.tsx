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

export const EmissionsAndCategoriesContent = () => {
  const { t } = useTranslation();
  return (
    <div className="prose prose-invert mx-auto space-y-8">
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
