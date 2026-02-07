---
name: "How to Use the Directory Tree Component"
summary: "Complete guide for building and rendering directory trees with filtering, custom click handlers, and HTML generation"
params:
  - paths: "Single path or array of directory paths to scan"
  - filters: "Optional glob patterns for file filtering (e.g., '*.md', '**/*.ts')"
  - options: "Configuration options for tree building and HTML generation"
---

# How to Use the Directory Tree Component

## Overview

```
The Directory Tree Component provides a complete solution for scanning directories,
filtering files using glob patterns, and generating interactive HTML tree views.
It supports multiple directories, custom click handlers, and flexible filtering.
```

The component offers:

- **Multi-directory support** - Scan one or multiple directories in a single
  call
- **Glob pattern filtering** - Filter files using patterns like `*.md`,
  `**/*.ts`
- **Custom click handlers** - Define custom behavior for file and directory
  clicks
- **Sorted output** - Directories first, then files, both alphabetically sorted
- **HTML generation** - Generate interactive tree HTML with customizable CSS
  classes

## Prerequisites

- [ ] Deno runtime environment
- [ ] TypeScript knowledge
- [ ] Understanding of glob patterns (wildcards)

## Step 1: Import the Component

### Description

Import the necessary functions and types from the directory tree module.

### Implementation

```typescript
import {
  buildAndGenerateTreeHtml,
  buildDirectoryTree,
  DirectoryNode,
  FileNode,
  generateTreeHtml,
  TreeData,
} from "./ts/etc/directoryTree.ts";
```

### Available Exports

| Export                     | Type      | Description                           |
| -------------------------- | --------- | ------------------------------------- |
| `buildDirectoryTree`       | Function  | Build tree structure from directories |
| `generateTreeHtml`         | Function  | Generate HTML from tree data          |
| `buildAndGenerateTreeHtml` | Function  | Build and generate in one step        |
| `FileNode`                 | Interface | Type for file nodes                   |
| `DirectoryNode`            | Interface | Type for directory nodes              |
| `TreeData`                 | Type      | Tree structure record type            |

## Step 2: Build a Directory Tree

### Description

Use `buildDirectoryTree()` to scan directories and build a tree structure. It
accepts a single path or an array of paths.

### Basic Usage (Single Directory)

```typescript
const treeData = await buildDirectoryTree("../database");
```

### Multiple Directories

```typescript
const treeData = await buildDirectoryTree([
  "../database",
  "../ai_context",
  "../chapiter",
]);
```

### With File Filtering

```typescript
const treeData = await buildDirectoryTree(
  ["../database", "../ai_context"],
  { filters: ["*.md"] }, // Only include .md files
);
```

### Options Reference

```typescript
interface BuildTreeOptions {
  filters?: string[]; // Glob patterns for file filtering
  maxDepth?: number; // Maximum depth to traverse
}
```

## Step 3: Generate HTML from Tree Data

### Description

Convert the tree structure to interactive HTML with customizable click handlers
and styling.

### Basic HTML Generation

```typescript
const html = generateTreeHtml(treeData);
```

### With Custom Options

```typescript
const html = generateTreeHtml(treeData, {
  maxFiles: 50, // Limit displayed files
  fileIcon: "📄", // Custom file icon
  directoryIcon: "🗂️", // Custom directory icon
  treeClass: "my-file-tree", // Container CSS class
  fileClass: "my-file", // File item CSS class
  directoryClass: "my-directory", // Directory CSS class
});
```

### Options Reference

```typescript
interface GenerateHtmlOptions {
  maxFiles?: number;
  fileClickHandler?: (node: FileNode, name: string) => string;
  directoryClickHandler?: (node: DirectoryNode, name: string) => string;
  fileIcon?: string;
  directoryIcon?: string;
  treeClass?: string;
  fileClass?: string;
  directoryClass?: string;
}
```

## Step 4: Implement Custom Click Handlers

### Description

Define custom behavior when users click on files or directories.

### File Click Handler

```typescript
function customFileClickHandler(node: FileNode, name: string): string {
  const encodedPath = encodeURIComponent(node.path);
  // Return HTML attributes for the link
  return `href="/view/${encodedPath}" 
          hx-get="/view/${encodedPath}" 
          hx-target="#content"`;
}

const html = generateTreeHtml(treeData, {
  fileClickHandler: customFileClickHandler,
});
```

### Directory Click Handler

```typescript
function customDirectoryClickHandler(
  node: DirectoryNode,
  name: string,
): string {
  // Return onclick attribute or other HTML attributes
  return `onclick="toggleDirectory('${node.path}')"`;
}

const html = generateTreeHtml(treeData, {
  directoryClickHandler: customDirectoryClickHandler,
});
```

## Step 5: Complete Example with Menu Integration

### Description

Full implementation example for a file menu sidebar with custom HTMX navigation.

### Implementation

