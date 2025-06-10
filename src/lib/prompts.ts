import { SEED_PROMPTS, FALLBACK_PROMPT } from "~/lib/constants";

export const getRandomPrompt = (): string => {
  const index = Math.floor(Math.random() * SEED_PROMPTS.length);
  const randomPrompt = SEED_PROMPTS[index];
  return randomPrompt ?? FALLBACK_PROMPT;
};

export const getAllPrompts = () => SEED_PROMPTS;

export const getPromptCount = () => SEED_PROMPTS.length;
