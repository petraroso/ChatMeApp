import { client } from "./client";
import { useState, useEffect } from "react";
import type { Message } from "../../server/routers";
import MessageBoard from "./components/MessageBoard";
import SendMessage from "./components/SendMessage";

function App() {
  const [messages, setMessages] = useState<Message[] | undefined>(undefined);
  const [messagesUpdate, setMessagesUpdate] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, [messagesUpdate]);

  async function fetchMessages() {
    const result = await client.getAllMessages.query();
    setMessages(result);
  }

  return (
    <>
      <MessageBoard messages={messages} />
      <SendMessage setMessagesUpdate={setMessagesUpdate} />
    </>
  );
}

export default App;
