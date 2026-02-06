import { SectionAsset } from "../../base/asset_base.ts";
import { listDatabaseEntries } from "./filesUtils.ts";
import { markdownToHtml } from "./markdownUtils.ts";

/**
 * Generate a database entries overview in markdown
 * @param entries - Array of database entry file paths
 * @returns Markdown content string
 */
function generateDatabaseEntriesOverview(entries: string[]): string {
  let content = `# Database Entry Files\n\n`;
  content += `Found ${entries.length} database entry files:\n\n`;

  // Group by type
  const charFiles = entries.filter(f => f.includes('/characters/'));
  const conceptFiles = entries.filter(f => f.includes('/concepts/'));
  const locationFiles = entries.filter(f => f.includes('/locations/'));
  const systemFiles = entries.filter(f => f.includes('/systems/'));

  content += `## Characters (${charFiles.length})\n`;
  charFiles.forEach(file => {
    const filename = file.split('/').pop() || '';
    content += `- ${filename}\n`;
  });

  content += `\n## Concepts (${conceptFiles.length})\n`;
  conceptFiles.forEach(file => {
    const filename = file.split('/').pop() || '';
    content += `- ${filename}\n`;
  });

  content += `\n## Locations (${locationFiles.length})\n`;
  locationFiles.forEach(file => {
    const filename = file.split('/').pop() || '';
    content += `- ${filename}\n`;
  });

  content += `\n## Systems (${systemFiles.length})\n`;
  systemFiles.forEach(file => {
    const filename = file.split('/').pop() || '';
    content += `- ${filename}\n`;
  });

  return content;
}

export class AllDbEntriesAsset extends SectionAsset {
  override url = "/references/all-db-entries";
  title = "📁 All Database Entries";

  override content = async (): Promise<string> => {
    try {
      const entries = await listDatabaseEntries();
      const content = generateDatabaseEntriesOverview(entries);
      return `<div class="all-db-entries-content markdown-content">${await markdownToHtml(content)}</div>`;
    } catch (error) {
      return `<div class="error-content"><p>Error: ${error instanceof Error ? error.message : String(error)}</p></div>`;
    }
  };
}

export const allDbEntriesAsset = new AllDbEntriesAsset();
