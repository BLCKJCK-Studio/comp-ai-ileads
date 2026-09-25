/**
 * Model ids routed through the Vercel AI Gateway.
 *
 * Client-safe (no provider import) so UI code can reference the ids without
 * pulling the gateway provider into the browser bundle. Change models here.
 */

/** Text generation everywhere (chat, structured output, extraction). */
export const CLAUDE_MODEL = 'anthropic/claude-opus-5' as const;

/** 1536-dim embeddings (vector store / knowledge base). */
export const EMBEDDING_MODEL_SMALL = 'openai/text-embedding-3-small' as const;

/** Configurable-dim embeddings (entity linkage; dimensions set per call). */
export const EMBEDDING_MODEL_LARGE = 'openai/text-embedding-3-large' as const;
