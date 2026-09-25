import { beforeEach, describe, expect, it, vi } from 'vitest';

const { aiGatewayMock, getAvailableModelsMock } = vi.hoisted(() => {
  const getAvailableModelsMock = vi.fn();
  const aiGatewayMock = Object.assign(
    vi.fn((modelId: string) => ({ modelId })),
    { getAvailableModels: getAvailableModelsMock },
  );
  return { aiGatewayMock, getAvailableModelsMock };
});

vi.mock('@/lib/ai/models', () => ({
  aiGateway: aiGatewayMock,
  CLAUDE_MODEL: 'anthropic/claude-opus-5',
}));

import { getAvailableModels, getModelOptions } from './gateway';

beforeEach(() => {
  aiGatewayMock.mockClear();
  getAvailableModelsMock.mockReset();
});

describe('getAvailableModels', () => {
  it('only offers Claude models from the gateway catalog', async () => {
    getAvailableModelsMock.mockResolvedValueOnce({
      models: [
        { id: 'anthropic/claude-opus-5', name: 'Claude Opus 5' },
        { id: 'openai/gpt-5', name: 'GPT-5' },
        { id: 'google/gemini-3.1-flash-lite', name: 'Gemini' },
      ],
    });

    await expect(getAvailableModels()).resolves.toEqual([
      { id: 'anthropic/claude-opus-5', name: 'Claude Opus 5' },
    ]);
  });
});

describe('getModelOptions', () => {
  it('uses a requested Claude model without provider options', () => {
    const options = getModelOptions('anthropic/claude-opus-5');
    expect(aiGatewayMock).toHaveBeenCalledWith('anthropic/claude-opus-5');
    expect(options.providerOptions).toBeUndefined();
  });

  it('falls back to CLAUDE_MODEL for non-Claude ids', () => {
    getModelOptions('google/gemini-3.1-flash-lite');
    expect(aiGatewayMock).toHaveBeenCalledWith('anthropic/claude-opus-5');
  });
});
