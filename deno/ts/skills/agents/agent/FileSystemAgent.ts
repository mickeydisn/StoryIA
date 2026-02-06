import { ChatOpenAI } from "npm:@langchain/openai@0.3.13";
import { ChatPromptTemplate } from "npm:@langchain/core@0.2.13/prompts";
import {
  AgentExecutor,
  createToolCallingAgent,
} from "npm:langchain@0.2.13/agents";
import {
  createFileTool,
  searchFilesTool,
  searchInFilesTool,
} from "./file_tools.ts";
import { AgentLogger } from "./AgentLogger.ts";

export class FileSystemAgent {
  private agentExecutor!: AgentExecutor;
  private llm: ChatOpenAI;
  private logger: AgentLogger;
  private config: {
    baseURL: string;
    modelName: string;
    temperature: number;
    verbose: boolean;
  };

  constructor(config: any = {}) {
    this.config = {
      baseURL: config.baseURL ?? "http://localhost:1234/v1",
      modelName: config.modelName ?? "local-model",
      temperature: config.temperature ?? 0.7,
      verbose: config.verbose ?? true,
    };

    this.logger = new AgentLogger(this.config.verbose);
    this.llm = new ChatOpenAI({
      modelName: this.config.modelName,
      temperature: this.config.temperature,
      openAIApiKey: "lm-studio",
      configuration: { baseURL: this.config.baseURL },
    });
  }

  private async initializeAgent() {
    const rawTools = [createFileTool(), searchFilesTool(), searchInFilesTool()];

    // Wrap tools to trigger logger events
    const tools = rawTools.map((t) => ({
      ...t,
      call: async (input: any, config: any) => {
        this.logger.toolCall(t.name, input);
        const result = await t.call(input, config);
        this.logger.toolResult(
          typeof result === "string" ? result : JSON.stringify(result)
        );
        return result;
      },
    }));

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", "You are a file system AI. Be precise and report actions."],
      ["human", "{input}"],
      ["placeholder", "{agent_scratchpad}"],
    ]);

    const agent = await createToolCallingAgent({
      llm: this.llm,
      tools,
      prompt,
    });
    this.agentExecutor = new AgentExecutor({ agent, tools, verbose: false });
  }

  async execute(prompt: string): Promise<string> {
    try {
      this.logger.start(prompt);
      if (!this.agentExecutor) await this.initializeAgent();

      const result = await this.agentExecutor.invoke({ input: prompt });
      this.logger.complete(result.output);
      return result.output;
    } catch (error: any) {
      this.logger.error(error.message);
      throw error;
    }
  }
}
