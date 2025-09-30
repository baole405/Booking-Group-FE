import { cn } from "@/lib/utils";
import { describe, expect, it } from "vitest";

describe("Utility Functions", () => {
  describe("cn (className utility)", () => {
    it("should merge class names correctly", () => {
      const result = cn("bg-red-500", "text-white");
      expect(result).toBe("bg-red-500 text-white");
    });

    it("should handle undefined and null values", () => {
      const result = cn("bg-red-500", undefined, null, "text-white");
      expect(result).toBe("bg-red-500 text-white");
    });

    it("should handle empty strings", () => {
      const result = cn("bg-red-500", "", "text-white");
      expect(result).toBe("bg-red-500 text-white");
    });

    it("should handle single class name", () => {
      const result = cn("bg-red-500");
      expect(result).toBe("bg-red-500");
    });

    it("should handle no arguments", () => {
      const result = cn();
      expect(result).toBe("");
    });

    it("should handle conditional classes", () => {
      const isActive = true;
      const result = cn("base-class", isActive && "active-class");
      expect(result).toBe("base-class active-class");
    });

    it("should handle false conditional classes", () => {
      const isActive = false;
      const result = cn("base-class", isActive && "active-class");
      expect(result).toBe("base-class");
    });
  });
});
