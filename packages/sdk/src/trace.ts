import { ProviderAdapter } from "./providers/provider-adapter";
import { Transport } from "./transport";
import { EndTracePayload, StartTracePayload, TraceStatus } from "./types";

export class Trace {
  private readonly traceId: string;
  private readonly startedAt: Date;

  constructor(
    private readonly transport: Transport,
    private readonly options: StartTracePayload,
    private readonly adapter: ProviderAdapter,
  ) {
    this.traceId = crypto.randomUUID();
    this.startedAt = new Date();
  }

  async capture<T>(
    input: Record<string, unknown>,
    fn: () => Promise<T>,
  ): Promise<T> {
    try {
      const result = await fn();

      console.log("llm response", result);

      const extracted = this.adapter.extract(input, result);

      const res = await this.end({
        status: TraceStatus.SUCCESS,
        ...extracted,
      });

      // console.log('be response', res)

      return result;
    } catch (error) {
      await this.end({
        status: TraceStatus.ERROR,
        errorType:
          error instanceof Error ? error.constructor.name : "UnknownError",
        errorMessage: error instanceof Error ? error.message : String(error),
      });

      throw error;
    }
  }

  private async end(data: EndTracePayload) {
    const endedAt = new Date();
    const latencyMs = endedAt.getTime() - this.startedAt.getTime();

    return this.transport.sendTrace({
      traceId: this.traceId,
      model: this.options.model,
      provider: this.options.provider,
      startedAt: this.startedAt.toISOString(),
      endedAt: endedAt.toISOString(),
      latencyMs,
      ...data,
    });
  }
}
