import express from "express";
import * as trpc from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import { z } from "zod";
import * as codeMods from "nx-code-mods";
import { codeToBlock, codeToSourceFile } from "nx-code-mods";
import { sliceCode } from "./slice-code";

interface RefactorResult {
  code?: string;
  error?: string | undefined;
}

const appRouter = trpc.router().mutation("switch", {
  input: z.object({
    code: z.string(),
    positions: z.object({
      startPos: z.number().default(0),
      endPos: z.number().default(-1),
    }),
  }),
  resolve({ input }): RefactorResult {
    const { code, positions } = input;
    try {
      const slicedCode = sliceCode(code, positions);
      const block = codeToBlock(slicedCode);
      const srcFile = codeToSourceFile(slicedCode);
      const newCode = codeMods.extractSwitchStatements(srcFile, block);
      return { code: newCode };
    } catch (e) {
      return { error: "invalid code" };
    }
  },
});

export type AppRouter = typeof appRouter;

const app = express();
app.use(cors());
const port = 8080;

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: () => null,
  })
);

app.listen(port, () => {
  console.log(`api-server listening at http://localhost:${port}`);
});
