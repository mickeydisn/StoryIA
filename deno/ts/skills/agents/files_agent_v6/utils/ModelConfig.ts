import { join, dirname } from "jsr:@std/path";

// Load model configuration
export interface ModelConfig {
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

export async function loadConfig(currentDir: string): Promise<ModelConfig> {
  const configPath = join(currentDir, "model_config.json");
  const configText = await Deno.readTextFile(configPath);
  const config = JSON.parse(configText);

  // Replace environment variables in config
  if (config.model.apiKey.startsWith("${")) {
    const envVar = config.model.apiKey.slice(2, -1);
    config.model.apiKey = Deno.env.get(envVar) || config.model.apiKey;
  }
  config.workspace.baseDir = currentDir;
  return config;
}
