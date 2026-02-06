#!/usr/bin/env -S deno run --allow-net --allow-read --allow-write --allow-env
// import { createDeepAgent } from "npm:deepagents";
import { createAgent, tool } from "npm:langchain";
import { z } from "npm:zod";

import { DynamicStructuredTool } from "npm:@langchain/core/tools";

// import { AgentExecutor, createOpenAIToolsAgent } from "npm:@langchain/agents";
import { ChatPromptTemplate } from "npm:@langchain/core/prompts";
import { ChatOpenAI } from "langchain/openai";

import { join, dirname } from "jsr:@std/path";
import { ensureDir, exists } from "jsr:@std/fs";
import { parse } from "jsr:@std/flags";

// Get current directory
const currentDir = dirname(new URL(import.meta.url).pathname);
const WORKSPACE_DIR = join(currentDir, "workspace");

// Load model configuration
interface ModelConfig {
  model: {
    provider: string;
    baseURL: string;
    apiKey: string;
    model: string;
    temperature: number;
    maxTokens: number;
  };
  workspace: {
    baseDir: string;
  };
  logging: {
    enabled: boolean;
    saveToFile: boolean;
    verbose: boolean;
  };
}

async function loadConfig(): Promise<ModelConfig> {
  const configPath = join(currentDir, "model_config.json");
  const configText = await Deno.readTextFile(configPath);
  const config = JSON.parse(configText);

  // Replace environment variables in config
  if (config.model.apiKey.startsWith("${")) {
    const envVar = config.model.apiKey.slice(2, -1);
    config.model.apiKey = Deno.env.get(envVar) || config.model.apiKey;
  }

  return config;
}

// Custom callback handler for detailed logging
class DetailedLoggerCallback {
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
    const logFile = join(WORKSPACE_DIR, `agent_log_A.md`);
    await Deno.writeTextFile(logFile, this.logs.join("\n"));
    this.log(`📁 Logs saved to: ${logFile}`);
  }
}

// Tool 1: Find file by exact name
function createFindFileByNameTool(workspaceDir: string) {
  return new DynamicStructuredTool({
    name: "find_file_by_name",
    description:
      "Find a file by its exact name in the workspace directory. Returns the file path if found.",
    schema: z.object({
      filename: z.string().describe("The exact name of the file to find"),
    }),
    func: async ({ filename }: { filename: string }) => {
      try {
        const files: string[] = [];
        for await (const entry of Deno.readDir(workspaceDir)) {
          files.push(entry.name);
        }

        const found = files.find((f) => f === filename);

        if (found) {
          const fullPath = join(workspaceDir, found);
          return `File found: ${fullPath}`;
        } else {
          return `File "${filename}" not found in workspace. Available files: ${
            files.join(", ") || "none"
          }`;
        }
      } catch (error) {
        return `Error searching for file: ${(error as Error).message}`;
      }
    },
  });
}

// Tool 2: Find files by content (search inside files)
function createFindFileByContentTool(workspaceDir: string) {
  return new DynamicStructuredTool({
    name: "find_file_by_content",
    description:
      "Search for files that contain specific text/content. Returns a list of files containing the search term.",
    schema: z.object({
      searchTerm: z.string().describe("The text to search for inside files"),
    }),
    func: async ({ searchTerm }: { searchTerm: string }) => {
      try {
        const matchingFiles: Array<{
          file: string;
          path: string;
          snippet: string;
        }> = [];

        for await (const entry of Deno.readDir(workspaceDir)) {
          if (entry.isFile) {
            const filePath = join(workspaceDir, entry.name);
            try {
              const content = await Deno.readTextFile(filePath);
              if (content.includes(searchTerm)) {
                const index = content.indexOf(searchTerm);
                matchingFiles.push({
                  file: entry.name,
                  path: filePath,
                  snippet: content.substring(
                    Math.max(0, index - 50),
                    Math.min(content.length, index + 50)
                  ),
                });
              }
            } catch {
              // Skip files that can't be read as text
              continue;
            }
          }
        }

        if (matchingFiles.length > 0) {
          return `Found ${
            matchingFiles.length
          } file(s) containing "${searchTerm}":\n${matchingFiles
            .map((m) => `- ${m.file}: "...${m.snippet}..."`)
            .join("\n")}`;
        } else {
          return `No files found containing "${searchTerm}"`;
        }
      } catch (error) {
        return `Error searching file contents: ${(error as Error).message}`;
      }
    },
  });
}

// Tool 3: Create or write to a file
function createWriteFileTool(workspaceDir: string) {
  return new DynamicStructuredTool({
    name: "create_write_file",
    description:
      "Create a new file or overwrite an existing file with content. Provide the filename and content. If the filename starts with './' it will be created relative to the workspace root.",
    schema: z.object({
      filename: z
        .string()
        .describe(
          "The name of the file to create or write (can start with ./ for relative path)"
        ),
      content: z.string().describe("The content to write to the file"),
    }),
    func: async ({
      filename,
      content,
    }: {
      filename: string;
      content: string;
    }) => {
      try {
        // Handle relative paths starting with ./
        let filePath: string;
        if (filename.startsWith("./")) {
          // Remove ./ and create relative to workspace root
          const relativePath = filename.slice(2);
          filePath = join(workspaceDir, relativePath);
        } else {
          filePath = join(workspaceDir, filename);
        }

        // Ensure directory exists
        const fileDir = dirname(filePath);
        await ensureDir(fileDir);

        await Deno.writeTextFile(filePath, content);
        return `✅ Successfully wrote to file: ${filePath}\nContent length: ${content.length} characters`;
      } catch (error) {
        return `❌ Error writing to file: ${(error as Error).message}`;
      }
    },
  });
}

