"use client";

import { useState, useEffect } from "react";
import { useChat } from '@ai-sdk/react';
import { api } from "~/trpc/react";
import { Spinner } from "~/components/ui/spinner";
import clsx from "clsx";

export function LatestPost() {
  const { messages, setMessages, input, handleInputChange, handleSubmit, status } = useChat({});

  // todo replace with AI SDK
  const [latestPost] = api.post.getLatest.useSuspenseQuery();

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

  const handleDelete = (id: string) => {
    setMessages(messages.filter(message => message.id !== id))
  }

  // TODO: style like the Message Thread project from last week, with extra flair
  // TODO: extract repeat styles to common
  const buttonStyle = "cursor-pointer rounded-full bg-primary hover:bg-secondary text-white px-10 py-3 font-semibold transition-colors duration-200"

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
          <button onClick={() => handleDelete(message.id)}>Delete</button>
        </div>
      ))}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          name="prompt"
          placeholder={placeholder}
          value={input}
          onChange={handleInputChange}
          disabled={status !== 'ready'}
          className="w-full rounded-full bg-white/10 px-4 py-2 text-white flex-1"
        />

        {/* possible status: submitted, streaming, ready, error */}
        <button
          type="submit"
          className={clsx(
            buttonStyle,
            ['submitted', 'streaming', 'error'].includes(status) && 'cursor-not-allowed',
            status === 'error' && 'bg-red-400'
          )}
          disabled={['submitted', 'streaming', 'error'].includes(status)}
        >
          {status === 'submitted' || status === 'streaming' ? (
            <Spinner color="text-primary" />
          ) : status === 'error' ? (
            'Error'
          ) : (
            'Submit'
          )}
        </button>
      </form>
    </div>
  );
}
