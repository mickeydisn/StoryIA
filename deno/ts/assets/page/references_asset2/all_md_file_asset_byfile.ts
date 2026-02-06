import { SectionAsset } from "../../base/asset_base.ts";
import { listMarkdownFiles, extractEntryInMd } from "./filesUtils.ts";
import { markdownToHtml, objectArrayToMdTable } from "./markdownUtils.ts";

export class AllMdFileAssetByFile extends SectionAsset {
  override url = "/references/all-md-files-byfile";
  title = "📊 All Markdown Files (Table View)";

  override content = async (): Promise<string> => {
    console.log('url: /references/all-md-files-byfile')
    try {
      // Get server root dynamically (parent directory of deno/)
      const serverRoot = Deno.cwd().replace(/\/deno$/, '').replace(/\\deno$/, '');

      // Define the regex patterns to search for markdown files
      const patterns = [
        "^database/systems/[A-Z_]*\.md", 
        // "^chapiter/.*/Part.*\.md",              // All chapiter files
        // "^chapiter/.*/MindMap.*\.md",
        // "^chapiter/.*/Chap.*\.md",
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

      let content = `# All Markdown Files (Table View)\n\n`;
      content += `Found ${uniqueFiles.length} markdown files in the project.\n\n`;

      // Prepare table data: one row per file with entry counts
      const tableDataPromises = uniqueFiles
        .sort()
        .map(async (file) => {
          // Make path relative to server root
          const relativePath = file.replace(serverRoot, '').replace(/^\//, '');

          // Count entries referenced in this file
          let entryCount = 0;
          try {
            const entries = await extractEntryInMd(file);
            entryCount = entries.length;
            console.log(`File ${file}: found ${entryCount} entries:`, entries);
          } catch (error) {
            console.error(`Error extracting entries from ${file}:`, error);
          }

          return {
            file_path: relativePath,
            entry_count: entryCount
          };
        });

      const tableData = await Promise.all(tableDataPromises);

      // Define table columns
      const columns = [
        { key: 'file_path', header: 'File Path' },
        { key: 'entry_count', header: 'Entry Count' }
      ];

      // Create the table
      const tableMarkdown = objectArrayToMdTable(tableData, columns);
      content += tableMarkdown;

      // Calculate directory statistics from file paths
      const directoryStats: { [key: string]: number } = {};
      tableData.forEach(row => {
        const dir = row.file_path.split('/').slice(0, -1).join('/') || 'root';
        directoryStats[dir] = (directoryStats[dir] || 0) + 1;
      });

      const totalDirectories = Object.keys(directoryStats).length;
      const avgFilesPerDir = totalDirectories > 0 ? (uniqueFiles.length / totalDirectories).toFixed(1) : '0';
      const totalEntriesReferenced = tableData.reduce((sum, row) => sum + row.entry_count, 0);

      content += `\n## Summary Statistics\n\n`;
      content += `- **Total directories**: ${totalDirectories}\n`;
      content += `- **Total files**: ${uniqueFiles.length}\n`;
      content += `- **Total entries referenced**: ${totalEntriesReferenced}\n`;
      content += `- **Average files per directory**: ${avgFilesPerDir}\n`;

      // Find directory with most files
      const maxDir = Object.entries(directoryStats).reduce((max, [dir, count]) =>
        count > max.files ? { dir, files: count } : max,
        { dir: '', files: 0 }
      );

      if (maxDir.dir) {
        content += `- **Largest directory**: ${maxDir.dir} (${maxDir.files} files)\n`;
      }

      // Find file with most entries
      const maxEntries = tableData.reduce((max, row) =>
        row.entry_count > max.entries ? { file: row.file_path, entries: row.entry_count } : max,
        { file: '', entries: 0 }
      );

      if (maxEntries.file) {
        content += `- **File with most entries**: ${maxEntries.file} (${maxEntries.entries} entries)\n`;
      }

      return `<div class="all-md-files-byfile-content markdown-content">${await markdownToHtml(content)}</div>`;
    } catch (error) {
      return `<div class="error-content"><p>Error: ${error instanceof Error ? error.message : String(error)}</p></div>`;
    }
  };
}

export const allMdFileAssetByFile = new AllMdFileAssetByFile();
