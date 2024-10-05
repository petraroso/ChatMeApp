import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { AppRouter } from "../../server/server";

const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3000/trpc", //ending link
    }),
  ],
});

async function main() {
  const result = await client.sayHi.query();
  console.log(result);

  const r2 = client.sendMessage.mutate({text:"hiiiiiiiiii"});
  console.log(r2);
}
main(); 
