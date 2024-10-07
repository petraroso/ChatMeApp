import { client } from "./client";
import { useState, useEffect } from "react";
import type { Message } from "../../server/routers";
import MessageBoard from "./components/MessageBoard";
import SendMessage from "./components/SendMessage";
import { getTabId, getDocumentTitle } from "./utils/setup";

function App() {
  const [messages, setMessages] = useState<Message[] | undefined>(undefined);
  const { tabId, nicknameColorClass } = getTabId();

  useEffect(() => {
    fetchMessages();
    getDocumentTitle();
  }, []);

  useEffect(() => {
    const subscription = client.onUpdate.subscribe(undefined, {
      onData: ({ type, message, nickname }) => {
        //when new data comes
        if (type === "new" && message) {
          setMessages((prevMessages) =>
            prevMessages ? [...prevMessages, message] : [message]
          );
        } else if (type === "delete" && message) {
          setMessages((prevMessages) =>
            prevMessages?.filter((msg) => msg.id !== message.id)
          );
        } else if (type === "nickname" && nickname) {
          if (nickname.tabId !== tabId) {
            document.title = `${nickname.nickname}`; //update browser tab title
            sessionStorage.setItem("documentTitle", nickname.nickname);
          }
        }
      },
    });
    //when component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, [tabId]);

  async function fetchMessages() {
    const result = await client.getAllMessages.query();
    setMessages(result);
  }

  return (
    <div className="flex flex-col h-screen sm:p-0 md:p-4 lg:mx-36">
      <div className="flex-grow">
        <MessageBoard messages={messages} />
      </div>
      <div className="p-4 sticky bottom-0 bg-white">
        <SendMessage tabId={tabId} nicknameColorClass={nicknameColorClass} />
      </div>
    </div>
  );
}

export default App;
