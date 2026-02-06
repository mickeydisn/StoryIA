import { SectionAsset } from "../../base/asset_base.ts";
import { listMarkdownFiles, extractEntryInMd, listDatabaseEntries } from "./filesUtils.ts";
import { markdownToHtml, objectArrayToMdTable } from "./markdownUtils.ts";

interface EntryData {
  entry_id: string;
  total: number;
  database_files: number;
  chapiter_part_files: number;
  chapiter_mind_files: number;
  chapiter_chap_files: number;
  category: string;
}

export class UnionEntriesAsset extends SectionAsset {
  override url = "/references/union-entries";
  title = "🔗 Union Entries Analysis";

  override content = async (): Promise<string> => {
    try {
      // Get server root dynamically
      const serverRoot = Deno.cwd().replace(/\/deno$/, '').replace(/\\deno$/, '');

      // Get all database entries (files that exist)
      const dbEntryFiles = await listDatabaseEntries();
      const dbEntries = new Set<string>();

      // Extract entry IDs from database file paths
      for (const filePath of dbEntryFiles) {
        const fileName = filePath.split('/').pop() || '';
        const entryId = fileName.replace('.md', '').replace(/-/g, '_');
        dbEntries.add(entryId);
      }

      // Define regex patterns for file groups
      const fileGroupPatterns = {
        database_files: "^database/.*/[A-Z_]*\.md",
        chapiter_part_files: "^chapiter/.*/Part.*\.md",
        chapiter_mind_files: "^chapiter/.*/MindMap.*\.md",
        chapiter_chap_files: "^chapiter/.*/Chap.*\.md"
      };

      // Get all markdown files for each group
      const fileGroups: { [key: string]: string[] } = {};
      for (const [groupName, pattern] of Object.entries(fileGroupPatterns)) {
        try {
          fileGroups[groupName] = await listMarkdownFiles([pattern]);
        } catch (error) {
          console.log(`Error loading ${groupName}:`, error);
          fileGroups[groupName] = [];
        }
      }

      // Get all referenced entries from files
      const allReferencedEntries = new Set<string>();
      const entryReferenceCounts: { [entryId: string]: { [groupName: string]: number } } = {};

      // Process each file group to count references
      for (const [groupName, files] of Object.entries(fileGroups)) {
        for (const filePath of files) {
          try {
            const entries = await extractEntryInMd(filePath);
            for (const entry of entries) {
              allReferencedEntries.add(entry);

              if (!entryReferenceCounts[entry]) {
                entryReferenceCounts[entry] = {
                  database_files: 0,
                  chapiter_part_files: 0,
                  chapiter_mind_files: 0,
                  chapiter_chap_files: 0
                };
              }

              entryReferenceCounts[entry][groupName]++;
            }
          } catch (error) {
            console.error(`Error processing file ${filePath}:`, error);
          }
        }
      }

      // Create union of all entries (referenced + database entries)
      const allEntries = new Set([...allReferencedEntries, ...dbEntries]);

      // Categorize entries
      const categorizeEntry = (entryId: string): string => {
        if (entryId.startsWith('CHAR_')) return 'characters';
        if (entryId.startsWith('CONCEPT_')) return 'concepts';
        if (entryId.startsWith('LOC_')) return 'locations';
        if (entryId.startsWith('SYSTEM_')) return 'systems';
        return 'other';
      };

      // Prepare data for tables with 2x2 categorization
      const categories = {
        inDbInChapiter: [] as EntryData[],
        inDbNotInChapiter: [] as EntryData[],
        notInDbInChapiter: [] as EntryData[],
        notInDbNotInChapiter: [] as EntryData[]
      };

      for (const entryId of Array.from(allEntries).sort()) {
        const isInDb = dbEntries.has(entryId);
        const counts = entryReferenceCounts[entryId] || {
          database_files: 0,
          chapiter_part_files: 0,
          chapiter_mind_files: 0,
          chapiter_chap_files: 0
        };

        const total = counts.database_files + counts.chapiter_part_files + counts.chapiter_mind_files + counts.chapiter_chap_files;
        const isInChapiter = counts.chapiter_part_files > 0 || counts.chapiter_mind_files > 0 || counts.chapiter_chap_files > 0;

        const entryData: EntryData = {
          entry_id: entryId,
          total: total,
          database_files: counts.database_files,
          chapiter_part_files: counts.chapiter_part_files,
          chapiter_mind_files: counts.chapiter_mind_files,
          chapiter_chap_files: counts.chapiter_chap_files,
          category: categorizeEntry(entryId)
        };

        // Categorize into 2x2 matrix
        if (isInDb && isInChapiter) {
          categories.inDbInChapiter.push(entryData);
        } else if (isInDb && !isInChapiter) {
          categories.inDbNotInChapiter.push(entryData);
        } else if (!isInDb && isInChapiter) {
          categories.notInDbInChapiter.push(entryData);
        } else {
          categories.notInDbNotInChapiter.push(entryData);
        }
      }

      // Group each category by database type and sort within each type
      const groupAndSort = (entries: EntryData[]): { [category: string]: EntryData[] } => {
        const grouped: { [category: string]: EntryData[] } = {
          characters: [],
          concepts: [],
          locations: [],
          systems: []
        };

        for (const entry of entries) {
          if (grouped[entry.category]) {
            grouped[entry.category].push(entry);
          }
        }

        // Sort each category by total references descending
        for (const category in grouped) {
          grouped[category].sort((a, b) => b.total - a.total);
        }

        return grouped;
      };

      const groupedCategories = {
        inDbInChapiter: groupAndSort(categories.inDbInChapiter),
        inDbNotInChapiter: groupAndSort(categories.inDbNotInChapiter),
        notInDbInChapiter: groupAndSort(categories.notInDbInChapiter),
        notInDbNotInChapiter: groupAndSort(categories.notInDbNotInChapiter)
      };

      // Generate markdown content
      let content = `# Union Entries Analysis\n\n`;
      content += `Analysis of database entries and their references across all files.\n\n`;
      content += `**Database entries found**: ${dbEntries.size}\n\n`;
      content += `**Referenced entries found**: ${allReferencedEntries.size}\n\n`;
      content += `**Total unique entries**: ${allEntries.size}\n\n`;

      // Table columns
      const columns = [
        { key: 'entry_id', header: 'Entry ID' },
        { key: 'total', header: 'Total' },
        { key: 'database_files', header: 'Database Files' },
        { key: 'chapiter_part_files', header: 'Part Files' },
        { key: 'chapiter_mind_files', header: 'MindMap Files' },
        { key: 'chapiter_chap_files', header: 'Chap Files' }
      ];

      // Generate tables grouped by database name with 2x2 categorization
      const generateGroupedTables = (): string => {
        let result = '';

        const dbCategories = ['characters', 'concepts', 'locations', 'systems'];
        const categoryPrefixes = { characters: 'CHAR', concepts: 'CONCEPT', locations: 'LOC', systems: 'SYSTEM' };

        for (const dbCategory of dbCategories) {
          const inDbInChapiter = groupedCategories.inDbInChapiter[dbCategory] || [];
          const inDbNotInChapiter = groupedCategories.inDbNotInChapiter[dbCategory] || [];
          const notInDbInChapiter = groupedCategories.notInDbInChapiter[dbCategory] || [];
          const notInDbNotInChapiter = groupedCategories.notInDbNotInChapiter[dbCategory] || [];

          const totalEntries = inDbInChapiter.length + inDbNotInChapiter.length + notInDbInChapiter.length + notInDbNotInChapiter.length;

          if (totalEntries > 0) {
            const categoryTitle = dbCategory.charAt(0).toUpperCase() + dbCategory.slice(1);
            const prefix = categoryPrefixes[dbCategory as keyof typeof categoryPrefixes];

            result += `<details>\n`;
            result += `<summary><strong>${prefix} - ${categoryTitle} (${totalEntries} entries)</strong></summary>\n\n`;

            // In Database AND In Chapiter Files
            if (inDbInChapiter.length > 0) {
              result += `### ✅ In Database & 📄 In Chapiter (${inDbInChapiter.length} entries)\n\n`;
              const tableData = inDbInChapiter.map(entry => ({
                entry_id: entry.entry_id,
                total: entry.total,
                database_files: entry.database_files,
                chapiter_part_files: entry.chapiter_part_files,
                chapiter_mind_files: entry.chapiter_mind_files,
                chapiter_chap_files: entry.chapiter_chap_files
              }));
              result += objectArrayToMdTable(tableData, columns);
              result += '\n\n';
            }

            // In Database AND Not In Chapiter Files
            if (inDbNotInChapiter.length > 0) {
              result += `### ✅ In Database & 🚫 Not In Chapiter (${inDbNotInChapiter.length} entries)\n\n`;
              const tableData = inDbNotInChapiter.map(entry => ({
                entry_id: entry.entry_id,
                total: entry.total,
                database_files: entry.database_files,
                chapiter_part_files: entry.chapiter_part_files,
                chapiter_mind_files: entry.chapiter_mind_files,
                chapiter_chap_files: entry.chapiter_chap_files
              }));
              result += objectArrayToMdTable(tableData, columns);
              result += '\n\n';
            }

            // Not In Database AND In Chapiter Files
            if (notInDbInChapiter.length > 0) {
              result += `### ❌ Not In Database & 📄 In Chapiter (${notInDbInChapiter.length} entries)\n\n`;
              const tableData = notInDbInChapiter.map(entry => ({
                entry_id: entry.entry_id,
                total: entry.total,
                database_files: entry.database_files,
                chapiter_part_files: entry.chapiter_part_files,
                chapiter_mind_files: entry.chapiter_mind_files,
                chapiter_chap_files: entry.chapiter_chap_files
              }));
              result += objectArrayToMdTable(tableData, columns);
              result += '\n\n';
            }

            // Not In Database AND Not In Chapiter Files
            if (notInDbNotInChapiter.length > 0) {
              result += `### ❌ Not In Database & 🚫 Not In Chapiter (${notInDbNotInChapiter.length} entries)\n\n`;
              const tableData = notInDbNotInChapiter.map(entry => ({
                entry_id: entry.entry_id,
                total: entry.total,
                database_files: entry.database_files,
                chapiter_part_files: entry.chapiter_part_files,
                chapiter_mind_files: entry.chapiter_mind_files,
                chapiter_chap_files: entry.chapiter_chap_files
              }));
              result += objectArrayToMdTable(tableData, columns);
              result += '\n\n';
            }

            result += `</details>\n\n`;
          }
        }

        return result;
      };

      content += generateGroupedTables();

      // Special section for entries only referenced in database files
      const totalDbOnly = categories.notInDbNotInChapiter.length;
      if (totalDbOnly > 0) {
        content += `## 🤯 Database File References Only\n\n`;
        content += `Entries referenced only within database files themselves (no dedicated database entry, not used in chapters).\n\n`;

        const dbOnlyGrouped = groupAndSort(categories.notInDbNotInChapiter);

        for (const dbCategory of ['characters', 'concepts', 'locations', 'systems']) {
          const entries = dbOnlyGrouped[dbCategory] || [];
          if (entries.length > 0) {
            const categoryTitle = dbCategory.charAt(0).toUpperCase() + dbCategory.slice(1);
            const prefix = { characters: 'CHAR', concepts: 'CONCEPT', locations: 'LOC', systems: 'SYSTEM' }[dbCategory];

            content += `<details>\n`;
            content += `<summary><strong>${prefix} - ${categoryTitle} (${entries.length} entries)</strong></summary>\n\n`;

            const tableData = entries.map(entry => ({
              entry_id: entry.entry_id,
              total: entry.total,
              database_files: entry.database_files,
              chapiter_part_files: entry.chapiter_part_files,
              chapiter_mind_files: entry.chapiter_mind_files,
              chapiter_chap_files: entry.chapiter_chap_files
            }));
            content += objectArrayToMdTable(tableData, columns);
            content += '\n\n</details>\n\n';
          }
        }
      }

      // Summary statistics
      content += `## Summary Statistics\n\n`;
      const totalInDb = categories.inDbInChapiter.length + categories.inDbNotInChapiter.length;
      const totalNotInDb = categories.notInDbInChapiter.length + categories.notInDbNotInChapiter.length;
      const totalInChapiter = categories.inDbInChapiter.length + categories.notInDbInChapiter.length;
      const totalNotInChapiter = categories.inDbNotInChapiter.length + categories.notInDbNotInChapiter.length;

      content += `- **✅ In Database**: ${totalInDb} entries\n`;
      content += `- **❌ Not in Database**: ${totalNotInDb} entries\n`;
      content += `- **📄 In Chapiter Files**: ${totalInChapiter} entries\n`;
      content += `- **🚫 Not in Chapiter Files**: ${totalNotInChapiter} entries\n`;
      content += `- **🤯 Database File References Only**: ${totalDbOnly} entries\n`;
      content += `- **Total unique entries**: ${allEntries.size}\n`;

      const totalReferences = Object.values(categories).flat().reduce((sum, e) => sum + e.total, 0);
      content += `- **Total references counted**: ${totalReferences}\n`;

      return `<div class="union-entries-content markdown-content">${await markdownToHtml(content)}</div>`;
    } catch (error) {
      return `<div class="error-content"><p>Error: ${error instanceof Error ? error.message : String(error)}</p></div>`;
    }
  };
}

export const unionEntriesAsset = new UnionEntriesAsset();
