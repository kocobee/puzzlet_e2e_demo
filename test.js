import 'dotenv/config'
import { Puzzlet } from "@puzzlet/sdk";
import { runInference } from "@puzzlet/agentmark";
const client = new Puzzlet({
  apiKey: process.env.PUZZLET_API_KEY,
  appId: process.env.PUZZLET_APP_ID,
});
client.initTracing({ disableBatch: true });

async function run () {
  const prompt = await client.fetchTemplate("math.prompt.mdx");
  await runInference(prompt);
}
await run();