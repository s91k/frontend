export const dataGuideFeatureFlagEnabled = () => {
  return true;
};

/** Nation detail page (`/nation`) – flip to true when ready to publish. */
export const nationDetailPageEnabled = () => false;

export const stagingFeatureFlagEnabled = () => {
  // Check if we're running on localhost or stage
  if (
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname.includes("stage"))
  ) {
    return true;
  }

  // For production, return false
  return false;
};
