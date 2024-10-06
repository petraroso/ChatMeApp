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

const wss = new ws.Server({ server });

applyWSSHandler({
  //allows websocket connections to trpc
  wss, //web socket server
  router: appRouter,
});

wss.on("connection", (ws, req) => {
  const params = new URL(req.url!, "http://localhost").searchParams;
  const tabId = params.get("tabId"); // Extract the tabId

  ws.on("message", (message) => {
    // Handle incoming messages with tabId
    console.log(`Message from tabId ${tabId}:`, message);
  });

  ws.on("close", () => {
    console.log(`Connection closed for tabId ${tabId}`);
  });
});

export type AppRouter = typeof appRouter;
