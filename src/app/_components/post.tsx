"use client";

import { useState, useEffect } from "react";

import { useChat } from '@ai-sdk/react';

import { api } from "~/trpc/react";

export function LatestPost() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({});

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
  // NPNgreen: #37c73f
  // NPNpurple: #5e4780;

  return (
    <div className="w-full max-w-xl">
      {latestPost ? (
        <p className="truncate">Chatbot: {latestPost.name}</p>
      ) : (
        <p>You have no history with this chatbot.</p>
      )}

      {messages.map(message => (
        <div key={message.id}>
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.content}
        </div>
      ))}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          name="prompt"
          placeholder={placeholder}
          value={input}
          onChange={handleInputChange}
          className="w-full rounded-full bg-white/10 px-4 py-2 text-white flex-1"
        />
        <button
          type="submit"
          className="cursor-pointer rounded-full bg-green-600 hover:bg-purple-600 px-10 py-3 font-semibold transition"
          disabled={createPost.isPending}
        >
          {createPost.isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
