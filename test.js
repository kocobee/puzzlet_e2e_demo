import 'dotenv/config'
import { Puzzlet } from "@puzzlet/sdk";
import { PromptTemplateRuntime } from "@puzzlet/prompt-template";
const client = new Puzzlet({ apiKey: process.env.PUZZLET_API_KEY, appId: process.env.PUZZLET_APP_ID });
client.initTracing({ disableBatch: true });

async function run () { 
  const json = await client.fetchTemplate("prompt_template_1.json");
  const templateRuntime = PromptTemplateRuntime.load(json);
  await templateRuntime.runSingle("prompt1", { name: 'Jim' });
}
await run();