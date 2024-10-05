import {
  createTRPCProxyClient,
  httpBatchLink,
  wsLink,
  splitLink,
  createWSClient,
} from "@trpc/client";
import { AppRouter } from "../../server/server";

const client = createTRPCProxyClient<AppRouter>({
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

document.addEventListener("click", () => {
  client.sendMessage.mutate({ text: "testna poruka iz wssss" });
});

async function main() {
  const result = await client.sayHi.query();
  console.log(result);

  const r2 = client.sendMessage.mutate({ text: "hiiiiiiiiii" });
  console.log(r2);

  //input undefined bsc there is no data; onData listener passed and is
  //called every time emit.next is called
  client.onUpdate.subscribe(undefined, {
    onData: (text) => {
      console.log("Updated", text);
    },
  });
}
main();
