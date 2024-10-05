import { t } from "../trpc";
import { z } from "zod";

export const appRouter = t.router({
  sayHi: t.procedure.query(() => {
    return "Hello";
  }),
  logToServer: t.procedure.input(z.string()).mutation((req) => {
    console.log(req.input);
    return true;
  }),
});
