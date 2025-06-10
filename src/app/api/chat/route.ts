import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import type { Message } from '@ai-sdk/react';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

interface RequestBody {
  messages: Message[];
  customKey?: string;
}

export async function POST(req: Request) {
  const { messages, customKey }: RequestBody = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    system: 'You are a helpful assistant.',
    messages,
  });

  return result.toDataStreamResponse({
    // Custom error message handling
    getErrorMessage: error => {
      if (error == null) {
        return 'Unknown error occurred.';
      }

      if (typeof error === 'string') {
        return error;
      }

      if (error instanceof Error) {
        return error.message;
      }

      return JSON.stringify(error);
    },
    // Control whether to send usage information back to client
    sendUsage: true,
  });
}
