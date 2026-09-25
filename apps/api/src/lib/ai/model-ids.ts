/**
 * Model ids routed through the Vercel AI Gateway. Change models here.
 *
 * Kept free of provider imports so constants modules (and their tests) can
 * reference the ids without instantiating the gateway provider.
 */

/** Text generation everywhere (chat, structured output, extraction). */
export const CLAUDE_MODEL = 'anthropic/claude-opus-5' as const;

/** 1536-dim embeddings (vector store / knowledge base). */
export const EMBEDDING_MODEL_SMALL = 'openai/text-embedding-3-small' as const;
