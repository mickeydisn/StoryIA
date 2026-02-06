export class AgentLogger {
  private verbose: boolean;

  constructor(verbose = true) {
    this.verbose = verbose;
  }

  start(prompt: string) {
    if (!this.verbose) return;
    console.log("\n" + "=".repeat(60));
    console.log("🤖 **Agent Starting**");
    console.log(`📝 Task: ${prompt}`);
    console.log("=".repeat(60));
  }

  toolCall(toolName: string, input: any) {
    if (!this.verbose) return;
    console.log(`\n🔧 **Using Tool**: \`${toolName}\``);
    console.log(`   Input: ${JSON.stringify(input)}`);
  }

  toolResult(result: string) {
    if (!this.verbose) return;
    const preview =
      result.length > 100 ? result.substring(0, 100) + "..." : result;
    console.log(`   ✓ Result: ${preview}`);
  }

  complete(output: string) {
    if (!this.verbose) return;
    console.log("\n" + "=".repeat(60));
    console.log("✅ **Task Complete**");
    console.log(output);
    console.log("=".repeat(60) + "\n");
  }

  error(error: string) {
    console.error(`\n❌ **Error**: ${error}\n`);
  }
}
