import 'dotenv/config'
import { Puzzlet, trace, component } from "@puzzlet/sdk";
import { PromptTemplateRuntime } from "@puzzlet/prompt-template";
const client = new Puzzlet({ apiKey: process.env.PUZZLET_API_KEY!, appId: process.env.PUZZLET_APP_ID! });
client.initTracing({ disableBatch: true });


class Test {
  @trace({ name: 'trace', associationProperties: { userId: '12345'} })
  async run () {
    await this.runPrompt1();
    await this.runPrompt2();
  }

  @component({ name: 'component-1'})
  async runPrompt1() {
    const json = await client.fetchTemplate("prompt_template_1.json");
    const templateRuntime = PromptTemplateRuntime.load(json);
    await templateRuntime.runSingle("prompt1", { animal: 'Tiger' });
  }

  @component({ name: 'component-2'})
  async runPrompt2 () {
    const json = await client.fetchTemplate("prompt_template_1.json");
    const templateRuntime = PromptTemplateRuntime.load(json);
    await templateRuntime.runDependencyChain("prompt2", { animal: 'Tiger' });
  }
}

for (let i = 0; i < 5; i++) {
  new Test().run();
}