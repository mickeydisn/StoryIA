// Types for directory tree nodes
export interface FileNode {
  type: "file";
  path: string;
}

export interface DirectoryNode {
  type: "directory";
  path: string;
  children: TreeData;
}

export type TreeNode = FileNode | DirectoryNode;
export type TreeData = Record<string, TreeNode>;

// Options for building the directory tree
export interface BuildTreeOptions {
  /** Filter patterns for files (glob patterns like "*.md", "page/*.ts") */
  filters?: string[];
  /** Maximum depth to traverse (undefined = unlimited) */
  maxDepth?: number;
}

// Options for generating HTML tree
export interface GenerateHtmlOptions {
  /** Maximum number of files to display (undefined = unlimited) */
  maxFiles?: number;
  /** Custom click handler for files - returns HTML attributes or onclick content */
  fileClickHandler?: (node: FileNode, name: string) => string;
  /** Custom click handler for directories - returns HTML attributes or onclick content */
  directoryClickHandler?: (node: DirectoryNode, name: string) => string;
  /** Custom file icon (default: none, just text) */
  fileIcon?: string;
  /** Custom directory icon (default: 📁) */
  directoryIcon?: string;
  /** CSS class for the tree container */
  treeClass?: string;
  /** CSS class for file items */
  fileClass?: string;
  /** CSS class for directory items */
  directoryClass?: string;
}

/**
 * Convert glob pattern to regex
 * Supports: * (any chars), ? (single char), ** (recursive)
 */
function globToRegex(pattern: string): RegExp {
  let regex = pattern
    .replace(/\*\*/g, "{{GLOBSTAR}}")
    .replace(/\*/g, "[^/]*")
    .replace(/\?/g, ".")
    .replace(/\{\{GLOBSTAR\}\}/g, ".*");
  return new RegExp(`^${regex}$`);
}

/**
 * Check if a file path matches any of the glob patterns
 */
function matchesFilters(filePath: string, filters: string[]): boolean {
  return filters.some((pattern) => globToRegex(pattern).test(filePath));
}

/**
 * Default file filter - includes only .md files
 */
export function defaultFileFilter(name: string): boolean {
  return name.endsWith(".md");
}

/**
 * Default file click handler - generates a link with hx-get attributes
 */
export function defaultFileClickHandler(node: FileNode, name: string): string {
  const encodedPath = encodeURIComponent(node.path);
  return `href="/page/file/${encodedPath}" hx-get="/page/file/${encodedPath}" hx-target="#page-content"`;
}

/**
 * Default directory click handler - toggles expansion
 */
export function defaultDirectoryClickHandler(
  _node: DirectoryNode,
  _name: string,
): string {
  return `onclick="this.parentElement.classList.toggle('expanded')"`;
}

/**
 * Build a directory tree structure from one or more base paths
 * @param basePaths - Single path or array of paths to build tree from
 * @param options - Configuration options for building the tree
 * @returns Promise<TreeData> - The tree structure with each directory as root
 *
 * Example:
 *   buildDirectoryTree(["../database", "../ai_context"], { filters: ["*.md"] })
 */
