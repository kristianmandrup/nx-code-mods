import { sliceCode } from "../src";

const context = describe;

describe("sliceCode", () => {
  const code = `abc 123 456`;

  context("no slice", () => {
    it("returns code", () => {
      const sliced = sliceCode(code);
      expect(sliced).toEqual(code);
    });
  });

  context("startPos > 0", () => {
    it("returns code sliced at start", () => {
      const sliced = sliceCode(code, { startPos: 1 });
      expect(sliced).toEqual("bc 123 456");
    });
  });

  context("startPos > 0 and endPos > startPos and edPos < code length", () => {
    it("returns code sliced at start and end", () => {
      const sliced = sliceCode(code, { startPos: 1, endPos: code.length - 1 });
      expect(sliced).toEqual("bc 123 45");
    });
  });

  context("startPos > 0 and endPos < startPos", () => {
    it("throws error", () => {
      expect(() => sliceCode(code, { startPos: 2, endPos: 1 })).toThrowError();
    });
  });
});
