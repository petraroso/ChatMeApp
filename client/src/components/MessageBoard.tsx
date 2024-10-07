import type { Message } from "../../../server/routers";

interface MessageBoardProps {
  messages: Message[] | undefined;
}
function MessageBoard({ messages }: MessageBoardProps) {
  return (
    <div className="h-full p-4 bg-white overflow-auto">
      {messages && messages.length > 0 ? (
        messages.map((msg, idx) =>
          msg.differentStyling === "different" ? (
            <div
              key={idx}
              className="p-4 mb-4 bg-gray-200 rounded-md shadow-md max-w-fit"
            >
              <h4 className="font-bold">Poruka od: {msg.tabId}</h4>
              <div>{msg.text}</div>
            </div>
          ) : (
            <div
              key={idx}
              className="p-4 mb-4 bg-gray-100 rounded-md shadow-md max-w-fit"
            >
              <h4 className="font-bold">Poruka od: {msg.tabId}</h4>
              <div>{msg.text}</div>
            </div>
          )
        )
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Nema poruka.</p>
        </div>
      )}
    </div>
  );
}

export default MessageBoard;
