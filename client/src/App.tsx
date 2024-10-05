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
      onData: ({ type, message }) => {
        //when new data comes
        if (type === "new") {
          setMessages((prevMessages) =>
            prevMessages ? [...prevMessages, message] : [message]
          );
        } else if (type === "delete") {
          setMessages((prevMessages) =>
            prevMessages?.filter((msg) => msg.id !== message.id)
          );
        }
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
