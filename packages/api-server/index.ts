import express from "express";
import * as trpc from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import { z } from "zod";
import * as codeMods from "nx-code-mods";
import { codeToBlock, codeToSourceFile, PositionBounds } from "nx-code-mods";

interface ChatMessage {
  user: string;
  message: string;
}

interface RefactorResult {
  code?: string;
  error?: string | undefined;
}

const messages: ChatMessage[] = [
  { user: "user1", message: "Hello" },
  { user: "user2", message: "Hi" },
];

const sliceCode = (code: string, positions: PositionBounds) => {
  const { startPos, endPos } = positions;
  if (!startPos || startPos < 0) return code;
  return endPos && endPos > 0
    ? code.slice(startPos, endPos)
    : code.slice(startPos);
};

const appRouter = trpc
  .router()
  .query("hello", {
    resolve() {
      return "Hello world III";
    },
  })
  .query("getMessages", {
    input: z.number().default(10),
    resolve({ input }) {
      return messages.slice(-input);
    },
  })
  .mutation("switch", {
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
  })
  .mutation("addMessage", {
    input: z.object({
      user: z.string(),
      message: z.string(),
    }),
    resolve({ input }) {
      messages.push(input);
      return input;
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

app.get("/", (req, res) => {
  res.send("Hello from api-server");
});

app.listen(port, () => {
  console.log(`api-server listening at http://localhost:${port}`);
});
