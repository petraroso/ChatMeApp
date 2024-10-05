import { client } from "./client";
import { useState, useEffect } from "react";
import type { Message } from "../../server/routers";
import MessageBoard from "./components/MessageBoard";
import SendMessage from "./components/SendMessage";

function App() {
  const [messages, setMessages] = useState<Message[] | undefined>(undefined);

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    const result = await client.getAllMessages.query();
    setMessages(result);
  }

  //input undefined because there is no data; onData listener passed and is
  //called every time emit.next is called
  client.onUpdate.subscribe(undefined, {
    onData: (text) => {
      console.log("Updated", text);
    },
  });

  return (
    <>
      <MessageBoard messages={messages} />
      <SendMessage />
    </>
  );
}

export default App;
