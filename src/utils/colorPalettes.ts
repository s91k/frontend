// Define color palettes for sectors and companies

// Sector color palette - using the original colors from the application
export const sectorColors: Record<string, string> = {
  "10": "#3B82F6", // Energy - blue
  "15": "#10B981", // Materials - green
  "20": "#6366F1", // Industrials - indigo
  "25": "#EC4899", // Consumer Discretionary - pink
  "30": "#8B5CF6", // Consumer Staples - purple
  "35": "#14B8A6", // Healthcare - teal
  "40": "#F59E0B", // Financials - amber
  "45": "#06B6D4", // Information Technology - cyan
  "50": "#EF4444", // Communication Services - red
  "55": "#6366F1", // Utilities - indigo
  "60": "#84CC16", // Real Estate - lime
};

// Company color palettes with scope variations
export interface CompanyColorPalette {
  base: string;
  scope1: string;
  scope2: string;
  scope3: string;
}

export const companyColorPalettes: CompanyColorPalette[] = [
  // Blue palette
  {
    base: "var(--blue-5)",
    scope1: "var(--blue-5)",
    scope2: "var(--blue-3)",
    scope3: "var(--blue-1)",
  },
  {
    base: "var(--blue-4)",
    scope1: "var(--blue-4)",
    scope2: "var(--blue-2)",
    scope3: "var(--blue-1)",
  },
  {
    base: "var(--blue-3)",
    scope1: "var(--blue-3)",
    scope2: "var(--blue-5)",
    scope3: "var(--blue-1)",
  },

  // Green palette
  {
    base: "var(--green-5)",
    scope1: "var(--green-5)",
    scope2: "var(--green-3)",
    scope3: "var(--green-1)",
  },
  // Pink palette
  {
    base: "var(--pink-5)",
    scope1: "var(--pink-5)",
    scope2: "var(--pink-3)",
    scope3: "var(--pink-1)",
  },
  // Orange palette
  {
    base: "var(--orange-5)",
    scope1: "var(--orange-5)",
    scope2: "var(--orange-3)",
    scope3: "var(--orange-1)",
  },
];

// Helper functions to get colors
export function getSectorColor(sectorCode: string): string {
  return sectorColors[sectorCode] || "#6B7280"; // Default to gray if sector not found
}

export function getCompanyColorPalette(index: number): CompanyColorPalette {
  return companyColorPalettes[index % companyColorPalettes.length];
}
