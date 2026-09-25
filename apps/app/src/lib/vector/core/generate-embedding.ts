import 'server-only';

import { aiGateway, EMBEDDING_MODEL_SMALL } from '@/lib/ai/models';
import { embed } from 'ai';

/**
 * Generates an embedding vector for the given text using OpenAI text-embedding-3-small (1536 dims) via the Vercel AI Gateway
 * @param text - The text to generate an embedding for
 * @returns An array of numbers representing the embedding vector
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const { embedding } = await embed({
      model: aiGateway.embeddingModel(EMBEDDING_MODEL_SMALL),
      value: text,
    });

    return embedding;
  } catch (error) {
    throw new Error(
      `Failed to generate embedding: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

