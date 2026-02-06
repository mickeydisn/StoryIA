import {
  SectionAsset,
  PageAsset,
  TAssetParam,
  ApiAsset,
} from "../../base/asset_base.ts";
import { marked } from "npm:marked";

// Parameter interface for references viewer
export interface ReferencesParams extends TAssetParam {
  section?: string;
}

import { AssetPageSection } from "../../base/asset_page_section.ts";

// TypeScript implementation of database references generator
interface EntryCounts {
  [key: string]: {
    total: number;
    chapter: number;
    Part: number;
    Mind: number;
    characters: number;
    concepts: number;
    locations: number;
    systems: number;
    other: number;
  };
}

interface FileExistence {
  [key: string]: boolean;
}

/**
 * List all database entry files (CHAR_*.md, CONCEPT_*.md, LOC_*.md, SYSTEM_*.md)
 */
export async function listDatabaseEntries(): Promise<string[]> {
  const entries: string[] = [];
  const cwd = Deno.cwd();
  const parentDir = cwd.replace(/\/deno$/, "").replace(/\\deno$/, "");
  const dbDir = `${parentDir}/database`;

  // Check each database subdirectory
  const subdirs = ["characters", "concepts", "locations", "systems"];

  for (const subdir of subdirs) {
    try {
      const subdirPath = `${dbDir}/${subdir}`;
      for await (const entry of Deno.readDir(subdirPath)) {
        if (entry.isFile && entry.name.endsWith(".md")) {
          entries.push(`${subdirPath}/${entry.name}`);
        }
      }
    } catch (error) {
      console.log(
        `Error scanning ${subdir}:`,
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  return entries.sort();
}

/**
 * List all .md files in the project with optional filtering
 * @param filters - Array of filter patterns like ["/chapiter/*.md", "/database", "/audit"]
 */
export async function listMarkdownFiles(filters?: string[]): Promise<string[]> {
  const files: string[] = [];
  const cwd = Deno.cwd();
  const parentDir = cwd.replace(/\/deno$/, "").replace(/\\deno$/, "");

  // Define all possible root directories to scan
  const roots = [
    `${parentDir}/chapiter`,
    `${parentDir}/database`,
    parentDir, // root level
  ];

  for (const root of roots) {
    try {
      for await (const entry of Deno.readDir(root)) {
        if (entry.isDirectory) {
          await collectMdFiles(`${root}/${entry.name}`, files);
        } else if (entry.name.endsWith(".md")) {
          files.push(`${root}/${entry.name}`);
        }
      }
    } catch (error) {
      // Directory doesn't exist, skip
      console.log(
        `Directory ${root} not found:`,
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  // Apply filters if provided
  if (filters && filters.length > 0) {
    const filteredFiles: string[] = [];
    for (const file of files) {
      const relativePath = file.replace(parentDir, "").replace(/^\//, "");
      let includeFile = false;

      for (const filter of filters) {
        // Normalize filter (remove leading slash if present)
        const normalizedFilter = filter.replace(/^\//, "");

        // Support glob-like patterns
        if (normalizedFilter.endsWith("/*.md")) {
          const dirPattern = normalizedFilter.slice(0, -4); // Remove /*.md
          if (
            relativePath.startsWith(dirPattern) &&
            relativePath.endsWith(".md")
          ) {
            includeFile = true;
            break;
          }
        } else if (normalizedFilter.endsWith("/")) {
          // Directory filter
          const dirPattern = normalizedFilter.slice(0, -1); // Remove trailing /
          if (
            relativePath.startsWith(dirPattern + "/") ||
            relativePath === dirPattern
          ) {
            includeFile = true;
            break;
          }
        } else {
          // Exact match or subdirectory
          if (relativePath.startsWith(normalizedFilter)) {
            includeFile = true;
            break;
          }
        }
      }

      if (includeFile) {
        filteredFiles.push(file);
      }
    }

    return filteredFiles.sort();
  }

  return files.sort();
}

/**
 * Extract all referenced entry IDs from all files
 */
async function extractAllReferencedEntries(): Promise<string[]> {
  const entries = new Set<string>();

  // Find all .md files in the project
  const allMdFiles = await listMarkdownFiles();
  console.log("Found markdown files:", allMdFiles.length);
  console.log("Sample files:", allMdFiles.slice(0, 5));

  // Process each file
  for (const filePath of allMdFiles) {
    try {
      const content = await Deno.readTextFile(filePath);

      // Find all [[...]] patterns (database references)
      const doubleBracketRegex = /\[\[([^\]]+)\]\]/g;
      const matches = [...content.matchAll(doubleBracketRegex)].map(
        (m) => m[1]
      );

      for (const match of matches) {
        // Clean the match and check if it's a database reference
        const cleanMatch = match.trim();
        if (
          cleanMatch.startsWith("CHAR_") ||
          cleanMatch.startsWith("CONCEPT_") ||
          cleanMatch.startsWith("LOC_") ||
          cleanMatch.startsWith("SYSTEM_")
        ) {
          // Normalize - to _ for consistency
          const normalizedMatch = cleanMatch.replace(/-/g, "_");
          entries.add(normalizedMatch);
        }
      }
    } catch (error) {
      // Skip files that can't be read
      console.error(`Error reading file ${filePath}:`, error);
      continue;
    }
  }

  return Array.from(entries).sort();
}

/**
 * Recursively collect .md files from a directory
 */
async function collectMdFiles(dirPath: string, files: string[]): Promise<void> {
  try {
    for await (const entry of Deno.readDir(dirPath)) {
      const fullPath = `${dirPath}/${entry.name}`;
      if (entry.isDirectory) {
        console.log(`Found directory: ${fullPath}`);
        await collectMdFiles(fullPath, files);
      } else if (entry.name.endsWith(".md")) {
        console.log(`Found file: ${fullPath}`);
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.log(
      `Error scanning directory ${dirPath}:`,
      error instanceof Error ? error.message : String(error)
    );
  }
}

/**
 * Scan all project files for references and count occurrences
 */
async function scanReferences(entries: string[]): Promise<EntryCounts> {
  const entryCounts: EntryCounts = {};
  for (const entry of entries) {
    entryCounts[entry] = {
      total: 0,
      chapter: 0,
      Part: 0,
      Mind: 0,
      characters: 0,
      concepts: 0,
      locations: 0,
      systems: 0,
      other: 0,
    };
  }

  // Collect all md files using the utility function
  const allMdFiles = await listMarkdownFiles();

  // Process each file
  for (const filePath of allMdFiles) {
    try {
      const content = await Deno.readTextFile(filePath);

      // Find all [[...]] patterns (database references)
      const doubleBracketRegex = /\[\[([^\]]+)\]\]/g;
      const matches = [...content.matchAll(doubleBracketRegex)].map(
        (m) => m[1]
      );

      // Determine category
      const basename = filePath.split("/").pop() || "";
      let category = "other";
      if (filePath.includes("/chapiter/")) {
        if (basename.includes("Section")) {
          category = "chapter";
        } else if (basename.includes("Part")) {
          category = "Part";
        } else if (basename.includes("Mind")) {
          category = "Mind";
        } else {
          category = "chapiter";
        }
      } else if (filePath.includes("/database/characters/")) {
        category = "characters";
      } else if (filePath.includes("/database/concepts/")) {
        category = "concepts";
      } else if (filePath.includes("/database/locations/")) {
        category = "locations";
      } else if (filePath.includes("/database/systems/")) {
        category = "systems";
      } else if (filePath.includes("/database/")) {
        category = "other"; // for cross_references, timeline, etc.
      }

      // Count references
      for (const match of matches) {
        // Clean the match (remove surrounding * for bold markdown, replace - with _)
        const cleanMatch = match.replace(/\*/g, "").trim().replace(/-/g, "_");

        if (cleanMatch in entryCounts) {
          entryCounts[cleanMatch].total += 1;
          (entryCounts[cleanMatch] as any)[category] += 1;
        }
      }
    } catch {
      // Skip files that can't be read
      continue;
    }
  }

  return entryCounts;
}

/**
 * Check which entries have corresponding files
 */
function checkFileExistence(entries: string[]): FileExistence {
  const fileExists: FileExistence = {};

  for (const entry of entries) {
    let path: string | null = null;

    // Determine expected path (from deno/ directory, need ../ prefix)
    if (entry.startsWith("CHAR_")) {
      path = `../database/characters/${entry}.md`;
    } else if (entry.startsWith("CONCEPT_")) {
      path = `../database/concepts/${entry}.md`;
    } else if (entry.startsWith("LOC_")) {
      path = `../database/locations/${entry}.md`;
    } else if (entry.startsWith("SYSTEM_")) {
      path = `../database/systems/${entry}.md`;
    }

    fileExists[entry] = path ? existsSync(path) : false;
  }

  return fileExists;
}

/**
 * Check if a file exists (synchronous for simplicity)
 */
function existsSync(path: string): boolean {
  try {
    Deno.statSync(path);
    return true;
  } catch {
    return false;
  }
}

/**
 * Generate detailed file reference counts
 */
async function generateFileReferenceCounts(): Promise<string> {
  // Collect all md files using the utility function
  const allMdFiles = await listMarkdownFiles();

  // Count references per file
  const fileCounts: { [filePath: string]: number } = {};

  for (const filePath of allMdFiles) {
    try {
      const content = await Deno.readTextFile(filePath);
      const doubleBracketRegex = /\[\[([^\]]+)\]\]/g;
      const matches = [...content.matchAll(doubleBracketRegex)].map(
        (m) => m[1]
      );
      const dbReferences = matches.filter(
        (match) =>
          match.startsWith("CHAR_") ||
          match.startsWith("CONCEPT_") ||
          match.startsWith("LOC_") ||
          match.startsWith("SYSTEM_")
      );
      fileCounts[filePath] = dbReferences.length;
    } catch {
      fileCounts[filePath] = 0;
    }
  }

  // Create file reference table
  let fileTable = "## Files Scanned for References\n\n";
  fileTable += "| File Path | References Found |\n";
  fileTable += "|-----------|------------------|\n";

  // Sort by reference count descending
  const sortedFiles = Object.entries(fileCounts)
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);

  for (const [filePath, count] of sortedFiles) {
    // Show relative path from project root
    const relativePath = filePath.replace(/^\.\.\//, "");
    fileTable += `| ${relativePath} | ${count} |\n`;
  }

  // Add files with no references
  const filesWithNoRefs = Object.entries(fileCounts).filter(
    ([_, count]) => count === 0
  ).length;

  fileTable += `\n### Summary\n`;
  fileTable += `- Total files scanned: ${allMdFiles.length}\n`;
  fileTable += `- Files with references: ${sortedFiles.length}\n`;
  fileTable += `- Files with no references: ${filesWithNoRefs}\n`;
  fileTable += `- Total references found: ${sortedFiles.reduce(
    (sum, [_, count]) => sum + count,
    0
  )}\n`;

  return fileTable;
}

/**
 * Generate the reference table markdown
 */
async function generateReferenceTable(): Promise<string> {
  const entries = await extractAllReferencedEntries();
  const counts = await scanReferences(entries);
  const fileExists = checkFileExistence(entries);
  const fileCounts = await generateFileReferenceCounts();

  // Separate entries with and without files
  const entriesWithFiles = entries.filter((e) => fileExists[e]);
  const entriesWithoutFiles = entries.filter((e) => !fileExists[e]);

  // Create markdown table
  let table = "# Database References Overview\n\n";

  // Add file reference counts section
  table += fileCounts;
  table += "\n---\n\n";

  // Table for entries with files
  table += "## Entries with Files\n\n";
  table +=
    "| Entry_ID | Total References | Chapter References | Part References | Mind References | Characters DB | Concepts DB | Locations DB | Systems DB | Other DB |\n";
  table +=
    "|----------|------------------|-------------------|----------------|----------------|--------------|-------------|--------------|------------|----------|\n";

  for (const entry of entriesWithFiles.sort()) {
    const count = counts[entry];
    table += `| ${entry} | ${count.total} | ${count.chapter} | ${count.Part} | ${count.Mind} | ${count.characters} | ${count.concepts} | ${count.locations} | ${count.systems} | ${count.other} |\n`;
  }

  // Table for entries without files
  table += "\n## Entries without Files (Orphaned References)\n\n";
  table +=
    "| Entry_ID | Total References | Chapter References | Part References | Mind References | Characters DB | Concepts DB | Locations DB | Systems DB | Other DB |\n";
  table +=
    "|----------|------------------|-------------------|----------------|----------------|--------------|-------------|--------------|------------|----------|\n";

  // Sort by total references descending
  for (const entry of entriesWithoutFiles.sort(
    (a, b) => counts[b].total - counts[a].total
  )) {
    const count = counts[entry];
    table += `| ${entry} | ${count.total} | ${count.chapter} | ${count.Part} | ${count.Mind} | ${count.characters} | ${count.concepts} | ${count.locations} | ${count.systems} | ${count.other} |\n`;
  }

  table += "\n## Summary\n\n";
  table += `- Total unique entries: ${entries.length}\n`;
  table += `- Entries with files: ${entriesWithFiles.length}\n`;
  table += `- Entries without files: ${entriesWithoutFiles.length}\n`;
  table += `- Total references found: ${entries.reduce(
    (sum, entry) => sum + counts[entry].total,
    0
  )}\n`;

  return table;
}

// Shared content generation logic
async function generateReferencesContent(
  params: ReferencesParams
): Promise<string> {
  try {
    // Generate the actual references table using TypeScript implementation
    const tableContent = await generateReferenceTable();

    let content = tableContent;

    // If a specific section is requested, filter the content
    if (params.section) {
      if (params.section === "1") {
        // For section 1, show a summary of entries found
        const entries = await extractAllReferencedEntries();
        content = `# Database References - Core Data\n\n## Found Entries\n\nTotal unique entries: ${
          entries.length
        }\n\n### Sample Entries:\n\n${entries
          .slice(0, 10)
          .map((entry) => `- ${entry}`)
          .join("\n")}\n\n${
          entries.length > 10
            ? `\n... and ${entries.length - 10} more entries`
            : ""
        }`;
      } else if (params.section === "2") {
        // For section 2, show the generated table
        content = tableContent;
      } else if (params.section === "files") {
        // For files section, show only the file scanning information
        content = await generateFileReferenceCounts();
      }
    }

    const htmlContent = marked.parse(content);
    return `<div class="references-content">${htmlContent}</div>`;
  } catch (error) {
    return `
<div class="error-content">
    <p>Could not generate references content</p>
    <p>Error: ${error instanceof Error ? error.message : String(error)}</p>
</div>
    `;
  }
}

// Individual section assets for cleaner separation
export class DatabaseEntriesAsset extends SectionAsset {
  override url = "/references/db-entries";
  title = "📁 Database Entry Files";

  override content = async (): Promise<string> => {
    try {
      const entries = await listDatabaseEntries();
      let content = `# Database Entry Files\n\n`;
      content += `Found ${entries.length} database entry files:\n\n`;

      // Group by type
      const charFiles = entries.filter((f) => f.includes("/characters/"));
      const conceptFiles = entries.filter((f) => f.includes("/concepts/"));
      const locationFiles = entries.filter((f) => f.includes("/locations/"));
      const systemFiles = entries.filter((f) => f.includes("/systems/"));

      content += `## Characters (${charFiles.length})\n`;
      charFiles.forEach((file) => {
        const filename = file.split("/").pop() || "";
        content += `- ${filename}\n`;
      });

      content += `\n## Concepts (${conceptFiles.length})\n`;
      conceptFiles.forEach((file) => {
        const filename = file.split("/").pop() || "";
        content += `- ${filename}\n`;
      });

      content += `\n## Locations (${locationFiles.length})\n`;
      locationFiles.forEach((file) => {
        const filename = file.split("/").pop() || "";
        content += `- ${filename}\n`;
      });

      content += `\n## Systems (${systemFiles.length})\n`;
      systemFiles.forEach((file) => {
        const filename = file.split("/").pop() || "";
        content += `- ${filename}\n`;
      });

      return `<div class="db-entries-content">${marked.parse(content)}</div>`;
    } catch (error) {
      return `<div class="error-content"><p>Error: ${
        error instanceof Error ? error.message : String(error)
      }</p></div>`;
    }
  };
}

export class MarkdownFilesAsset extends SectionAsset {
  override url = "/references/md-files";
  title = "📄 Markdown Files Overview";

  override content = async (): Promise<string> => {
    try {
      const allFiles = await listMarkdownFiles();
      const chapiterFiles = await listMarkdownFiles(["chapiter"]);
      const databaseFiles = await listMarkdownFiles(["database"]);
      const auditFiles = await listMarkdownFiles(["audit"]);

      let content = `# Markdown Files Overview\n\n`;

      content += `## Debug Info\n\n`;
      content += `**All files found:** ${allFiles.length}\n\n`;
      if (allFiles.length > 0) {
        content += `**Sample files:**\n`;
        allFiles.slice(0, 5).forEach((file) => {
          const relativePath = file.replace(/.*\/Story\//, "");
          content += `- ${relativePath}\n`;
        });
        content += `\n`;
      }

      content += `## Summary\n\n`;
      content += `- **Total .md files**: ${allFiles.length}\n`;
      content += `- **Chapiter files**: ${chapiterFiles.length}\n`;
      content += `- **Database files**: ${databaseFiles.length}\n`;
      content += `- **Audit files**: ${auditFiles.length}\n\n`;

      content += `## Directory Breakdown\n\n`;
      content += `| Directory | File Count |\n`;
      content += `|-----------|------------|\n`;
      content += `| Chapiter | ${chapiterFiles.length} |\n`;
      content += `| Database | ${databaseFiles.length} |\n`;
      content += `| Audit | ${auditFiles.length} |\n`;

      const otherFiles =
        allFiles.length -
        chapiterFiles.length -
        databaseFiles.length -
        auditFiles.length;
      content += `| Other | ${otherFiles} |\n`;

      return `<div class="md-files-content">${marked.parse(content)}</div>`;
    } catch (error) {
      return `<div class="error-content"><p>Error: ${
        error instanceof Error ? error.message : String(error)
      }</p></div>`;
    }
  };
}

export class ReferencesOverviewAsset extends SectionAsset {
  override url = "/references/overview";
  title = "📊 References Overview";

  override content = async (): Promise<string> => {
    try {
      const entries = await extractAllReferencedEntries();
      const counts = await scanReferences(entries);
      const fileExists = checkFileExistence(entries);

      const entriesWithFiles = entries.filter((e) => fileExists[e]);
      const entriesWithoutFiles = entries.filter((e) => !fileExists[e]);

      let content = `# Database References Overview\n\n`;

      content += `## Summary\n\n`;
      content += `- **Total unique entries**: ${entries.length}\n`;
      content += `- **Entries with files**: ${entriesWithFiles.length}\n`;
      content += `- **Entries without files**: ${entriesWithoutFiles.length}\n`;
      content += `- **Total references found**: ${entries.reduce(
        (sum, entry) => sum + counts[entry].total,
        0
      )}\n\n`;

      content += `## Top Referenced Entries\n\n`;
      content += `| Entry | Total References | Has File |\n`;
      content += `|-------|------------------|----------|\n`;

      entries
        .sort((a, b) => counts[b].total - counts[a].total)
        .slice(0, 10)
        .forEach((entry) => {
          const hasFile = fileExists[entry] ? "✅" : "❌";
          content += `| ${entry} | ${counts[entry].total} | ${hasFile} |\n`;
        });

      return `<div class="references-overview-content">${marked.parse(
        content
      )}</div>`;
    } catch (error) {
      return `<div class="error-content"><p>Error: ${
        error instanceof Error ? error.message : String(error)
      }</p></div>`;
    }
  };
}

/**
 * Generate file reference counts for chapiter/ directory only (where references are made)
 */
async function generateFocusedFileReferenceCounts(): Promise<string> {
  // Collect md files from chapiter/ only (content files that reference database entries)
  const chapiterFiles = await listMarkdownFiles(["chapiter"]);
  const focusedFiles = chapiterFiles;

  // Count references per file
  const fileCounts: { [filePath: string]: number } = {};

  for (const filePath of focusedFiles) {
    try {
      const content = await Deno.readTextFile(filePath);
      const doubleBracketRegex = /\[\[([^\]]+)\]\]/g;
      const matches = [...content.matchAll(doubleBracketRegex)].map(
        (m) => m[1]
      );
      const dbReferences = matches.filter(
        (match) =>
          match.startsWith("CHAR_") ||
          match.startsWith("CONCEPT_") ||
          match.startsWith("LOC_") ||
          match.startsWith("SYSTEM_")
      );
      fileCounts[filePath] = dbReferences.length;
    } catch {
      fileCounts[filePath] = 0;
    }
  }

  // Create file reference table
  let fileTable = "## Files Scanned for References (Chapiter)\n\n";
  fileTable += "| File Path | References Found |\n";
  fileTable += "|-----------|------------------|\n";

  // Sort by reference count descending
  const sortedFiles = Object.entries(fileCounts)
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);

  for (const [filePath, count] of sortedFiles) {
    // Show relative path from project root
    const relativePath = filePath.replace(/^\.\.\//, "");
    fileTable += `| ${relativePath} | ${count} |\n`;
  }

  // Add files with no references
  const filesWithNoRefs = Object.entries(fileCounts).filter(
    ([_, count]) => count === 0
  ).length;

  fileTable += `\n### Summary\n`;
  fileTable += `- **Chapiter files scanned**: ${chapiterFiles.length}\n`;
  fileTable += `- **Files with references**: ${sortedFiles.length}\n`;
  fileTable += `- **Files with no references**: ${filesWithNoRefs}\n`;
  fileTable += `- **Total references found**: ${sortedFiles.reduce(
    (sum, [_, count]) => sum + count,
    0
  )}\n`;

  return fileTable;
}

export class FileScanAsset extends SectionAsset {
  override url = "/references/file-scan";
  title = "🔍 File Reference Scan";

  override content = async (): Promise<string> => {
    try {
      const fileCounts = await generateFocusedFileReferenceCounts();
      return `<div class="file-scan-content">${marked.parse(fileCounts)}</div>`;
    } catch (error) {
      return `<div class="error-content"><p>Error: ${
        error instanceof Error ? error.message : String(error)
      }</p></div>`;
    }
  };
}

export class DetailedTableAsset extends SectionAsset {
  override url = "/references/detailed-table";
  title = "📋 Detailed Reference Table";

  override content = async (): Promise<string> => {
    try {
      const tableContent = await generateReferenceTable();
      return `<div class="detailed-table-content">${marked.parse(
        tableContent
      )}</div>`;
    } catch (error) {
      return `<div class="error-content"><p>Error: ${
        error instanceof Error ? error.message : String(error)
      }</p></div>`;
    }
  };
}

// Legacy asset for backward compatibility (now just redirects to overview)
export class ReferencesAsset extends SectionAsset<ReferencesParams> {
  override url = "/references";

  title = "📊 Database References Generator";

  override content = async (): Promise<string> => {
    return await generateReferencesContent({});
  };

  protected override async handleRequest(ctx: any): Promise<void> {
    // Check for section parameter in query params and redirect to appropriate asset
    let section = undefined;
    if (ctx.request.url) {
      const url = new URL(ctx.request.url);
      section = url.searchParams.get("section") || undefined;
    }

    // Populate params
    this.params = { section } as ReferencesParams;

    // Call parent handleRequest
    await super.handleRequest(ctx);
  }
}

export const referencesAsset = new ReferencesAsset();
export const databaseEntriesAsset = new DatabaseEntriesAsset();
export const markdownFilesAsset = new MarkdownFilesAsset();
export const referencesOverviewAsset = new ReferencesOverviewAsset();
export const fileScanAsset = new FileScanAsset();
export const detailedTableAsset = new DetailedTableAsset();

// Page version with sections - returns full HTML page with multiple sections
export class ReferencesPageAsset extends AssetPageSection {
  override url = "/page/references";

  title = "📊 Database References Generator";

  sections() {
    return [
      {
        id: "db-entries",
        title: "📁 Database Entries",
        asset: databaseEntriesAsset,
        open: true,
        autoload: true,
      },
      {
        id: "md-files",
        title: "📄 Markdown Files",
        asset: markdownFilesAsset,
        open: true,
        autoload: true,
      },
      {
        id: "overview",
        title: "📊 References Overview",
        asset: referencesOverviewAsset,
        open: true,
        autoload: true,
      },
      {
        id: "file-scan",
        title: "🔍 File Reference Scan",
        asset: fileScanAsset,
        open: true,
        autoload: true,
      },
      {
        id: "detailed-table",
        title: "📋 Detailed Table",
        asset: detailedTableAsset,
        open: true,
        autoload: true,
      },
    ];
  }
}

export const referencesPageAsset = new ReferencesPageAsset();
