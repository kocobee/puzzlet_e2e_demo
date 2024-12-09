import 'dotenv/config';
import { Puzzlet } from "@puzzlet/sdk";
import { ModelPluginRegistry, runInference } from "@puzzlet/agentmark";
import OpenAIChatPlugin from '@puzzlet/openai';

const puzzletClient = new Puzzlet({
  apiKey: process.env.PUZZLET_API_KEY!,
  appId: process.env.PUZZLET_APP_ID!,
  baseUrl: 'https://gateway-staging.ryan-5f0.workers.dev'
});
const tracer = puzzletClient.initTracing();

// Register relevant plugins for AgentMark: OpenAI, Anthropic, etc.

ModelPluginRegistry.register(new OpenAIChatPlugin(), [
  "gpt-4o",
  "gpt-4o-mini",
  "gpt-4-turbo",
  "gpt-4",
  "o1-mini",
  "o1-preview",
  "gpt-3.5-turbo",
]);

async function run() {
  try {
    const prompt = await puzzletClient.fetchPrompt("math.prompt.mdx");
    const props = { num: 3 };
    const telemetry = {
      isEnabled: true,
      functionId: 'example-function-id',
      metadata: { userId: 'example-user-id' }
    };
    return (await runInference(prompt, props, { telemetry }));
  } catch (error) {
    console.error(error);
  }
}
run().then(console.log)
  .then(() => tracer.shutdown())
  .then(() => process.exit(0));
