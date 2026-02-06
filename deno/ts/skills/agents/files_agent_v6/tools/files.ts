// import { createDeepAgent } from "npm:deepagents";
import { z } from "npm:zod";
import { DynamicStructuredTool } from "npm:@langchain/core/tools";
import { join, dirname } from "jsr:@std/path";
import { ensureDir } from "jsr:@std/fs";

// Tool 1: Find file by exact name
export function createFindFileByNameTool(workspaceDir: string) {
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
export function createFindFileByContentTool(workspaceDir: string) {
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
export function createWriteFileTool(workspaceDir: string) {
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
export function createReadFileTool(workspaceDir: string) {
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
export function createListFilesTool(workspaceDir: string) {
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
