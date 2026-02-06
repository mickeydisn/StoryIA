import { z } from "npm:zod@3.23.8";
import { tool } from "npm:@langchain/core@0.2.13/tools";
import path from "npm:path";

/**
 * Tool for creating files with specified content
 */
export const createFileTool = () =>
  tool(
    async (input: { path: string; content: string }): Promise<string> => {
      try {
        await Deno.writeTextFile(input.path, input.content);
        return `Successfully created file at ${input.path}`;
      } catch (error) {
        return `Failed to create file: ${
          error instanceof Error ? error.message : "Unknown error"
        }`;
      }
    },
    {
      name: "create_file",
      description:
        "Create a new file with the specified content at the given path",
      schema: z.object({
        path: z
          .string()
          .describe("The file path where the file should be created"),
        content: z.string().describe("The content to write to the file"),
      }),
    }
  );

/**
 * Tool for searching files by name pattern
 */
export const searchFilesTool = () =>
  tool(
    async (input: { directory: string; pattern: string }): Promise<string> => {
      try {
        const files: string[] = [];
        const pattern = input.pattern
          .replace(/[.+^${}()|[\]\\]/g, "\\$&")
          .replace(/\*/g, ".*")
          .replace(/\?/g, ".");
        const regex = new RegExp(`^${pattern}$`);

        for await (const entry of Deno.readDir(input.directory)) {
          if (entry.isFile && regex.test(entry.name)) {
            files.push(entry.name);
          }
        }

        return files.length === 0
          ? `No files found matching "${input.pattern}"`
          : `Found: ${files.join(", ")}`;
      } catch (error) {
        return `Failed to search files: ${
          error instanceof Error ? error.message : "Unknown error"
        }`;
      }
    },
    {
      name: "search_files",
      description:
        "Search for files matching a pattern in the specified directory",
      schema: z.object({
        directory: z.string().describe("The directory to search in"),
        pattern: z.string().describe("Pattern (e.g., *.txt)"),
      }),
    }
  );

/**
 * Tool for searching within files using regex patterns
 */
export const searchInFilesTool = () =>
  tool(
    async (input: {
      directory: string;
      filePattern: string;
      searchPattern: string;
    }): Promise<string> => {
      try {
        const results: Array<{ file: string; matches: string[] }> = [];
        const filePattern = input.filePattern
          .replace(/[.+^${}()|[\]\\]/g, "\\$&")
          .replace(/\*/g, ".*")
          .replace(/\?/g, ".");
        const fileRegex = new RegExp(`^${filePattern}$`);
        const searchRegex = new RegExp(input.searchPattern, "g");

        for await (const entry of Deno.readDir(input.directory)) {
          if (entry.isFile && fileRegex.test(entry.name)) {
            const filePath = path.join(input.directory, entry.name);
            const content = await Deno.readTextFile(filePath);
            const matches = content.match(searchRegex);

            if (matches) {
              results.push({ file: entry.name, matches });
            }
          }
        }

        return results.length === 0
          ? `No matches found for "${input.searchPattern}"`
          : results
              .map((r) => `${r.file}: ${r.matches.length} matches`)
              .join("\n");
      } catch (error) {
        return `Failed search: ${
          error instanceof Error ? error.message : "Unknown error"
        }`;
      }
    },
    {
      name: "search_in_files",
      description: "Search for content within files using a regex pattern",
      schema: z.object({
        directory: z.string(),
        filePattern: z.string(),
        searchPattern: z.string(),
      }),
    }
  );
