import type { ReportingPeriod } from "@/types/company";

export function mapCompanyEditFormToRequestBody(
  selectedPeriods: ReportingPeriod[],
  formData: Map<string, string>,
) {
  const formKeys = Array.from(formData.keys());
  const periodsUpdate = [];
  for (const period of selectedPeriods) {
    const periodUpdate: any = {
      id: period.id,
    };
    if (formData.has("start-date-" + period.id)) {
      periodUpdate.startDate =
        formData.get("start-date-" + period.id) ?? period.startDate;
    } else {
      periodUpdate.startDate = period.startDate;
    }
    if (formData.has("end-date-" + period.id)) {
      periodUpdate.endDate =
        formData.get("end-date-" + period.id) ?? period.endDate;
    } else {
      periodUpdate.endDate = period.endDate;
    }
    periodUpdate.emissions = {};
    if (formData.has("scope-1-" + period.id)) {
      periodUpdate.emissions.scope1 = {
        total: parseInt(formData.get("scope-1-" + period.id) || "0") ?? 0,
        verified: formData.get("scope-1-" + period.id + "-checkbox") === "true",
      };
    }
    if (
      formData.has("scope-2-mb-" + period.id) ||
      formData.has("scope-2-lb-" + period.id) ||
      formData.has("scope-2-unknown-" + period.id) ||
      formData.has("scope-2-unknown-" + period.id + "-checkbox") ||
      formData.has("scope-2-lb-" + period.id + "-checkbox") ||
      formData.has("scope-2-mb-" + period.id + "-checkbox")
    ) {
      periodUpdate.emissions.scope2 = {};
    }

    if (formData.has("scope-2-mb-" + period.id)) {
      periodUpdate.emissions.scope2.mb =
        parseInt(formData.get("scope-2-mb-" + period.id) || "0") ?? 0;
    }
    if (formData.has("scope-2-lb-" + period.id)) {
      periodUpdate.emissions.scope2.lb =
        parseInt(formData.get("scope-2-lb-" + period.id) || "0") ?? 0;
    }
    if (formData.has("scope-2-unknown-" + period.id)) {
      periodUpdate.emissions.scope2.unknown =
        parseInt(formData.get("scope-2-unknown-" + period.id) || "0") ?? 0;
    }

    if (
      formData.has("scope-2-unknown-" + period.id + "-checkbox") ||
      formData.has("scope-2-lb-" + period.id + "-checkbox") ||
      formData.has("scope-2-mb-" + period.id + "-checkbox")
    ) {
      periodUpdate.emissions.scope2.verified =
        formData.get("scope-2-unknown-" + period.id + "-checkbox") === "true" ||
        formData.get("scope-2-lb-" + period.id + "-checkbox") === "true" ||
        formData.get("scope-2-mb-" + period.id + "-checkbox") === "true";
    }
    // --- Refactored Scope 3 category mapping ---
    const changedCategoryIds = new Set<string>();
    for (const formKey of formKeys) {
      if (
        formKey.startsWith("scope-3-" + period.id + "-") &&
        !formKey.includes("statedTotalEmissions")
      ) {
        const parts = formKey.split("-");
        const categoryId = parts[3];
        if (categoryId) changedCategoryIds.add(categoryId);
      }
    }
    if (changedCategoryIds.size > 0) {
      if (!periodUpdate.emissions.scope3) {
        periodUpdate.emissions.scope3 = {};
      }
      periodUpdate.emissions.scope3.categories = [];
      for (const categoryId of changedCategoryIds) {
        const valueKey = `scope-3-${period.id}-${categoryId}`;
        const checkboxKey = `scope-3-${period.id}-${categoryId}-checkbox`;
        const originalCategory = period.emissions?.scope3?.categories?.find(
          (c) => String(c.category) === String(categoryId),
        );
        const valueChanged = formData.has(valueKey);
        const verifiedChanged = formData.has(checkboxKey);
        const newValue = valueChanged ? formData.get(valueKey) : undefined;
        const newVerified = verifiedChanged
          ? formData.get(checkboxKey) === "true"
          : undefined;
        const originalValue = originalCategory?.total;
        // If original value is not null/undefined and only verified is changed
        if (
          originalValue !== null &&
          originalValue !== undefined &&
          !valueChanged &&
          verifiedChanged
        ) {
          periodUpdate.emissions.scope3.categories.push({
            category: parseInt(categoryId),
            verified: newVerified,
          });
        }
        // If value is changed (from null or to a new value)
        else if (valueChanged) {
          const obj: any = {
            category: parseInt(categoryId),
            total: parseInt(newValue || "0"),
          };
          if (verifiedChanged) obj.verified = newVerified;
          periodUpdate.emissions.scope3.categories.push(obj);
        }
        // If both value and verified are changed, the above covers it in one object
      }
    }
    // --- End refactor ---
    // Add statedTotalEmissions for scope 3
    if (formData.has(`scope-3-statedTotalEmissions-${period.id}`)) {
      if (periodUpdate.emissions.scope3 === undefined) {
        periodUpdate.emissions.scope3 = {};
      }
      periodUpdate.emissions.scope3.statedTotalEmissions = {
        total:
          parseInt(
            formData.get(`scope-3-statedTotalEmissions-${period.id}`) || "0",
          ) ?? 0,
        verified:
          formData.get(`scope-3-statedTotalEmissions-${period.id}-checkbox`) ===
          "true",
      };
    }
    // Only add emissions if not empty
    if (Object.keys(periodUpdate.emissions).length > 0) {
      periodsUpdate.push(periodUpdate);
    }
  }
  const metadata: {
    comment?: string;
    source?: string;
  } = {};

  if (formData.get("comment")) {
    metadata.comment = formData.get("comment");
  }

  if (formData.get("source")) {
    metadata.source = formData.get("source");
  }
  return {
    reportingPeriods: periodsUpdate,
    metadata,
  };
}
