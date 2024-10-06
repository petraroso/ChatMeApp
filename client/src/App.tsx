import { client } from "./client";
import { useState, useEffect } from "react";
import type { Message } from "../../server/routers";
import MessageBoard from "./components/MessageBoard";
import SendMessage from "./components/SendMessage";

function getTabId() {
  let tabId = sessionStorage.getItem("tabId");
  if (!tabId) {
    tabId = `tab-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem("tabId", tabId);
  }
  return tabId;
}

function getDocumentTitle() {
  let docTitle = sessionStorage.getItem("documentTitle");
  if (docTitle) {
    document.title = `${docTitle}`;
  } else document.title = `ChatMeApp`;
}

function App() {
  const [messages, setMessages] = useState<Message[] | undefined>(undefined);
  const tabId = getTabId();

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
          if (nickname.tabId != tabId) {
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
  }, []);

  async function fetchMessages() {
    const result = await client.getAllMessages.query();
    setMessages(result);
  }

  return (
    <>
      <MessageBoard messages={messages} />
      <SendMessage tabId={tabId} />
    </>
  );
}

export default App;
