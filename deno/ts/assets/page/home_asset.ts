import { PageAsset } from "../base/asset_base.ts";
import { buildDirectoryTree } from "../../etc/buildDirectoryTree.ts";

// Helper function to generate HTML tree structure
function generateTreeHtml(treeData: any, maxFiles?: number | null): string {
  let fileCount = 0;

  function generateNodeHtml(node: any, name: string, depth: number = 0): string {
    if (maxFiles && fileCount >= maxFiles) return '';

    const indent = '  '.repeat(depth);

    // Check if this is a directory node (has type property)
    if (node.type === 'directory') {
      const childrenHtml = Object.entries(node.children)
        .map(([childName, childNode]: [string, any]) => generateNodeHtml(childNode, childName, depth + 1))
        .join('');

      return `
${indent}<div class="tree-item tree-directory">
  <div class="tree-toggle" onclick="this.parentElement.classList.toggle('expanded')">📁 ${name}/</div>
  <div class="tree-children">
    ${childrenHtml}
  </div>
</div>`;
    }
    // Check if this is a file node (has type property)
    else if (node.type === 'file') {
      fileCount++;
      if (maxFiles && fileCount > maxFiles) return '';

      const encodedPath = encodeURIComponent(node.path);
      return `
${indent}<div class="tree-item tree-file">
  <a href="/file/${encodedPath}" hx-get="/file/${encodedPath}" hx-target="#page-content" class="file-link">
    ${name}
  </a>
</div>`;
    }
    // This is a root directory object (no type property) - treat as directory
    else if (typeof node === 'object' && node !== null) {
      const childrenHtml = Object.entries(node)
        .map(([childName, childNode]: [string, any]) => generateNodeHtml(childNode, childName, depth + 1))
        .join('');

      return `
${indent}<div class="tree-item tree-directory">
  <div class="tree-toggle" onclick="this.parentElement.classList.toggle('expanded')">📁 ${name}/</div>
  <div class="tree-children">
    ${childrenHtml}
  </div>
</div>`;
    }

    // Fallback for unexpected node types
    return '';
  }

  const html = Object.entries(treeData)
    .map(([rootName, rootNode]: [string, any]) => generateNodeHtml(rootNode, rootName))
    .join('');

  return html;
}

// Helper function to generate full tree HTML for main page
async function generateFullTreeHtml(): Promise<string> {
  const treeData: any = {};

  // Build tree structure for database
  try {
    treeData.database = await buildDirectoryTree("../database");
  } catch (error) {
    console.warn("Could not load database directory:", error instanceof Error ? error.message : String(error));
    treeData.database = {};
  }

  // Build tree structure for database_build
  try {
    treeData.database_build = await buildDirectoryTree("../database_build");
  } catch (error) {
    console.warn("Could not load database_build directory:", error instanceof Error ? error.message : String(error));
    treeData.database_build = {};
  }

  // Build tree structure for chapiter
  try {
    treeData.chapiter = await buildDirectoryTree("../chapiter");
  } catch (error) {
    console.warn("Could not load chapiter directory:", error instanceof Error ? error.message : String(error));
    treeData.chapiter = {};
  }

  return generateTreeHtml(treeData); // No limit for full page
}

export class HomeAsset extends PageAsset {
  url = "/page/home";
  title = "🏠 Schema Report Dashboard";
  override content = `
<div class="welcome-section">
    <h2>Welcome to the Schema Report Interface</h2>
    <p>Use the menu on the right to explore your project's database, chapters, and validation reports.</p>

    <div class="quick-stats">
        <div class="stat-card">
            <h3>📁 Database</h3>
            <p>16 Characters, 24 Concepts, 15 Locations, 18 Systems</p>
        </div>
        <div class="stat-card">
            <h3>📖 Chapters</h3>
            <p>7 Chapters with detailed content and mind maps</p>
        </div>
        <div class="stat-card">
            <h3>✅ Validation</h3>
            <p>Automated schema validation and reporting</p>
        </div>
    </div>
</div>
  `;
}

export const homeAsset = new HomeAsset();
