import express from "express";
import cors from "cors";

import { initTRPC } from "@trpc/server";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

const t = initTRPC.create();
const appRouter = t.router({
  sayHi: t.procedure.query(() => {
    return "Hello";
  }),
});

const app = express();
app.use(cors({ origin: "http://localhost:5173" })); //goes before createExpressMiddleware
app.use("/trpc", createExpressMiddleware({ router: appRouter }));

app.listen(3000, () => {
  console.log("Server pokrenut na portu 3000");
});

export type AppRouter = typeof appRouter;
