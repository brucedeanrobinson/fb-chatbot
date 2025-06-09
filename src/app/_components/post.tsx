"use client";

import { useState, useEffect } from "react";

import { api } from "~/trpc/react";

export function LatestPost() {
  const [latestPost] = api.post.getLatest.useSuspenseQuery();

  const utils = api.useUtils();
  const [name, setName] = useState("");
  const createPost = api.post.create.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
      setName("");
    },
  });

  const seedPrompts = [
    "What is the New Earth?",
    "How is crypto like mycelium?",
    "Tell me about Gitcoin in forest terms.",
    "How does Web3 empower communities?",
    "What does 'mycelial technology' mean?",
  ];
  const [placeholder, setPlaceholder] = useState("")
  useEffect(() => {
    const index = Math.floor(Math.random() * seedPrompts.length);
    const randomPrompt = seedPrompts[index];
    if (randomPrompt !== undefined) {
      setPlaceholder(randomPrompt);
    } else {
      setPlaceholder("Inquire within.")
    }
  }, []);
  // TODO: style like the Message Thread project from last week, with extra flair

  return (
    <div className="w-full max-w-xl">

      {latestPost ? (
        <p className="truncate">Chatbot: {latestPost.name}</p>
      ) : (
        <p>You have no history with this chatbot.</p>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createPost.mutate({ name });
        }}
        className="flex flex-col gap-2"
      >
        <input
          type="text"
          name="prompt"
          placeholder={placeholder}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-full bg-white/10 px-4 py-2 text-white"
        />
        <button
          type="submit"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
          disabled={createPost.isPending}
        >
          {createPost.isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
