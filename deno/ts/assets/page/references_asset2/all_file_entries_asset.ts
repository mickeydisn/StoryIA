import { SectionAsset } from "../../base/asset_base.ts";
import { listMarkdownFiles, extractEntryInMd } from "./filesUtils.ts";
import { markdownToHtml, objectArrayToMdTable } from "./markdownUtils.ts";

export class AllFileEntriesAsset extends SectionAsset {
  override url = "/references/all-file-entries";
  title = "📊 All File Entries Analysis";

  override content = async (): Promise<string> => {
    try {
      // Get server root dynamically (parent directory of deno/)
      const serverRoot = Deno.cwd().replace(/\/deno$/, '').replace(/\\deno$/, '');

      // Define the regex patterns to search for markdown files (same as AllMdFile)
      const patterns = [
        "^database/.*/.*\.md",              // All database files
        "^chapiter/.*/Part.*\.md",              // All chapiter files
        "^chapiter/.*/MindMap.*\.md",
        "^chapiter/.*/Chap.*\.md",
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

      // Extract all entries and count occurrences
      const entryCounts: { [entryId: string]: number } = {};

      for (const filePath of uniqueFiles) {
        try {
          const entries = await extractEntryInMd(filePath);
          for (const entry of entries) {
            entryCounts[entry] = (entryCounts[entry] || 0) + 1;
          }
        } catch (error) {
          console.error(`Error processing file ${filePath}:`, error);
        }
      }

      // Convert to array format for table generation
      const tableData = Object.entries(entryCounts)
        .map(([entryId, count]) => ({
          entry_id: entryId,
          occurrences: count
        }))
        .sort((a, b) => b.occurrences - a.occurrences); // Sort by occurrences descending

      // Generate markdown table
      const columns = [
        { key: 'entry_id', header: 'Entry ID' },
        { key: 'occurrences', header: 'Occurrences' }
      ];

      let content = `# All File Entries Analysis\n\n`;
      content += `Analyzed ${uniqueFiles.length} markdown files and found ${Object.keys(entryCounts).length} unique database entries referenced.\n\n`;

      // Create the table
      const tableMarkdown = objectArrayToMdTable(tableData, columns);
      content += tableMarkdown;

      // Add summary statistics
      const totalReferences = Object.values(entryCounts).reduce((sum, count) => sum + count, 0);
      const avgOccurrences = totalReferences / Object.keys(entryCounts).length;

      content += `\n## Summary Statistics\n\n`;
      content += `- **Total files analyzed**: ${uniqueFiles.length}\n`;
      content += `- **Unique entries found**: ${Object.keys(entryCounts).length}\n`;
      content += `- **Total references**: ${totalReferences}\n`;
      content += `- **Average occurrences per entry**: ${avgOccurrences.toFixed(2)}\n`;
      content += `- **Most referenced entry**: ${tableData[0]?.entry_id || 'N/A'} (${tableData[0]?.occurrences || 0} times)\n`;

      return `<div class="all-file-entries-content markdown-content">${await markdownToHtml(content)}</div>`;
    } catch (error) {
      return `<div class="error-content"><p>Error: ${error instanceof Error ? error.message : String(error)}</p></div>`;
    }
  };
}

export const allFileEntriesAsset = new AllFileEntriesAsset();
