import 'dotenv/config';
import { Puzzlet } from "@puzzlet/sdk";
import { runInference, ModelPluginRegistry, ToolPluginRegistry, Tool } from "@puzzlet/agentmark";
import AllModels from "@puzzlet/all-models";
const puzzletClient = new Puzzlet({
  apiKey: process.env.PUZZLET_API_KEY!,
  appId: process.env.PUZZLET_APP_ID!,
  baseUrl: process.env.PUZZLET_BASE_URL!,
});
const tracer = puzzletClient.initTracing();

async function log({ message }: { message: string }): Promise<string> {
  console.log(message);
  return message;
}

ToolPluginRegistry.register(log, "log");

// Note: Registering all latest models for demo/development purposes. 
// In production, you'll likely want to selectively load these, and pin models.
// See AgentMark docs for more details: https://docs.puzzlet.ai/agentmark/model-providers
ModelPluginRegistry.registerAll(AllModels);

async function run () {
  const prompt = await puzzletClient.fetchPrompt("math.prompt.mdx");
  console.log(prompt);
  const props = {};
  const telemetry = {
    isEnabled: true,
    functionId: 'example-function-id',
    metadata: { userId: 'example-user-id' }
  };
  return (await runInference(prompt, props, { telemetry }));
}

let results: Promise<any>[] = [];
for (let i = 0; i < 10; i++) {
  // Note: You only need to shutdown the tracer for local/short running tasks.
  results.push(run().then(console.log));
}

Promise.all(results).finally(() => tracer.shutdown());
