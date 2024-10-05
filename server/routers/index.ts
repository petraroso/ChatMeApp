import { observable } from "@trpc/server/observable";
import { t } from "../trpc";
import { z } from "zod";
import { EventEmitter } from "stream"; //or from ws

const eventEmitter = new EventEmitter();

const Message = z.object({
  id: z.number(),
  text: z.string(),
});
export type Message = z.infer<typeof Message>;
const Messages = z.array(Message);
let messages: Message[] = [{ id: 736, text: "jcdhcjncj" }];

export const appRouter = t.router({
  getAllMessages: t.procedure.output(Messages).query(() => {
    eventEmitter.emit("update", messages); //emitting update event
    return messages;
  }),
  sendMessage: t.procedure
    .input(z.object({ text: z.string() }))
    .output(z.object({ id: z.number(), text: z.string() }))
    .mutation((req) => {
      const newMsg: Message = { id: 5555, text: req.input.text };
      console.log(`Klijent kaze: ${req.input.text}`);
      eventEmitter.emit("update", req.input.text); //emitting update event
      return newMsg;
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