export async function buildDirectoryTree(
  basePaths: string | string[],
  options: BuildTreeOptions = {},
): Promise<TreeData> {
  const { filters, maxDepth } = options;
  const paths = Array.isArray(basePaths) ? basePaths : [basePaths];

  // Create filter function from glob patterns
  const fileFilter = (name: string, relativePath: string): boolean => {
    if (!filters || filters.length === 0) {
      return defaultFileFilter(name);
    }
    return matchesFilters(relativePath, filters) ||
      matchesFilters(name, filters);
  };

  async function buildTreeRecursive(
    currentPath: string,
    relativePath: string,
    currentDepth: number,
  ): Promise<TreeData> {
    const tree: TreeData = {};

    // Check depth limit
    if (maxDepth !== undefined && currentDepth > maxDepth) {
      return tree;
    }

    try {
      // Collect entries first to sort them
      const entries: Deno.DirEntry[] = [];
      for await (const entry of Deno.readDir(currentPath)) {
        entries.push(entry);
      }

      // Sort: directories first, then files; both alphabetically
      entries.sort((a, b) => {
        if (a.isDirectory === b.isDirectory) {
          return a.name.localeCompare(b.name);
        }
        return a.isDirectory ? -1 : 1;
      });

      for (const entry of entries) {
        const fullPath = `${currentPath}/${entry.name}`;
        const cleanPath = fullPath.replace("../", "");
        const entryRelPath = relativePath
          ? `${relativePath}/${entry.name}`
          : entry.name;

        if (entry.isFile && fileFilter(entry.name, entryRelPath)) {
          tree[entry.name] = { type: "file", path: cleanPath };
        } else if (entry.isDirectory) {
          const subTree = await buildTreeRecursive(
            fullPath,
            entryRelPath,
            currentDepth + 1,
          );
          if (Object.keys(subTree).length > 0) {
            tree[entry.name] = {
              type: "directory",
              children: subTree,
              path: cleanPath,
            };
          }
        }
      }
    } catch (error) {
      console.warn(
        `Could not build tree for ${currentPath}:`,
        error instanceof Error ? error.message : String(error),
      );
    }

    return tree;
  }

  // Build trees for all paths and merge them
  const mergedTree: TreeData = {};

  for (const basePath of paths) {
    // Get the directory name to use as root key
    const dirName = basePath.replace(/^.*\//, "").replace(/^\.\.\//, "");
    const tree = await buildTreeRecursive(basePath, "", 0);
    if (Object.keys(tree).length > 0) {
      mergedTree[dirName] = {
        type: "directory",
        path: basePath.replace("../", ""),
        children: tree,
      };
    }
  }

  return mergedTree;
}

/**
 * Generate HTML from a tree structure
 * @param treeData - The tree data structure
 * @param options - Configuration options for HTML generation
 * @returns string - The generated HTML
 */
export function generateTreeHtml(
  treeData: TreeData,
  options: GenerateHtmlOptions = {},
): string {
  const {
    maxFiles,
    fileClickHandler = defaultFileClickHandler,
    directoryClickHandler = defaultDirectoryClickHandler,
    fileIcon = "",
    directoryIcon = "📁",
    treeClass = "file-tree",
    fileClass = "tree-file",
    directoryClass = "tree-directory",
  } = options;

  let fileCount = 0;

  function generateNodeHtml(
    node: TreeNode | TreeData,
    name: string,
    depth: number = 0,
  ): string {
    if (maxFiles && fileCount >= maxFiles) return "";

    const indent = "  ".repeat(depth);

    // Check if this is a directory node
    if (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      node.type === "directory"
    ) {
      const dirNode = node as DirectoryNode;
      const clickAttr = directoryClickHandler(dirNode, name);

      const childrenHtml = Object.entries(dirNode.children)
        .map(([childName, childNode]) =>
          generateNodeHtml(childNode, childName, depth + 1)
        )
        .join("");

      return `
${indent}<div class="tree-item ${directoryClass}">
${indent}  <div class="tree-toggle" ${clickAttr}>${directoryIcon} ${name}/</div>
${indent}  <div class="tree-children">
${childrenHtml}
${indent}  </div>
${indent}</div>`;
    } // Check if this is a file node
    else if (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      node.type === "file"
    ) {
      fileCount++;
      if (maxFiles && fileCount > maxFiles) return "";

      const fileNode = node as FileNode;
      const clickAttr = fileClickHandler(fileNode, name);
      const iconHtml = fileIcon ? `${fileIcon} ` : "";

      return `
${indent}<div class="tree-item ${fileClass}">
${indent}  <a ${clickAttr} class="file-link">${iconHtml}${name}</a>
${indent}</div>`;
    }

    return "";
  }

  const html = Object.entries(treeData)
    .map(([rootName, rootNode]) => generateNodeHtml(rootNode, rootName))
    .join("");

  return `<div class="directory-tree ${treeClass}">${html}\n</div>`;
}

/**
 * Utility function to build a directory tree and immediately generate HTML
 * @param basePaths - Single path or array of paths
 * @param buildOptions - Options for building the tree
 * @param htmlOptions - Options for generating HTML
 * @returns Promise<string> - The generated HTML
 */
export async function buildAndGenerateTreeHtml(
  basePaths: string | string[],
  buildOptions: BuildTreeOptions = {},
  htmlOptions: GenerateHtmlOptions = {},
): Promise<string> {
  const treeData = await buildDirectoryTree(basePaths, buildOptions);
  return generateTreeHtml(treeData, htmlOptions);
}
