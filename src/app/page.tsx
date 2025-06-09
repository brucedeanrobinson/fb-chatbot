import { LatestPost } from "~/app/_components/post";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });

  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-secondary to-black text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-3xl font-extrabold tracking-tight">
            <span className="text-title">Mycelial Guide</span> Chatbot
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
