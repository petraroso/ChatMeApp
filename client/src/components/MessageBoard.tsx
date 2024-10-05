import type { Message } from "../../../server/routers";

interface MessageBoardProps {
  messages: Message[] | undefined;
}
function MessageBoard({ messages }: MessageBoardProps) {
  return (
    <>
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

export default MessageBoard;
