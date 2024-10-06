import type { Message } from "../../../server/routers";

interface MessageBoardProps {
  messages: Message[] | undefined;
}
function MessageBoard({ messages }: MessageBoardProps) {
  return (
    <>
      {messages &&
        messages.map((msg, idx) =>
          msg.differentStyling === "different" ? (
            <div key={idx} style={{ backgroundColor: "lightgray" }}>
              <h4>Poruka od: {msg.tabId}</h4>
              <div>{msg.text}</div>
            </div>
          ) : (
            <div key={idx}>
              <h4>Poruka od: {msg.tabId}</h4>
              <div>{msg.text}</div>
            </div>
          )
        )}
    </>
  );
}

export default MessageBoard;
