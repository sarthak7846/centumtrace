import dotenv from "dotenv";
import path from "path";
import { Observe } from "@observe/sdk";
import { generateTrace } from "./simulator";

dotenv.config({ path: path.resolve(import.meta.dirname, "../../../.env") });

const observe = new Observe({
  apiKey: process.env.OBSERVE_API_KEY_RICKY_CODEMATE!,
  baseUrl: process.env.OBSERVE_API_URL!,
});

const requestsPerSecond = Number(process.env.REQUESTS_PER_SECOND ?? 10);
const durationSeconds = Number(process.env.DURATION_SECONDS ?? 20);
const minLatencyMs = Number(process.env.MIN_LATENCY_MS ?? 300);
const maxLatencyMs = Number(process.env.MAX_LATENCY_MS ?? 1500);
const errorRate = Number(process.env.ERROR_RATE ?? 0.02);

const config = {
  requestsPerSecond,
  durationSeconds,
  minLatencyMs,
  maxLatencyMs,
  errorRate,
};

console.log("Starting traffic simulation...");
console.log(config);

const startTime = Date.now();
const durationMs = durationSeconds * 1000;

let generated = 0;
let failed = 0;

const runningRequests: Promise<void>[] = [];

while (Date.now() - startTime < durationMs) {
  const secondStart = Date.now();

  for (let i = 0; i < requestsPerSecond; i++) {
    generated++;

    const request = generateTrace(observe, config)
      .then(() => {})
      .catch(() => {
        failed++;
      });

    runningRequests.push(request);
  }

  const elapsed = Date.now() - secondStart;
  const remaining = 1000 - elapsed;

  if (remaining > 0) {
    await new Promise((resolve) =>
      setTimeout(resolve, remaining),
    );
  }
}

await Promise.all(runningRequests);

const elapsedSeconds = (Date.now() - startTime) / 1000;

console.log("\n──────── Simulation Summary ────────");

console.log(`Target RPS:       ${requestsPerSecond}`);
console.log(`Duration:         ${durationSeconds}s`);
console.log(`Generated:        ${generated}`);
console.log(`Failed:           ${failed}`);
console.log(`Actual RPS:       ${(generated / elapsedSeconds).toFixed(2)}`);

console.log("───────────────────────────────────");
