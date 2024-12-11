import 'dotenv/config';
import { Puzzlet } from "@puzzlet/sdk";
import { ModelPluginRegistry, runInference } from "@puzzlet/agentmark";
import AllModels from '@puzzlet/all-models';

const puzzletClient = new Puzzlet({
  apiKey: process.env.PUZZLET_API_KEY!,
  appId: process.env.PUZZLET_APP_ID!,
});
const tracer = puzzletClient.initTracing();

ModelPluginRegistry.registerAll(AllModels);

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
