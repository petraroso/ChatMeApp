import { t } from "../trpc";
import { z } from "zod";

export const appRouter = t.router({
  sayHi: t.procedure.query(() => {
    return "Hello";
  }),
  sendMessage: t.procedure
    .input(z.object({ text: z.string() }))
    .mutation((req) => {
      console.log(req.input.text);
      return true;
    }),
});
