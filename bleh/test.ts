import 'dotenv/config';
import { ModelPluginRegistry, FileLoader } from "@puzzlet/agentmark";
import AllModels from "@puzzlet/all-models";
import type PuzzletTypes from "../puzzlet1.types";
import { Puzzlet } from '@puzzlet/sdk';

// const fileLoader = new FileLoader<PuzzletTypes>('./puzzlet/templates');

const puzzletClient = new Puzzlet<PuzzletTypes>({
  apiKey: process.env.PUZZLET_API_KEY!,
  appId: process.env.PUZZLET_APP_ID!,
  baseUrl: process.env.PUZZLET_BASE_URL!,
});
const tracer = puzzletClient.initTracing();

// Note: Registering all latest models for demo/development purposes. 
// In production, you'll likely want to selectively load these, and pin models.
// See AgentMark docs for more details: https://docs.puzzlet.ai/agentmark/model-providers
ModelPluginRegistry.registerAll(AllModels);

async function run () {
  const prompt = await fileLoader.load('test/math2.prompt.mdx');
  const props = {
    userMessage: "What is the quadratic formula used for?"
  };
  const telemetry = {
    isEnabled: true,
    functionId: 'example-function-id',
    metadata: { userId: 'example-user-id' }
  };
  const resp = await prompt.run(props, { telemetry });
  return resp.result.object.answer;
}

let results: Promise<any>[] = [];
for (let i = 0; i < 10; i++) {
  // Note: You only need to shutdown the tracer for local/short running tasks.
  results.push(run().then(console.log));
}

Promise.all(results).then(() => console.log('done'));