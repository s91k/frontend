export type DataGuideItem = {
  id: string;
  titleKey: string;
  contentKey: string;
};

type DataGuideItems<T extends Record<string, object>> = {
  [K in keyof T]: T[K] & { id: K };
};

export function defineHelpItems<T extends { [K in keyof T]: DataGuideItem }>(
  dict: T,
): DataGuideItems<T> {
  return dict as DataGuideItems<T>;
}

// All available help items are defined here.
export const dataGuideHelpItems = defineHelpItems({
  totalEmissions: {
    id: "totalEmissions",
    titleKey: "items.totalEmissions.title",
    contentKey: "items.totalEmissions.content",
  },
  yearOverYearChange: {
    id: "yearOverYearChange",
    titleKey: "items.yearOverYearChange.title",
    contentKey: "items.yearOverYearChange.content",
  },
  baseYear: {
    id: "baseYear",
    titleKey: "items.baseYear.title",
    contentKey: "items.baseYear.content",
  },
  scope1: {
    id: "scope1",
    titleKey: "items.scope1.title",
    contentKey: "items.scope1.content",
  },
  scope2: {
    id: "scope2",
    titleKey: "items.scope2.title",
    contentKey: "items.scope2.content",
  },
  scope3: {
    id: "scope3",
    titleKey: "items.scope3.title",
    contentKey: "items.scope3.content",
  },
  parisAgreementLine: {
    id: "parisAgreementLine",
    titleKey: "items.parisAgreementLine.title",
    contentKey: "items.parisAgreementLine.content",
  },
  companySectors: {
    id: "companySectors",
    titleKey: "items.companySectors.title",
    contentKey: "items.companySectors.content",
  },
  co2units: {
    id: "co2units",
    titleKey: "items.co2units.title",
    contentKey: "items.co2units.content",
  },
  companyTurnover: {
    id: "companyTurnover",
    titleKey: "items.companyTurnover.title",
    contentKey: "items.companyTurnover.content",
  },
  scope3EmissionLevels: {
    id: "scope3EmissionLevels",
    titleKey: "items.scope3EmissionLevels.title",
    contentKey: "items.scope3EmissionLevels.content",
  },
  scope3Variations: {
    id: "scope3Variations",
    titleKey: "items.scope3Variations.title",
    contentKey: "items.scope3Variations.content",
  },
  companyLowEmissionsImpact: {
    id: "companyLowEmissionsImpact",
    titleKey: "items.companyLowEmissionsImpact.title",
    contentKey: "items.companyLowEmissionsImpact.content",
  },
  meaningOfNetZero: {
    id: "meaningOfNetZero",
    titleKey: "items.meaningOfNetZero.title",
    contentKey: "items.meaningOfNetZero.content",
  },
  companyRealChange: {
    id: "companyRealChange",
    titleKey: "items.companyRealChange.title",
    contentKey: "items.companyRealChange.content",
  },
  companiesHowToCompare: {
    id: "companiesHowToCompare",
    titleKey: "items.companiesHowToCompare.title",
    contentKey: "items.companiesHowToCompare.content",
  },
  companyCitizenAction: {
    id: "companyCitizenAction",
    titleKey: "items.companyCitizenAction.title",
    contentKey: "items.companyCitizenAction.content",
  },
  companyMissingData: {
    id: "companyMissingData",
    titleKey: "items.companyMissingData.title",
    contentKey: "items.companyMissingData.content",
  },
});

// Provide type safety for `useDataGudie`
export type DataGuideItemId = keyof typeof dataGuideHelpItems;
