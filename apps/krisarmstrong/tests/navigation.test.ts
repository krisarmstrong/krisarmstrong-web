import { describe, it, expect } from "vitest";
import { PRIMARY_NAV } from "../src/config/navigation";

describe("PRIMARY_NAV", () => {
  it("matches the expected order", () => {
    expect(PRIMARY_NAV.map((item) => item.path)).toEqual([
      "/",
      "/about",
      "/resume",
      "/skills",
      "/projects",
      "/blog",
      "/contact",
    ]);
  });

  it("contains labels for every entry", () => {
    PRIMARY_NAV.forEach((item) => {
      expect(item.label.length).toBeGreaterThan(0);
    });
  });
});
