import { calculateRateOfChange } from "./general";

describe("General calculations", () => {
  describe("calculateRateOfChange", () => {
    it("should correctly calculate percentage", () => {
      const result = calculateRateOfChange(436485000, 392345227);

      expect(result).toBeCloseTo(0.112);
    });

    it("should return null if either of the numbers are undefined", () => {
      expect(calculateRateOfChange(undefined, 392345227)).toBeNull();
      expect(calculateRateOfChange(undefined, 392345227)).toBeNull();
    });

    it("should return null if previous is 0", () => {
      expect(calculateRateOfChange(436485000, 0)).toBeNull();
    });
  });
});
