import { SectionAsset } from "../../base/asset_base.ts";
import { listMarkdownFiles } from "./filesUtils.ts";
import { markdownToHtml } from "./markdownUtils.ts";

export class AllMdFile extends SectionAsset {
  override url = "/references/all-md-files";
  title = "📄 All Markdown Files";

  override content = async (): Promise<string> => {
    try {
      // Get server root dynamically (parent directory of deno/)
      const serverRoot = Deno.cwd().replace(/\/deno$/, '').replace(/\\deno$/, '');

      // Define the regex patterns to search for markdown files
      // If filter is empty, display all files
      const patterns = [
        "^database/.*/.*\.md",              // All database files
        "^chapiter/.*/Part.*\.md",              // All chapiter files
      ];

      let allFiles: string[] = [];

      // Collect files from all patterns
      for (const pattern of patterns) {
        try {
          const files = await listMarkdownFiles([pattern]);
          allFiles.push(...files);
        } catch (error) {
          // Skip patterns that don't match any files
          console.log(`Pattern ${pattern} not found:`, error);
        }
      }

      // If no files found with patterns, fall back to all markdown files
      if (allFiles.length === 0) {
        allFiles = await listMarkdownFiles();
      }

      // Remove duplicates
      const uniqueFiles = [...new Set(allFiles)];

      let content = `# All Markdown Files\n\n`;
      content += `Found ${uniqueFiles.length} markdown files in the project.\n\n`;

      // Group files by directory
      const fileGroups: { [key: string]: string[] } = {};

      for (const file of uniqueFiles) {
        // Make path relative to server root
        const relativePath = file.replace(serverRoot, '').replace(/^\//, '');
        const dir = relativePath.split('/').slice(0, -1).join('/') || 'root';

        if (!fileGroups[dir]) {
          fileGroups[dir] = [];
        }
        fileGroups[dir].push(relativePath);
      }

      // Create sections for each directory
      const sortedDirs = Object.keys(fileGroups).sort();

      for (const dir of sortedDirs) {
        const files = fileGroups[dir];
        content += `## ${dir} (${files.length} files)\n\n`;

        // Show first 10 files per directory
        const displayFiles = files.slice(0, 10);
        displayFiles.forEach(file => {
          content += `- ${file}\n`;
        });

        if (files.length > 10) {
          content += `- ... and ${files.length - 10} more files\n`;
        }

        content += '\n';
      }

      return `<div class="all-md-files-content markdown-content">${await markdownToHtml(content)}</div>`;
    } catch (error) {
      return `<div class="error-content"><p>Error: ${error instanceof Error ? error.message : String(error)}</p></div>`;
    }
  };
}

export const allMdFile = new AllMdFile();
