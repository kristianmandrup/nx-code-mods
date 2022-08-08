import { app, createServer } from "../src/server";
import supertest from "supertest";
import { Server } from "http";

const context = describe;

// jest.mock("axios");

describe("api", () => {
  let server: Server;
  let request: any;

  beforeAll(async () => {
    server = createServer(3000);
    request = supertest(app);
  });

  afterAll(() => {
    server.close();
  });

  context("no switch in code", () => {
    const body = {
      code: `function x() {}`,
    };

    it("returns code not refactored", async () => {
      const response = await request.post("/trpc/switch").send(body);
      expect(response.status).toBe(200);
      const data = response.body.result.data;
      const { code } = data;
      expect(code).toBeUndefined();
      // expect(code).toEqual(body.code);
    });
  });

  context("switch in code", () => {
    const body = {
      code: `function x() {
        switch (key) {
            case 'open': return
        }
      }`,
    };

    it("returns code refactored with no switch", async () => {
      const response = await request.post("/trpc/switch").send(body);
      const res = response.body.result.data;
      const { code } = res;
      expect(code).not.toContain("switch");
      expect(code).not.toContain("case");
      expect(code).toContain("function isKeyOpen");
    });
  });
});
