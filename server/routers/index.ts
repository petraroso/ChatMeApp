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
    .mutation((req) => {
      const newMsg: Message = { id: Date.now(), text: req.input.text };
      messages.push(newMsg);
      eventEmitter.emit("new-message", newMsg); //emitting new message
      return newMsg;
    }),
  deleteMessage: t.procedure.mutation((req) => {
    const deletedMessage = messages.pop(); //doesn't need checking if length >0
    eventEmitter.emit("delete-message", deletedMessage);
  }),
  onUpdate: t.procedure.subscription(() => {
    //listening for events
    return observable<{ type: "new" | "delete"; message: Message }>((emit) => {
      const onMessage = (data: Message) => {
        emit.next({ type: "new", message: data }); // send the message to all subscribers
      };
      const onDeleteMessage = (data: Message) => {
        emit.next({ type: "delete", message: data });
      };

      eventEmitter.on("new-message", onMessage); //listener for new messages
      eventEmitter.on("delete-message", onDeleteMessage);

      return () => {
        //called when the connection is closed, listener removed
        eventEmitter.off("new-message", onMessage);
        eventEmitter.off("delete-message", onDeleteMessage);
      };
    });
  }),
});
