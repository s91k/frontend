import { mapCompanyEditFormToRequestBody } from "./company-edit";
import type { ReportingPeriod } from "@/types/company";

describe("mapCompanyEditFormToRequestBody", () => {
  const basePeriod: ReportingPeriod = {
    id: "1",
    startDate: "2022-01-01T00:00:00.000Z",
    endDate: "2022-12-31T00:00:00.000Z",
    reportURL: null,
    emissions: {
      calculatedTotalEmissions: 100,
      scope1: {
        total: 10,
        unit: "tCO2e",
        metadata: { verifiedBy: null },
      },
      scope2: {
        mb: 5,
        lb: 6,
        unknown: 7,
        unit: "tCO2e",
        calculatedTotalEmissions: 18,
        metadata: { verifiedBy: null },
      },
      scope3: {
        calculatedTotalEmissions: 80,
        metadata: { verifiedBy: null },
        statedTotalEmissions: null,
        categories: [
          { category: 1, total: 10, unit: "tCO2e" },
          { category: 2, total: 20, unit: "tCO2e" },
        ],
      },
    },
    economy: null,
  };

  it("should not include emissions if no changes", () => {
    const formData = new Map();
    const result = mapCompanyEditFormToRequestBody([basePeriod], formData);
    expect(result.reportingPeriods.length).toBe(0);
  });

  it("should include changed scope1 total", () => {
    const formData = new Map([["scope-1-1", "42"]]);
    const result = mapCompanyEditFormToRequestBody([basePeriod], formData);
    expect(result.reportingPeriods[0].emissions.scope1).toEqual({
      total: 42,
      verified: false,
    });
  });

  it("should include verified true if changed from false", () => {
    const formData = new Map([
      ["scope-1-1", "10"],
      ["scope-1-1-checkbox", "true"],
    ]);
    const result = mapCompanyEditFormToRequestBody([basePeriod], formData);
    expect(result.reportingPeriods[0].emissions.scope1.verified).toBe(true);
  });

  it("should not include verified if unchecked (originally false)", () => {
    const formData = new Map([
      ["scope-1-1", "10"],
      // no checkbox key
    ]);
    const result = mapCompanyEditFormToRequestBody([basePeriod], formData);
    expect(result.reportingPeriods[0].emissions.scope1.verified).toBe(false);
  });

  it("should only include changed scope2 values", () => {
    const formData = new Map([["scope-2-mb-1", "99"]]);
    const result = mapCompanyEditFormToRequestBody([basePeriod], formData);
    expect(result.reportingPeriods[0].emissions.scope2.mb).toBe(99);
    expect(result.reportingPeriods[0].emissions.scope2.lb).toBeUndefined();
    expect(result.reportingPeriods[0].emissions.scope2.unknown).toBeUndefined();
  });

  it("should include scope3 category if changed", () => {
    const formData = new Map([["scope-3-1-1", "123"]]);
    const result = mapCompanyEditFormToRequestBody([basePeriod], formData);
    expect(result.reportingPeriods[0].emissions.scope3.categories[0]).toEqual({
      category: 1,
      total: 123,
      verified: false,
    });
  });

  it("should include scope3 statedTotalEmissions if changed", () => {
    const formData = new Map([
      ["scope-3-statedTotalEmissions-1", "555"],
      ["scope-3-statedTotalEmissions-1-checkbox", "true"],
    ]);
    const result = mapCompanyEditFormToRequestBody([basePeriod], formData);
    expect(
      result.reportingPeriods[0].emissions.scope3.statedTotalEmissions,
    ).toEqual({
      total: 555,
      verified: true,
    });
  });

  it("should not include emissions if only unrelated fields are changed", () => {
    const formData = new Map([["comment", "hello"]]);
    const result = mapCompanyEditFormToRequestBody([basePeriod], formData);
    expect(result.reportingPeriods.length).toBe(0);
    expect(result.metadata.comment).toBe("hello");
  });
});
