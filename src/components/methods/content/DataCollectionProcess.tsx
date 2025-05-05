import { useTranslation } from "react-i18next";
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

export const DataCollectionProcessContent = () => {
  const { t } = useTranslation();
  return (
    <div className="prose prose-invert mx-auto space-y-8">
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
    </div>
  );
};