// Tool 4: Read file content
function createReadFileTool(workspaceDir: string) {
  return new DynamicStructuredTool({
    name: "read_file",
    description: "Read the complete content of a file by its name.",
    schema: z.object({
      filename: z.string().describe("The name of the file to read"),
    }),
    func: async ({ filename }: { filename: string }) => {
      try {
        const filePath = join(workspaceDir, filename);
        const content = await Deno.readTextFile(filePath);
        return `Content of ${filename}:\n${"=".repeat(
          40
        )}\n${content}\n${"=".repeat(40)}`;
      } catch (error) {
        return `Error reading file: ${(error as Error).message}`;
      }
    },
  });
}

// Tool 5: List all files
function createListFilesTool(workspaceDir: string) {
  return new DynamicStructuredTool({
    name: "list_files",
    description: "List all files in the workspace directory.",
    schema: z.object({}),
    func: async () => {
      try {
        const files: string[] = [];
        for await (const entry of Deno.readDir(workspaceDir)) {
          files.push(entry.name);
        }

        if (files.length === 0) {
          return "Workspace is empty. No files found.";
        }
        return `Files in workspace (${files.length}):\n${files
          .map((f, i) => `${i + 1}. ${f}`)
          .join("\n")}`;
      } catch (error) {
        return `Error listing files: ${(error as Error).message}`;
      }
    },
  });
}

// Create the agent
async function createMyAgent(config: ModelConfig) {
  // Ensure workspace directory exists
  await ensureDir(WORKSPACE_DIR);

  console.log("--Create Model ");
  // Initialize the LLM with LM Studio / OpenAI compatible API
  const model = new ChatOpenAI({
    modelName: config.model.model,
    temperature: config.model.temperature,
    maxTokens: config.model.maxTokens,
    apiKey: config.model.apiKey,
    configuration: {
      baseURL: config.model.baseURL,
    },
    verbose: false,
  });

  console.log("--Create Tool ");
  // Create tools
  const tools = [
    createFindFileByNameTool(WORKSPACE_DIR),
    createFindFileByContentTool(WORKSPACE_DIR),
    createWriteFileTool(WORKSPACE_DIR),
    createReadFileTool(WORKSPACE_DIR),
    createListFilesTool(WORKSPACE_DIR),
  ];

  const s_prompt = `
You are a helpful file management assistant. You have access to tools that can:
1. Find files by exact name
2. Search for files by content
3. Create or write to files (support paths like ./filename.txt)
4. Read file contents
5. List all files

You should use these tools to help users manage their files effectively.
The workspace directory is: ${WORKSPACE_DIR}

When creating files with paths starting with './', create them relative to the workspace root.

Always be precise and informative in your responses.
`;
  // Create the prompt template
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", s_prompt],
    ["placeholder", "{chat_history}"],
    ["human", "{input}"],
    ["placeholder", "{agent_scratchpad}"],
  ]);

  console.log("--Create Agent ");
  const agent = createAgent({
    model: model, // or "anthropic:claude-sonnet-4-5-20250929"
    tools: tools,
    systemPrompt: s_prompt,
    verbose: false,
    maxIterations: 10,
  });
  console.log("--Create End ");

  return agent;
}

// Function to run the agent with detailed logging
async function runAgentWithLogging(input: string, config: ModelConfig) {
  const logger = new DetailedLoggerCallback(config);

  logger.log("---");
  logger.log("# 🚀 STARTING AGENT EXECUTION\n");
  logger.log(`- 📝 User Input: `);
  logger.log_md(input);

  try {
    console.log("====Create Agent ");

    const agent = await createMyAgent(config);
    console.log("====Invoke ");

    // Run the agent with callbacks
    const result = await agent.invoke(
      {
        messages: [{ role: "human", content: input }],
      },
      {
        callbacks: [
          {
            handleLLMStart: (llm: any, prompts: string[]) =>
              logger.handleLLMStart(llm, prompts),
            handleLLMEnd: (output: any) => logger.handleLLMEnd(output),
            handleToolStart: (tool: any, input: any) =>
              logger.handleToolStart(tool, input),
            handleToolEnd: (output: any) => logger.handleToolEnd(output),
            handleAgentAction: (action: any) =>
              logger.handleAgentAction(action),
            handleAgentEnd: (result: any) => logger.handleAgentEnd(result),
          },
        ],
      }
    );

    logger.log("---");
    logger.log("# EXECUTION COMPLETE");
    logger.log(`- ✅ Final Output: `);
    logger.log_md(result.messages[0].text);
    console.log(result.messages[0].response_metadata);

    // Save logs to file
    await logger.saveLogs();
    return result;
  } catch (error) {
    console.error("❌ Error during execution:", error);
    throw error;
  }
}

// Main function
async function main() {
  const args = parse(Deno.args, {
    string: ["prompt", "config"],
    default: {
      prompt: "List all files in the workspace",
      config: "model_config.json",
    },
  });
  // Load configuration
  const config = await loadConfig();
  const logger = new DetailedLoggerCallback(config);

  logger.log("---");
  logger.log("# 🚀 Call ");
  logger.log("- 🤖 File Management Agent for Deno");
  logger.log(`- 📁 Workspace: ${WORKSPACE_DIR}`);
  logger.log(`- Provider: ${config.model.provider}`);
  logger.log(`- Model: ${config.model.model}`);

  // Run the agent with the provided prompt
  await runAgentWithLogging(args.prompt, config);
}

// Run the main function
if (import.meta.main) {
  main().catch(console.error);
}

export { runAgentWithLogging, createAgent, loadConfig };
