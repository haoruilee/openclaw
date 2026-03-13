import { describe, expect, it } from "vitest";
import { appendCronStyleCurrentTimeLine } from "./current-time.js";

const cfg = {};
const NOW_A = new Date("2026-03-13T06:00:00.000Z").getTime();
const NOW_B = new Date("2026-03-13T08:22:00.000Z").getTime();

describe("appendCronStyleCurrentTimeLine", () => {
  it("appends a Current time line when none is present", () => {
    const result = appendCronStyleCurrentTimeLine("Do a thing.", cfg, NOW_A);
    expect(result).toContain("Current time:");
    expect(result).toContain("Do a thing.");
  });

  it("returns empty string unchanged", () => {
    expect(appendCronStyleCurrentTimeLine("", cfg, NOW_A)).toBe("");
  });

  it("replaces a stale Current time line with the fresh timestamp", () => {
    const stale =
      "Do a thing.\nCurrent time: Thu, 13 Mar 2026 04:22:00 (America/Toronto) / 2026-03-13 08:22 UTC";
    const result = appendCronStyleCurrentTimeLine(stale, cfg, NOW_B);
    // Must not contain the old timestamp literal
    expect(result).not.toContain("04:22:00");
    // Must still contain the prompt text
    expect(result).toContain("Do a thing.");
    // Must contain the freshly computed timestamp
    expect(result).toContain("Current time:");
  });

  it("replaces multiple stale Current time lines", () => {
    const stale = "Current time: old timestamp\nSome text\nCurrent time: another old timestamp";
    const result = appendCronStyleCurrentTimeLine(stale, cfg, NOW_B);
    expect(result.match(/Current time:/g)?.length).toBe(2);
    expect(result).not.toContain("old timestamp");
  });

  it("does not duplicate the line when called twice with the same base", () => {
    const once = appendCronStyleCurrentTimeLine("Do a thing.", cfg, NOW_A);
    const twice = appendCronStyleCurrentTimeLine(once, cfg, NOW_B);
    expect(twice.match(/Current time:/g)?.length).toBe(1);
  });
});
