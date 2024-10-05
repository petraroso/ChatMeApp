import { observable } from "@trpc/server/observable";
import { t } from "../trpc";
import { z } from "zod";
import { EventEmitter } from "stream";

const eventEmitter = new EventEmitter();

const Message = z.object({
  id: z.number(),
  text: z.string(),
});
export type Message = z.infer<typeof Message>;
const Messages = z.array(Message); //list of all messages
let messages: Message[] = [{ id: 736, text: "Inicijalna poruka" }];

export const appRouter = t.router({
  getAllMessages: t.procedure.output(Messages).query(() => {
    return messages;
  }),
  sendMessage: t.procedure
    .input(z.object({ text: z.string() }))
    //.output(z.object({ id: z.number(), text: z.string() }))
    .mutation((req) => {
      const newMsg: Message = { id: Date.now(), text: req.input.text };
      //console.log(`Klijent kaze: ${req.input.text}`);
      messages.push(newMsg);
      eventEmitter.emit("new-message", newMsg); //emitting new message
      return newMsg;
    }),
  onUpdate: t.procedure.subscription(() => {
    //listening for events
    return observable<Message>((emit) => {
      const onMessage = (data: Message) => {
        emit.next(data); // send the message to all subribers
      };

      eventEmitter.on("new-message", onMessage); //listener for new messages

      return () => {
        //called when the connection is closed, listener removed
        eventEmitter.off("new-message", onMessage);
      };
    });
  }),
});
