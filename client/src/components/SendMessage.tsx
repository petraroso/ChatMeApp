import { useState } from "react";
import { client } from "../client";

interface SendMessageProps {
  setMessagesUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}

function SendMessage({ setMessagesUpdate }: SendMessageProps) {
  const [text, setText] = useState("");

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const sendData = () => {
    client.sendMessage.mutate({ text: text });
    setMessagesUpdate((prev) => !prev);
  };

  return (
    <div>
      <label htmlFor="name">Poruka:</label>
      <input
        type="text"
        id="text"
        name="text"
        autoComplete="off"
        placeholder="Pošaljite poruku"
        value={text}
        onChange={handleTextChange}
      ></input>
      <button onClick={sendData}>Pošaljite</button>
    </div>
  );
}

export default SendMessage;
