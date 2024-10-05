import {
  createTRPCProxyClient,
  httpBatchLink,
  wsLink,
  splitLink,
  createWSClient,
} from "@trpc/client";
import { AppRouter } from "../../server/server";

export const client = createTRPCProxyClient<AppRouter>({
  links: [
    splitLink({
      //so both ws and links can be used
      condition: (op) => {
        return op.type === "subscription";
      },
      true: wsLink({
        client: createWSClient({
          url: "ws://localhost:3000/trpc",
        }),
      }),
      false: httpBatchLink({
        url: "http://localhost:3000/trpc", //ending link
      }),
    }),
  ],
});

//input undefined because there is no data; onData listener passed and is
//called every time emit.next is called
client.onUpdate.subscribe(undefined, {
  onData: (text) => {
    console.log("Updated", text);
  },
});
