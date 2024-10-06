import { useState } from "react";
import { client } from "../client";

function SendMessage({ tabId }: { tabId: string }) {
  const [text, setText] = useState("");

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const sendData = () => {
    //if it's not all just spaces
    if (text.trim().startsWith("/oops")) {
      client.deleteMessage.mutate({ tabId: tabId });
      setText("");
    } else if (text.trim().startsWith("/nick")) {
      let nick = text.trim().substring(5);
      if (nick) {
        client.setNickname.mutate({
          tabId: tabId,
          nickname: nick.trim(),
        });
        setText("");
      }
    } else if (text.trim().startsWith("/think")) {
      if (text.trim().substring(6)) {
        client.sendMessage.mutate({
          text: text.trim().substring(6),
          tabId,
          differentStyling: "different",
        });
        setText("");
      }
    } else if (text.trim()) {
      client.sendMessage.mutate({ text, tabId, differentStyling: "default" });
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
