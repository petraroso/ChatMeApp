import { client } from "./client";
import { useState } from "react";
import type { Message } from "../../server/routers";


function App() {
  const [messages, setMessages] = useState<Message[]>();

  client.sendMessage.mutate({ text: "hiiiiiiiiii" });

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
      <button onClick={() => fetchMessages()}>
        Učitajte dosadašnje poruke
      </button>
      {messages &&
        messages.map((msg, idx) => (
          <div key={idx}>
            <h4>Poruka od: {msg.id}</h4>
            <div>{msg.text}</div>
          </div>
        ))}
    </>
  );
}

export default App;
