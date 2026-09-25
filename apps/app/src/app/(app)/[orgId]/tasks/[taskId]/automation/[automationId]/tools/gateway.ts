import { aiGateway, CLAUDE_MODEL } from '@/lib/ai/models';
import type { LanguageModelV3 } from '@ai-sdk/provider';
import type { JSONValue } from 'ai';

const CLAUDE_MODEL_PREFIX = 'anthropic/';

function isClaudeModelId(modelId: string): boolean {
  return modelId.startsWith(CLAUDE_MODEL_PREFIX);
}

/** Only Claude models are offered; every model call goes through the AI Gateway. */
export async function getAvailableModels() {
  const response = await aiGateway.getAvailableModels();
  return response.models
    .filter((model) => isClaudeModelId(model.id))
    .map((model) => ({ id: model.id, name: model.name }));
}

export interface ModelOptions {
  model: LanguageModelV3;
  providerOptions?: Record<string, Record<string, JSONValue>>;
  headers?: Record<string, string>;
}

/**
 * Resolves a model for the automation agent. Non-Claude ids (e.g. stale ids
 * persisted by older clients) fall back to CLAUDE_MODEL.
 */
export function getModelOptions(modelId: string): ModelOptions {
  const resolvedModelId = isClaudeModelId(modelId) ? modelId : CLAUDE_MODEL;
  return { model: aiGateway(resolvedModelId) };
}
