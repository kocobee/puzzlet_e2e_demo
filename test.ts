import 'dotenv/config'
import { Puzzlet } from "@puzzlet/sdk";
import { ModelPluginRegistry, runInference } from "@puzzlet/agentmark";
import OpenAIChatPlugin from '@puzzlet/openai';
const client = new Puzzlet({
  apiKey: process.env.PUZZLET_API_KEY!,
  appId: process.env.PUZZLET_APP_ID!,
  baseUrl: 'https://gateway-staging.ryan-5f0.workers.dev'
});
client.initTracing();

ModelPluginRegistry.register(new OpenAIChatPlugin(), [
  "gpt-4o",
  "gpt-4o-mini",
  "gpt-4-turbo",
  "gpt-4",
  "o1-mini",
  "o1-preview",
  "gpt-3.5-turbo",
]);


async function run () {
  const prompt = await client.fetchPrompt("math.prompt.mdx");
  const props = { num: 3 };
  const telemetry = { isEnabled: true, functionId: '1', metadata: { userId: '12345' } };  
  return (await runInference(prompt, props, { telemetry }));
}
run().then(console.log).catch(console.error);
