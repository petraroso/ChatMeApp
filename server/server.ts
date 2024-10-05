import express from "express";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { appRouter } from "./routers";
import ws from "ws";

const app = express();
app.use(cors({ origin: "http://localhost:5173" })); //goes before createExpressMiddleware
app.use("/trpc", createExpressMiddleware({ router: appRouter }));

const server = app.listen(3000, () => {
  console.log("Server pokrenut na portu 3000");
});

applyWSSHandler({
  //allows websocket connections to trpc
  wss: new ws.Server({ server }), //web socket server
  router: appRouter,
});

export type AppRouter = typeof appRouter;
