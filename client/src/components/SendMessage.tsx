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
    <div className="p-4 bg-gray-100 rounded-md shadow-md">
      <div className="flex space-x-4">
        <input
          type="text"
          id="text"
          name="text"
          autoComplete="off"
          placeholder="Pošaljite poruku"
          value={text}
          onChange={handleTextChange}
          className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-400"
        />
        <button
          onClick={sendData}
          className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"
        >
          Pošaljite
        </button>
      </div>
    </div>
  );
}

export default SendMessage;
