import * as api from "../src/api";

const context = describe;

jest.mock("axios");

describe("api", () => {
  context("no switch in code", () => {
    const code = `function x() {}`;
    context("no slice", () => {
      it("returns code not refactored", async () => {
        const result = await api.refactorSwitch({ code });
        expect(result).toBeTruthy();
      });
    });
  });

  context("switch in code", () => {
    const code = `function x() {
        switch (a) {
            case 'x': return
        }
    }`;
    context("no slice", () => {
      it("returns code refactored with no switch", async () => {
        const result = await api.refactorSwitch({ code });
        expect(result).not.toContain("switch");
        expect(result).not.toContain("case");
        expect(result).toContain("function caseX");
      });
    });
  });
});
