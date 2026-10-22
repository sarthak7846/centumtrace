import { TraceData } from "../types";
import { ProviderAdapter } from "./provider-adapter";

type ModelPricing = {
  inputPerMillion: number;
  outputPerMillion: number;
  cachedInputPerMillion?: number;
};

const pricing: Record<string, ModelPricing> = {
  "gpt-5.6-sol": {
    inputPerMillion: 4,
    outputPerMillion: 20,
    cachedInputPerMillion: 0.4,
  },
};

export class OpenAIAdapter implements ProviderAdapter {
  extract(request: unknown, response: unknown): Partial<TraceData> {
    const requestData = request as any;
    const responseData = response as any;

    const inputTokens = responseData.usage.input_tokens;
    const outputTokens = responseData.usage.output_tokens;
    const totalTokens = responseData.usage.total_tokens;

    // Calculate cost based on model
    const modelPricing = pricing[responseData.model];
    let inputCost = 0;
    let outputCost = 0;
    let totalCost = 0;

    if (modelPricing) {
      inputCost = (inputTokens * modelPricing.inputPerMillion) / 1000000;
      outputCost = (outputTokens * modelPricing.outputPerMillion) / 1000000;
      totalCost = inputCost + outputCost;
    }

    return {
      input: { content: requestData.message },
      output: { content: responseData.output_text },
      inputTokens,
      outputTokens,
      totalTokens,
      inputCost,
      outputCost,
      totalCost,
      metadata: responseData.metadata,
    };
  }
}
