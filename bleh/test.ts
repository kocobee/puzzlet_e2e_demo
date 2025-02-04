import 'dotenv/config';
import { ModelPluginRegistry, createTemplateRunner, ToolPluginRegistry } from "@puzzlet/agentmark";
import AllModels from "@puzzlet/all-models";
import type PuzzletTypes from "../puzzlet1.types";
import { Puzzlet, trace, component } from '@puzzlet/sdk';

// async function calculator(obj: { num1: number, num2: number }) {
//   return obj.num1 + obj.num2;
// }

// ToolPluginRegistry.register(calculator, 'calculator');

const puzzletClient = new Puzzlet<PuzzletTypes>({
  apiKey: process.env.PUZZLET_API_KEY!,
  appId: process.env.PUZZLET_APP_ID!,
  baseUrl: process.env.PUZZLET_BASE_URL!,
}, createTemplateRunner);
const tracer = puzzletClient.initTracing();
tracer.start();

// Note: Registering all latest models for demo/development purposes. 
// In production, you'll likely want to selectively load these, and pin models.
// See AgentMark docs for more details: https://docs.puzzlet.ai/agentmark/model-providers
ModelPluginRegistry.registerAll(AllModels);

async function run () {
  const prompt = await puzzletClient.fetchPrompt('test/math2.prompt.mdx');
  const props = {
    userMessage: "What is 2 + 3? DONT use the calculator tool."
  };
  const telemetry = {
    isEnabled: true,
    functionId: 'example-function-id',
    metadata: { userId: 'example-user-id' }
  };
  const resp = await prompt.run(props, { telemetry });
  console.log(resp);
  return resp.result;
}

run().then(() => tracer.shutdown()).catch(console.error);

// let results: Promise<any>[] = [];
// for (let j = 0; j < 2; j++) {
//   trace(`trace-${j}`, async () => {
//     for (let i = 0; i < 2; i++) {
//       component(`component-${i}`, async () => {
//         results.push(run().then(console.log));
//       });
//     }
//   });
// }

// Promise.all(results).then(() => tracer.shutdown()).catch(console.error)