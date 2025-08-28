/**
 * Type declarations to help editors and avoid implicit any issues in mixed JS setups.
 * These are ambient declarations and do not affect runtime.
 */

declare type ChatRole = "user" | "assistant" | "system";

declare interface ChatMessage {
  role: ChatRole;
  content: string;
}

declare interface ChatChoice {
  index: number;
  message: ChatMessage;
  finish_reason?: string | null;
}

declare interface ChatbotResponse {
  id?: string | null;
  model?: string | null;
  object?: string | null;
  created?: number | null;
  choices: ChatChoice[];
  usage?: Record<string, any> | null;
}
