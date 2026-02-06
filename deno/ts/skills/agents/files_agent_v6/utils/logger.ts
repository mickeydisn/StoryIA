import { join } from "jsr:@std/path";
import { ModelConfig } from "./ModelConfig.ts";

// Custom callback handler for detailed logging
export class DetailedLoggerCallback {
  stepNumber = 0;
  logs: string[] = [];
  config: ModelConfig;

  constructor(config: ModelConfig) {
    this.config = config;
  }

  _splitIntoLines(text: string, maxLen = 120): string[] {
    const words = text.split(/\s+/);
    const lines: string[] = [];
    let currentLine = "";

    for (const word of words) {
      // If adding the word would exceed max length
      if ((currentLine + " " + word).trim().length > maxLen) {
        if (currentLine.length > 0) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          // Word itself is longer than maxLen → hard split
          for (let i = 0; i < word.length; i += maxLen) {
            lines.push(word.slice(i, i + maxLen));
          }
          currentLine = "";
        }
      } else {
        currentLine = currentLine ? `${currentLine} ${word}` : word;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  }

  log_promp(message: string) {
    let prompt: string = "```\n" + message + "\n```\n";

    prompt = prompt.replaceAll("\nHuman:", "\n```\n```\nHuman:");
    prompt = prompt.replaceAll("\nAI:", "\n```\n```\nAI:");
    prompt = prompt.replaceAll("\nTool:", "\n```\n```\nHuman:");
    prompt = prompt.replaceAll("\nSystem", "\n```\n```\nSystem:");
    prompt = prompt.replaceAll("```\n```\n```", "```");
    this.log(prompt);
  }

  log_md(message: string) {
    this.log("```\n" + message + "\n```\n");
  }

  log(message: string) {
    if (!this.config.logging.enabled) return;

    const timestamp = new Date().toISOString();
    // const logEntry = `[${timestamp}] ${message}`;
    let logEntry = message;
    // logEntry = this._splitIntoLines(logEntry).join('\n');
    if (logEntry.startsWith("---")) {
      logEntry = `\n${logEntry}\n`;
    }
    if (logEntry.startsWith("#")) {
      logEntry = `\n${logEntry}\n`;
    }
    console.log(logEntry);
    this.logs.push(logEntry);
  }

  handleLLMStart(llm: any, prompts: string[]) {
    this.stepNumber++;
    this.log(`---`);
    this.log(`# STEP ${this.stepNumber}: LLM THINKING`);
    if (this.config.logging.verbose) {
      this.log(`## Prompt Preview: `);
      // this.log(`${JSON.stringify(prompts, null, 2)}\n`);
      this.log_promp(prompts[0]);
    }
  }

  handleLLMEnd(output: any) {
    if (this.config.logging.verbose) {
      this.log(`## LLM Response Preview: `);

      const token = output?.llmOutput?.tokenUsage;
      if (token) {
        this.log_md(
          `
  promptTokens :  ${token?.promptTokens},
  completionTokens :  ${token?.completionTokens},
  totalTokens :  ${token?.totalTokens},
  `.trim()
        );
      }

      const gen = output?.generations[0][0];
      if (gen) {
        const tool_calls = JSON.stringify(gen?.message?.tool_calls);
        this.log_md(
          `
  finish_reason :  ${gen?.generationInfo?.finish_reason},
  tool_calls :  ${tool_calls},
  invalid_tool_calls :  ${gen?.message?.invalid_tool_calls},
        `.trim()
        );

        const text = gen.text;
        this.log_md(text);
      } else {
        this.log_md(`no.generations`);
        this.log_md(`${JSON.stringify(output, null, 2).substring(0, 100000)}`);
      }
    }
  }

  handleToolStart(tool: any, input: any) {
    this.stepNumber++;
    this.log(`# STEP ${this.stepNumber}: TOOL CALL - \n`);
    this.log(JSON.stringify(tool));
    this.log(`## Tool Input:`);
    this.log_md(input);
    // this.log_md(`${JSON.stringify(input, null, 2).substring(0, 1000)}`);
  }

  handleToolEnd(output: any) {
    this.log(`## Tool Output:`);
    this.log_md(output.toString());
  }

  handleAgentAction(action: any) {
    if (this.config.logging.verbose) {
      this.log(`## Agent Action:`);
      // this.log(`Tool: ${action.tool}`);
      // this.log(`Tool Input:\n${JSON.stringify(action.toolInput, null, 2).substring(0, 10)}`);
      // this.log(`\n${"#".repeat(80)}`);
    }
  }

  handleAgentEnd(result: any) {
    this.log(`# FINAL RESULT`);
    this.log(`## Output:`);
    this.log_md(
      `${
        result.returnValues?.output || result.output || JSON.stringify(result)
      }`
    );
  }

  async saveLogs() {
    if (!this.config.logging.saveToFile) return;

    // const logFile = join(WORKSPACE_DIR, `agent_log_${Date.now()}.md`);
    const logFile = join(this.config.workspace.baseDir, `agent_log_A.md`);
    await Deno.writeTextFile(logFile, this.logs.join("\n"));
    this.log(`📁 Logs saved to: ${logFile}`);
  }
}