```typescript
import { MenuCardAsset } from "../base/asset_base.ts";
import {
  buildDirectoryTree,
  DirectoryNode,
  FileNode,
  generateTreeHtml,
} from "../../etc/directoryTree.ts";

// Custom file click handler for HTMX navigation
function menuFileClickHandler(node: FileNode, _name: string): string {
  const encodedPath = encodeURIComponent(node.path);
  return `href="/page/file/${encodedPath}" 
          hx-get="/page/file/${encodedPath}" 
          hx-target="#page-content"`;
}

// Custom directory click handler for toggle
function menuDirectoryClickHandler(
  _node: DirectoryNode,
  _name: string,
): string {
  return `onclick="this.parentElement.classList.toggle('expanded')"`;
}

// Generate tree HTML for menu sidebar
async function generateTreeHtmlForMenu(): Promise<string> {
  // Build tree from multiple directories with .md filter
  const treeData = await buildDirectoryTree(
    ["../database", "../ai_context"],
    { filters: ["*.md"] },
  );

  // Generate HTML with custom handlers
  return generateTreeHtml(treeData, {
    fileClickHandler: menuFileClickHandler,
    directoryClickHandler: menuDirectoryClickHandler,
    treeClass: "file-tree-sidebar",
    fileClass: "tree-file",
    directoryClass: "tree-directory",
  });
}

// Menu card asset
export class FilesMenuAsset extends MenuCardAsset {
  url = "/menu/files";
  title = "📄 Files";
  override content = async (): Promise<string> => {
    return await generateTreeHtmlForMenu();
  };
}

export const filesMenuAsset = new FilesMenuAsset();
```

## Step 6: One-Step Build and Generate

### Description

Use `buildAndGenerateTreeHtml()` for a quick one-step process.

### Implementation

```typescript
const html = await buildAndGenerateTreeHtml(
  ["../database", "../ai_context"],
  { filters: ["*.md"] }, // Build options
  { maxFiles: 100 }, // HTML options
);
```

## Step 7: Glob Pattern Filtering

### Description

The component supports glob patterns for flexible file filtering.

### Pattern Examples

| Pattern      | Description                      |
| ------------ | -------------------------------- |
| `*.md`       | All markdown files in root       |
| `**/*.ts`    | All TypeScript files recursively |
| `page/*.tsx` | TSX files in `page` directory    |
| `*test*`     | Files containing "test" in name  |
| `doc?.md`    | Files like `doc1.md`, `docA.md`  |

### Multiple Filters

```typescript
const treeData = await buildDirectoryTree(
  "../src",
  { filters: ["*.ts", "*.tsx", "*.js"] }, // Include all script files
);
```

### Path-Based Filtering

```typescript
// Filter by relative path
const treeData = await buildDirectoryTree(
  "../database",
  { filters: ["skills/**/*.md", "rules/*.md"] },
);
```

## Examples and Use Cases

### Basic Example - Simple File Tree

```typescript
// Scan single directory, default .md filter
const tree = await buildDirectoryTree("../docs");
const html = generateTreeHtml(tree);
```

### Advanced Example - Multi-Directory with Custom Handlers

```typescript
// Custom handlers for a documentation browser
const treeData = await buildDirectoryTree(
  ["../docs", "../tutorials", "../api"],
  { filters: ["*.md", "*.mdx"] },
);

const html = generateTreeHtml(treeData, {
  fileClickHandler: (node, name) => {
    return `hx-get="/api/content?path=${encodeURIComponent(node.path)}" 
            hx-target="#doc-content"
            class="doc-link"`;
  },
  directoryClickHandler: () => {
    return `onclick="this.closest('.dir').classList.toggle('open')"`;
  },
  fileIcon: "📝",
  directoryIcon: "📂",
  treeClass: "doc-browser",
});
```

## Testing and Validation

### Manual Testing

1. Verify tree structure is built correctly:
   ```typescript
   const tree = await buildDirectoryTree("../test-dir");
   console.log(JSON.stringify(tree, null, 2));
   ```

2. Check HTML output:
   ```typescript
   const html = generateTreeHtml(tree);
   console.log(html);
   ```

3. Test filtering:
   ```typescript
   const filtered = await buildDirectoryTree(
     "../src",
     { filters: ["*.ts"] },
   );
   ```

### Common Issues

| Issue             | Solution                                                       |
| ----------------- | -------------------------------------------------------------- |
| Empty tree        | Check path exists and filter patterns match files              |
| Wrong file order  | Directories are sorted first, then files - both alphabetically |
| Paths not working | Use relative paths from script location                        |

## Advanced Topics

### Tree Data Structure

```typescript
// TreeData structure example
{
  "database": {
    "type": "directory",
    "path": "database",
    "children": {
      "characters": {
        "type": "directory",
        "path": "database/characters",
        "children": {
          "hero.md": {
            "type": "file",
            "path": "database/characters/hero.md"
          }
        }
      }
    }
  }
}
```

### Performance Considerations

- Use `maxDepth` to limit traversal depth for large directories
- Use `maxFiles` in HTML generation to limit rendered output
- Filter early with `filters` option to reduce tree size

### Integration Patterns

The component is designed to work with:

- **HTMX** - Default click handlers use HTMX attributes
- **Static HTML** - Generate static trees without JavaScript
- **Custom frameworks** - Define your own click handlers

## References

- [Deno File System API](https://deno.land/api)
- [Glob Pattern Reference](https://en.wikipedia.org/wiki/Glob_(programming))
- Source: `deno/ts/etc/directoryTree.ts`
