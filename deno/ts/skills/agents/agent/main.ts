#!/usr/bin/env deno run --allow-net --allow-read --allow-write --allow-env

import { FileSystemAgent } from "./FileSystemAgent.ts";
import config from "./config.json" with { type: "json" };

/**
 * Main entry point for the FileSystem Agent CLI
 * Usage: deno run --allow-net --allow-read --allow-write --allow-env main.ts --prompt "Your prompt here"
 */

async function main() {
  // Parse command line arguments
  const args = Deno.args;
  const promptIndex = args.indexOf("--prompt");

  if (promptIndex === -1 || !args[promptIndex + 1]) {
    console.error('Usage: deno run main.ts --prompt "Your prompt here"');
    console.error(
      "Example: deno run main.ts --prompt \"Create a file called test.txt with content 'Hello World'\""
    );
    console.error("\n💡 Available commands:");
    console.error("  --prompt \"Create a file called ./hello.txt and write 'Hello Mickey'\"");
    console.error("  --prompt \"Find all files matching pattern '*hello*'\"");
    console.error("  --prompt \"Search for files containing 'mickey'\"");
    Deno.exit(1);
  }

  const prompt = args[promptIndex + 1];
  const agentInfo = {
    name: config.agent.name,
    description: config.agent.description,
    version: config.agent.version,
  };

  console.log(`🤖 ${agentInfo.name} v${agentInfo.version}`);
  console.log(`📋 ${agentInfo.description}`);
  console.log(`💬 Prompt: "${prompt}"`);
  console.log("🚀 Initializing agent...\n");

  try {
    // Create agent instance with configuration
    const agent = new FileSystemAgent({
      baseURL: config.model.baseURL,
      modelName: config.model.modelName,
      temperature: config.model.temperature,
      verbose: config.execution.verbose,
    });

    // Execute the agent with the user's prompt
    console.log("🧠 Agent is processing your request...\n");

    const result = await agent.execute(prompt);

    console.log("\n" + "=".repeat(60));
    console.log("📋 AGENT RESPONSE:");
    console.log("=".repeat(60));
    console.log(result);
    console.log("=".repeat(60));

  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ Error executing agent:", error.message);
      
      if (error.message.includes("LM Studio")) {
        console.error("\n💡 Troubleshooting:");
        console.error("  1. Start LM Studio application");
        console.error("  2. Load a local model");
        console.error("  3. Enable Local Server in Settings");
        console.error("  4. Ensure server is running on http://localhost:1234");
      }
    } else {
      console.error("❌ Error executing agent: Unknown error occurred");
    }

    Deno.exit(1);
  }
}

// Run the main function
if (import.meta.main) {
  main();
}
