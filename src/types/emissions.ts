import type { ReportingPeriod } from "@/types/company";

export interface ChartData {
  year: number;
  total?: number;
  scope1?: number;
  scope2?: number;
  scope3?: number;
  originalValues?: Record<string, number | null>; // Keeps track of original null values
  [key: string]: number | Record<string, number | null> | undefined; // Ensure all additional keys are valid
}

export interface EmissionsFeatures {
  interpolateScope3: boolean;
  guessBaseYear: boolean;
  compositeTrend: boolean;
  outlierDetection: boolean;
}

export interface EmissionsHistoryProps {
  reportingPeriods: ReportingPeriod[];
  onYearSelect?: (year: string) => void;
  className?: string;
  features?: EmissionsFeatures;
}

export type DataView = "overview" | "scopes" | "categories";

// Define a type that can represent both a value and "no data" state
export type EmissionsValue = number | null;

// Helper functions to work with emissions values
export const EmissionsUtils = {
  // Safely add emissions values, treating null as 0 for calculation but preserving null if all inputs are null
  add: (...values: EmissionsValue[]): EmissionsValue => {
    const nonNullValues = values.filter((v) => v !== null) as number[];
    return nonNullValues.length > 0
      ? nonNullValues.reduce((sum, val) => sum + val, 0)
      : null;
  },

  // Format emissions for display
  format: (
    value: EmissionsValue,
    options?: { showNoData?: boolean }
  ): string => {
    if (value === null) return options?.showNoData ? "No data" : "0";
    return Math.round(value).toLocaleString();
  },

  // Calculate percentage change between two values
  percentChange: (
    current: EmissionsValue,
    previous: EmissionsValue
  ): EmissionsValue => {
    if (current === null || previous === null) return null;
    if (previous === 0) return current > 0 ? 100 : 0; // Avoid division by zero
    return ((current - previous) / Math.abs(previous)) * 100;
  },

  // Check if a company has emissions data
  hasData: (emissions: any): boolean => {
    if (!emissions) return false;
    return (
      emissions.scope1?.total !== null ||
      emissions.scope2?.calculatedTotalEmissions !== null ||
      emissions.scope3?.calculatedTotalEmissions !== null
    );
  },

  // Get total emissions, preserving null if no data exists
  getTotal: (emissions: any): EmissionsValue => {
    if (!emissions) return null;

    const scope1 = emissions.scope1?.total ?? null;
    const scope2 = emissions.scope2?.calculatedTotalEmissions ?? null;
    const scope3 = emissions.scope3?.calculatedTotalEmissions ?? null;

    return EmissionsUtils.add(scope1, scope2, scope3);
  },
};
