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
    titleKey: "dataGuide.items.totalEmissions.title",
    contentKey: "dataGuide.items.totalEmissions.content",
  },
  yearOverYearChange: {
    id: "yearOverYearChange",
    titleKey: "dataGuide.items.yearOverYearChange.title",
    contentKey: "dataGuide.items.yearOverYearChange.content",
  },
  baseYear: {
    id: "baseYear",
    titleKey: "dataGuide.items.baseYear.title",
    contentKey: "dataGuide.items.baseYear.content",
  },
  scope1: {
    id: "scope1",
    titleKey: "dataGuide.items.scope1.title",
    contentKey: "dataGuide.items.scope1.content",
  },
  scope2: {
    id: "scope2",
    titleKey: "dataGuide.items.scope2.title",
    contentKey: "dataGuide.items.scope2.content",
  },
  scope3: {
    id: "scope3",
    titleKey: "dataGuide.items.scope3.title",
    contentKey: "dataGuide.items.scope3.content",
  },
  companySectors: {
    id: "companySectors",
    titleKey: "dataGuide.items.companySectors.title",
    contentKey: "dataGuide.items.companySectors.content",
  },
  co2units: {
    id: "co2units",
    titleKey: "dataGuide.items.co2units.title",
    contentKey: "dataGuide.items.co2units.content",
  },
  companyTurnover: {
    id: "companyTurnover",
    titleKey: "dataGuide.items.companyTurnover.title",
    contentKey: "dataGuide.items.companyTurnover.content",
  },
  scope3EmissionLevels: {
    id: "scope3EmissionLevels",
    titleKey: "dataGuide.items.scope3EmissionLevels.title",
    contentKey: "dataGuide.items.scope3EmissionLevels.content",
  },
  scope3Variations: {
    id: "scope3Variations",
    titleKey: "dataGuide.items.scope3Variations.title",
    contentKey: "dataGuide.items.scope3Variations.content",
  },
  companyLowEmissionsImpact: {
    id: "companyLowEmissionsImpact",
    titleKey: "dataGuide.items.companyLowEmissionsImpact.title",
    contentKey: "dataGuide.items.companyLowEmissionsImpact.content",
  },
  meaningOfNetZero: {
    id: "meaningOfNetZero",
    titleKey: "dataGuide.items.meaningOfNetZero.title",
    contentKey: "dataGuide.items.meaningOfNetZero.content",
  },
  companyRealChange: {
    id: "companyRealChange",
    titleKey: "dataGuide.items.companyRealChange.title",
    contentKey: "dataGuide.items.companyRealChange.content",
  },
  companiesHowToCompare: {
    id: "companiesHowToCompare",
    titleKey: "dataGuide.items.companiesHowToCompare.title",
    contentKey: "dataGuide.items.companiesHowToCompare.content",
  },
  companyCitizenAction: {
    id: "companyCitizenAction",
    titleKey: "dataGuide.items.companyCitizenAction.title",
    contentKey: "dataGuide.items.companyCitizenAction.content",
  },
  companyMissingData: {
    id: "companyMissingData",
    titleKey: "dataGuide.items.companyMissingData.title",
    contentKey: "dataGuide.items.companyMissingData.content",
  },
});

// Provide type safety for `useDataGudie`
export type DataGuideItemId = keyof typeof dataGuideHelpItems;
