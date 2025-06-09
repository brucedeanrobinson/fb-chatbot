import { LatestPost } from "~/app/_components/post";
import { api, HydrateClient } from "~/trpc/server";
import { useChat } from '@ai-sdk/react';

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });

  void api.post.getLatest.prefetch();

  // TODO: style idea:
  // mycelial aesthetic,
  // structure from last week's message thread,
  // 

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-3xl font-extrabold tracking-tight">
            <span className="text-[hsl(280,100%,70%)]">Mycelial Guide</span> Chatbot
          </h1>
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-white">
              {hello ? hello.greeting : "Loading tRPC query..."}
            </p>
          </div>

          <LatestPost />
        </div>
      </main>
    </HydrateClient>
  );
}
