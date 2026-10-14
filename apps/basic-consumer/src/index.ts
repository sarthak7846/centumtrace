import { Observe, TraceStatus } from "@observe/sdk";
import OpenAI from "openai";
import "dotenv/config";

console.log(process.env.OPENAI_API_KEY);

const observe = new Observe({
  apiKey:
    "obs_live_3060e2c302a9a1ffbc8e4b1ca14dd269d7446ad295e84d16def58ce6eb25885a",
  baseUrl: "http://localhost:8000",
});

const client = new OpenAI();

const trace = observe.startTrace({
  model: "gpt-4",
  provider: "openai",
});

// console.log("trace", trace);

const response = await trace.capture(
  {
    message: "Write a one-sentence bedtime story about a unicorn.",
  },
  async () => {
    return client.responses.create({
      model: "gpt-5.6",
      input: "Write a one-sentence bedtime story about a unicorn.",
    });
    // return {
    //   id: "resp_0bd15333e2582904006aa954427a5087d2a699dff364648d1f",
    //   object: "response",
    //   created_at: 1789482050,
    //   status: "completed",
    //   background: false,
    //   billing: {
    //     payer: "developer"
    //   },
    //   completed_at: 1789482052,
    //   error: null,
    //   frequency_penalty: 0,
    //   incomplete_details: null,
    //   instructions: null,
    //   max_output_tokens: null,
    //   max_tool_calls: null,
    //   model: "gpt-5.6-sol",
    //   moderation: null,
    //   output: [
    //     {
    //       id: "msg_0bd15333e2582904006aa95443852887d2b38e8a1310fe27be",
    //       type: "message",
    //       status: "completed",
    //       content: [
    //         {
    //           type: "output_text",
    //           annotations: [],
    //           logprobs: [],
    //           text: "Under a silver moon, a little unicorn followed a trail of stardust home and fell asleep among the whispering flowers."
    //         }
    //       ],
    //       phase: "final_answer",
    //       role: "assistant"
    //     }
    //   ],
    //   parallel_tool_calls: true,
    //   presence_penalty: 0,
    //   previous_response_id: null,
    //   prompt_cache_key: null,
    //   prompt_cache_retention: "24h",
    //   reasoning: {
    //     context: "all_turns",
    //     effort: "medium",
    //     mode: "standard",
    //     summary: null
    //   },
    //   safety_identifier: null,
    //   service_tier: "default",
    //   store: true,
    //   temperature: 1,
    //   text: {
    //     format: {
    //       type: "text"
    //     },
    //     verbosity: "medium"
    //   },
    //   tool_choice: "auto",
    //   tool_usage: {
    //     image_gen: {
    //       input_tokens: 0,
    //       input_tokens_details: {
    //         image_tokens: 0,
    //         text_tokens: 0
    //       },
    //       output_tokens: 0,
    //       output_tokens_details: {
    //         image_tokens: 0,
    //         text_tokens: 0
    //       },
    //       total_tokens: 0
    //     },
    //     web_search: {
    //       num_requests: 0
    //     }
    //   },
    //   tools: [],
    //   top_logprobs: 0,
    //   top_p: 0.98,
    //   truncation: "disabled",
    //   usage: {
    //     input_tokens: 17,
    //     input_tokens_details: {
    //       cache_write_tokens: 0,
    //       cached_tokens: 0
    //     },
    //     output_tokens: 29,
    //     output_tokens_details: {
    //       reasoning_tokens: 0
    //     },
    //     total_tokens: 46
    //   },
    //   user: null,
    //   metadata: {},
    //   output_text: "Under a silver moon, a little unicorn followed a trail of stardust home and fell asleep among the whispering flowers."
    // }
  },
);

// const response = await trace.capture(async () => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve({
//         inputTokens: 120,
//         outputTokens: 350,
//         totalTokens: 470,
//       });
//     }, 2000);
//   });
// });

console.log("result", JSON.stringify(response, null, 2));

// setTimeout(async () => {
//   await trace.end({
//     status: TraceStatus.SUCCESS,
//     inputTokens: 120,
//     outputTokens: 350,
//     totalTokens: 470,
//   });
// }, 2000);

// try {
//   const response = await openai.chat.completions.create(...);

//   await trace.end({
//     status: TraceStatus.SUCCESS,
//   });

//   return response;
// } catch (error) {
//   await trace.end({
//     status: TraceStatus.ERROR,
//     errorType: error.constructor.name,
//     errorMessage: error.message,
//   });

//   throw error;
// }
