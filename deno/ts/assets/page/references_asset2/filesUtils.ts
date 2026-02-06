/**
 * File utilities for handling markdown files and database entries
 */

/**
 * List all database entry files (CHAR_*.md, CONCEPT_*.md, LOC_*.md, SYSTEM_*.md)
 */
export async function listDatabaseEntries(): Promise<string[]> {
  const entries: string[] = [];
  const cwd = Deno.cwd();
  const parentDir = cwd.replace(/\/deno$/, '').replace(/\\deno$/, '');
  const dbDir = `${parentDir}/database`;

  // Check each database subdirectory
  const subdirs = ['characters', 'concepts', 'locations', 'systems'];

  for (const subdir of subdirs) {
    try {
      const subdirPath = `${dbDir}/${subdir}`;
      for await (const entry of Deno.readDir(subdirPath)) {
        if (entry.isFile && entry.name.endsWith('.md')) {
          entries.push(`${subdirPath}/${entry.name}`);
        }
      }
    } catch (error) {
      console.log(`Error scanning ${subdir}:`, error instanceof Error ? error.message : String(error));
    }
  }

  return entries.sort();
}

/**
 * List all .md files in the project with optional filtering
 * @param filters - Array of regex filter patterns like ["^chapiter/.*", "^database/.*"]
 */
export async function listMarkdownFiles(filters?: string[]): Promise<string[]> {
  const files: string[] = [];
  const cwd = Deno.cwd();
  const parentDir = cwd.replace(/\/deno$/, '').replace(/\\deno$/, '');

  // Define all possible root directories to scan
  // Avoid scanning parent directory if we're scanning specific subdirectories to prevent duplicates
  const roots = [
    `${parentDir}/chapiter`,
    `${parentDir}/database`
  ];

  // Only scan root level for files not in the above directories
  const excludedDirs = ['chapiter', 'database'];

  for (const root of roots) {
    try {
      for await (const entry of Deno.readDir(root)) {
        if (entry.isDirectory) {
          await collectMdFiles(`${root}/${entry.name}`, files);
        } else if (entry.name.endsWith('.md')) {
          files.push(`${root}/${entry.name}`);
        }
      }
    } catch (error) {
      // Directory doesn't exist, skip
      console.log(`Directory ${root} not found:`, error instanceof Error ? error.message : String(error));
    }
  }

  // Scan root level but exclude already scanned directories
  try {
    for await (const entry of Deno.readDir(parentDir)) {
      if (entry.isDirectory) {
        if (!excludedDirs.includes(entry.name)) {
          await collectMdFiles(`${parentDir}/${entry.name}`, files);
        }
      } else if (entry.name.endsWith('.md')) {
        files.push(`${parentDir}/${entry.name}`);
      }
    }
  } catch (error) {
    console.log(`Directory ${parentDir} not found:`, error instanceof Error ? error.message : String(error));
  }

  // Apply filters if provided
  if (filters && filters.length > 0) {
    const filteredFiles: string[] = [];
    for (const file of files) {
      const relativePath = file.replace(parentDir, '').replace(/^\//, '');
      let includeFile = false;

      for (const filter of filters) {
        // Treat filter as regex pattern directly
        try {
          const regex = new RegExp(filter);
          if (regex.test(relativePath)) {
            includeFile = true;
            break;
          }
        } catch (error) {
          // If regex is invalid, skip this filter
          console.warn(`Invalid regex pattern: ${filter}`, error);
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
 * Extract all referenced entry IDs from a specific file
 * @param filePath - Path to the markdown file to analyze
 * @returns Array of entry IDs found in the file
 */
export async function extractEntryInMd(filePath: string): Promise<string[]> {
  const entries = new Set<string>();

  try {
    const content = await Deno.readTextFile(filePath);

    // Find all [...] patterns (database references)
    const doubleBracketRegex = /\[([^\]^\[]+)\]/g;
    const matches = [...content.matchAll(doubleBracketRegex)].map(m => m[1]);

    console.log(`File ${filePath}: found ${matches.length} bracket matches:`, matches);

    for (const match of matches) {
      // Clean the match and check if it's a database reference
      const cleanMatch = match.trim();
      if (cleanMatch.startsWith('CHAR') || cleanMatch.startsWith('CONCEPT') ||
          cleanMatch.startsWith('LOC') || cleanMatch.startsWith('SYSTEM')) {
        // Normalize - to _ for consistency
        const normalizedMatch = cleanMatch.replace(/-/g, '_');
        entries.add(normalizedMatch);
      }
    }

    console.log(`File ${filePath}: extracted ${entries.size} entries:`, Array.from(entries));
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
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
        // console.log(`Found directory: ${fullPath}`);
        await collectMdFiles(fullPath, files);
      } else if (entry.name.endsWith('.md')) {
        // console.log(`Found file: ${fullPath}`);
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.log(`Error scanning directory ${dirPath}:`, error instanceof Error ? error.message : String(error));
  }
}

/**
 * Check if a file exists (synchronous for simplicity)
 */
export function existsSync(path: string): boolean {
  try {
    Deno.statSync(path);
    return true;
  } catch {
    return false;
  }
}
