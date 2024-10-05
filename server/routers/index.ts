import { observable } from "@trpc/server/observable";
import { t } from "../trpc";
import { z } from "zod";
import { EventEmitter } from "stream"; //or from ws

const eventEmitter = new EventEmitter();

export const appRouter = t.router({
  sayHi: t.procedure.query(() => {
    return "Hello";
  }),
  sendMessage: t.procedure
    .input(z.object({ text: z.string() }))
    .mutation((req) => {
      console.log(req.input.text);
      eventEmitter.emit("update", req.input.text); //emitting update event
      return true;
    }),
  onUpdate: t.procedure.subscription(() => {
    //listening for events
    return observable<string>((emit) => {
      eventEmitter.on("update", emit.next);

      return () => {
        //called when the connection is closed
        eventEmitter.off("update", emit.next);
      };
    });
  }),
});
