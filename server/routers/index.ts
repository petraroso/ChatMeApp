import { observable } from "@trpc/server/observable";
import { t } from "../trpc";
import { z } from "zod";
import { EventEmitter } from "stream";

const eventEmitter = new EventEmitter();

const Message = z.object({
  id: z.number(),
  text: z.string(),
  tabId: z.string(), //can be changed to userId
  differentStyling: z.string(),
  nicknameColor: z.string(),
});
export type Message = z.infer<typeof Message>;
const Messages = z.array(Message);
let messages: Message[] = [
  {
    id: 736,
    text: "Dobrodošli u ChatMeApp!",
    tabId: "ChatMeApp",
    differentStyling: "different",
    nicknameColor: "text-blue-600",
  },
]; //list of all messages

const Nickname = z.object({
  tabId: z.string(),
  nickname: z.string(),
});
export type Nickname = z.infer<typeof Nickname>;
const Nicknames = z.record(z.string(), Nickname); //key-value
let nicknames: Record<string, Nickname> = {}; //list of all nicknames

export const appRouter = t.router({
  getAllMessages: t.procedure.output(Messages).query(() => {
    return messages;
  }),
  sendMessage: t.procedure
    .input(
      z.object({
        text: z.string(),
        tabId: z.string(),
        differentStyling: z.string(),
        nicknameColor: z.string(),
      })
    )
    .mutation((req) => {
      const newMsg: Message = {
        id: Date.now(),
        text: req.input.text,
        tabId: req.input.tabId,
        differentStyling: req.input.differentStyling,
        nicknameColor: req.input.nicknameColor,
      };
      messages.push(newMsg);
      eventEmitter.emit("new-message", newMsg); //emitting new message
      return newMsg;
    }),
  deleteMessage: t.procedure
    .input(z.object({ tabId: z.string() }))
    .mutation((req) => {
      const reversedIndex = messages
        .slice()
        .reverse()
        .findIndex((msg) => msg.tabId === req.input.tabId);
      const messageIndex =
        reversedIndex === -1 ? -1 : messages.length - 1 - reversedIndex;
      if (messageIndex !== -1) {
        // Ukloni tu poruku iz niza
        const deletedMessage = messages.splice(messageIndex, 1)[0]; // Ukloni poruku s tog indeksa
        eventEmitter.emit("delete-message", deletedMessage);
      }
    }),
  setNickname: t.procedure
    .input(z.object({ tabId: z.string(), nickname: z.string() }))
    .mutation((req) => {
      const { tabId, nickname } = req.input;
      nicknames[tabId] = { tabId, nickname };
      eventEmitter.emit("new-nickname", nicknames[tabId]); // emitting new nickname
    }),
  onUpdate: t.procedure.subscription(() => {
    //listening for events
    return observable<{
      type: "new" | "delete" | "nickname";
      message?: Message;
      nickname?: Nickname;
    }>((emit) => {
      const onMessage = (data: Message) => {
        emit.next({ type: "new", message: data }); // send the message to all subscribers
      };
      const onDeleteMessage = (data: Message) => {
        emit.next({ type: "delete", message: data });
      };
      const onNewNickname = (data: Nickname) => {
        emit.next({ type: "nickname", nickname: data });
      };

      eventEmitter.on("new-message", onMessage); //listener for new messages
      eventEmitter.on("delete-message", onDeleteMessage);
      eventEmitter.on("new-nickname", onNewNickname);

      return () => {
        //called when the connection is closed, listener removed
        eventEmitter.off("new-message", onMessage);
        eventEmitter.off("delete-message", onDeleteMessage);
        eventEmitter.off("new-nickname", onNewNickname);
      };
    });
  }),
});
