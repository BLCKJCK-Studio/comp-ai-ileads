import { createGateway } from 'ai';

export { CLAUDE_MODEL, EMBEDDING_MODEL_SMALL } from './model-ids';

/**
 * Shared Vercel AI Gateway provider. Authenticates with AI_GATEWAY_API_KEY,
 * or with Vercel OIDC automatically when running on Vercel. No per-vendor
 * keys (OpenAI, Anthropic, Groq, Google) are needed.
 */
export const aiGateway = createGateway({
  baseURL: process.env.AI_GATEWAY_BASE_URL,
});
