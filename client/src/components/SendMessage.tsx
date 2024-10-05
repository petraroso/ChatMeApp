import { useState } from "react";
import { client } from "../client";

function SendMessage() {
  const [text, setText] = useState("");

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const sendData = () => {
    //if it's not all just spaces
    if (text.trim()) {
      client.sendMessage.mutate({ text });
      setText("");
    }
  };

  return (
    <div>
      <label htmlFor="text">Poruka:</label>
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
