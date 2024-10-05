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

  useEffect(() => {
    const subscription = client.onUpdate.subscribe(undefined, {
      onData: (newMessage: Message) => {
        //when new data comes
        setMessages((prevMessages) =>
          prevMessages ? [...prevMessages, newMessage] : [newMessage]
        );
      },
    });
    //when component unmounts:
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchMessages() {
    const result = await client.getAllMessages.query();
    setMessages(result);
  }

  return (
    <>
      <MessageBoard messages={messages} />
      <SendMessage />
    </>
  );
}

export default App;
