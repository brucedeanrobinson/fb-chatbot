"use client";

import { useState, useEffect } from "react";
import { useChat } from '@ai-sdk/react';
import { api } from "~/trpc/react";
import clsx from "clsx";

import { Spinner } from "~/components/ui/spinner";
import { getRandomPrompt } from "~/lib/prompts";

export function LatestPost() {
  const { messages, setMessages, input, setInput, handleSubmit, append, status, stop, reload } = useChat({
    // Custom API endpoint and request configuration
    api: '/api/chat', // can change this to '/api/custom-chat' if needed
    headers: {
      'Authorization': 'Bearer your_token_here', // Replace with actual auth token
      'X-Custom-Header': 'your-custom-value',
      // Add any other custom headers your API needs
    },
    body: {
      user_id: '123', // Replace with actual user ID
      session_id: crypto.randomUUID(), // Generate unique session ID
      // Add any other persistent body fields your backend needs
    },
    credentials: 'same-origin', // Configure credentials for CORS

    // Throttle the messages and data updates to 50ms for smoother performance
    experimental_throttle: 50,
    // Event callbacks for logging, analytics, and error handling
    onFinish: (message, { usage, finishReason }) => {
      console.log('Finished streaming message:', message);
      console.log('Token usage:', usage);
      console.log('Finish reason:', finishReason);
      // TODO: Add analytics tracking here
      // analytics.track('chat_message_completed', { finishReason, tokenUsage: usage });
    },
    onError: (error) => {
      console.error('Chat error occurred:', error);
      // TODO: Add error reporting here
      // errorReporting.captureException(error);
    },
    onResponse: (response) => {
      console.log('Received HTTP response from server:', response);
      // TODO: Add response monitoring here
      // can abort processing by throwing an error here if needed
      // if (!response.ok) {
      //   throw new Error('Unexpected response from AI provider');
      // }
    }
  });

  // todo replace with AI SDK
  const [latestPost] = api.post.getLatest.useSuspenseQuery();

  const [placeholder, setPlaceholder] = useState("")
  useEffect(() => {
    setPlaceholder(getRandomPrompt())
  }, []);

  const handleDelete = (id: string) => {
    setMessages(messages.filter(message => message.id !== id))
  }

  // TODO: style like the Message Thread project from last week, with extra flair
  // TODO: extract repeat styles to common
  const buttonStyle = "cursor-pointer rounded-full bg-primary hover:bg-secondary text-white px-10 py-3 font-semibold transition-colors duration-200"
  const secondaryButtonStyle = "cursor-pointer rounded-full bg-gray-600 hover:bg-gray-500 text-white px-6 py-2 font-semibold transition-colors duration-200"

  return (
    <div className="w-full max-w-xl">
      {latestPost ? (
        <p className="truncate">Chatbot: {latestPost.name}</p>
      ) : (
        <p>You have no history with this chatbot.</p>
      )}

      {messages.map(message => (
        <div key={message.id} className="mb-2 p-2 border border-gray-600 rounded">
          <div className="flex justify-between items-start">
            <div>
              <span className="font-bold">
                {message.role === 'user' ? 'User: ' : 'AI: '}
              </span>
              <span>{message.content}</span>
            </div>
            <button
              onClick={() => handleDelete(message.id)}
              className="ml-2 px-2 py-1 bg-error text-white text-xs rounded hover:bg-error-light"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* Show streaming status and stop/regenerate controls */}
      {(status === 'submitted' || status === 'streaming') && (
        <div className="flex items-center gap-2 my-4">
          {status === 'submitted' && <Spinner color="text-primary" />}
          <span className="text-sm text-gray-400">
            {status === 'submitted' ? 'Sending...' : 'AI is responding...'}
          </span>
          <button
            type="button"
            onClick={() => stop()}
            className={clsx(secondaryButtonStyle, "text-sm px-4 py-1")}
          >
            Stop
          </button>
        </div>
      )}

      {/* Show regenerate button when ready or error */}
      {(status === 'ready' || status === 'error') && messages.length > 0 && (
        <div className="flex justify-end my-4">
          <button
            type="button"
            onClick={() => reload()}
            disabled={!(status === 'ready' || status === 'error')}
            className={clsx(secondaryButtonStyle, "text-sm px-4 py-1")}
          >
            Regenerate Last Response
          </button>
        </div>
      )}

      <form onSubmit={event => {
        // If empty, prevent default and manually append the placeholder
        if (input.trim() === '') {
          event.preventDefault();
          void append({
            role: 'user',
            content: placeholder,
          });
        } else {
          handleSubmit(event, {
            allowEmptySubmit: true,
            body: input.trim() === '' ? { customKey: placeholder } : undefined
          });
        }
      }} className="flex gap-2">
        <input
          type="text"
          name="prompt"
          placeholder={placeholder}
          value={input}
          onChange={event => setInput(event.target.value)}
          disabled={status !== 'ready'}
          className="w-full rounded-full bg-white/10 px-4 py-2 text-white flex-1"
        />

        {/* possible status: submitted, streaming, ready, error */}
        <button
          type="submit"
          className={clsx(
            buttonStyle,
            ['submitted', 'streaming', 'error'].includes(status) && 'cursor-not-allowed',
            status === 'error' && 'bg-error-light'
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
