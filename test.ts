import 'dotenv/config'
import { Puzzlet } from "@puzzlet/sdk";
import { ModelPluginRegistry, runInference } from "@puzzlet/agentmark";
import OpenAIChatPlugin from '@puzzlet/openai';
const client = new Puzzlet({
  apiKey: process.env.PUZZLET_API_KEY!,
  appId: process.env.PUZZLET_APP_ID!,
  baseUrl: 'https://gateway-staging.ryan-5f0.workers.dev'
});
client.initTracing({ disableBatch: true });

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
  try {
    const prompt = await client.fetchTemplate("math.prompt.mdx");
    console.log('*** ', JSON.stringify(prompt, null, 2));
    const result = await runInference(prompt);
    console.log('*** ', result);
  } catch (e) {
    console.error('*** ', e);
  }

}

run();