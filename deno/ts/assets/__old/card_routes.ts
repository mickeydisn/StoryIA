import { Router } from "oak";
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

// Helper function to generate tree HTML for menu sidebar (compact)
async function generateTreeHtmlForMenu(): Promise<string> {
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

  return generateTreeHtml(treeData, null); // No limit for sidebar - show all directories
}

export function setupCardRoutes(router: Router) {
  // Menu cards endpoint
  router.get("/menu/cards", async (ctx) => {
    ctx.response.type = "text/html";
    ctx.response.body = `
<!-- Navigation Menu Card -->
<div class="menu-card-box" hx-get="/menu/navigation" hx-trigger="load" hx-target="this">
    <div class="loading">Loading navigation...</div>
</div>

<!-- File Tree Menu Card -->
<div class="menu-card-box" hx-get="/menu/files" hx-trigger="load" hx-target="this">
    <div class="loading">Loading files...</div>
</div>
    `;
  });

  // Individual menu card content
  router.get("/menu/navigation", async (ctx) => {
    ctx.response.type = "text/html";
    ctx.response.body = `
<div class="menu-card-header">
    <h3>🧭 Navigation</h3>
</div>
<div class="menu-card-content">
    <nav class="sidebar-nav">
        <button class="nav-button" hx-get="/page/home" hx-target="#page-content">🏠 Home</button>
    </nav>
</div>
    `;
  });

  router.get("/menu/files", async (ctx) => {
    const treeHtml = await generateTreeHtmlForMenu();
    ctx.response.type = "text/html";
    ctx.response.body = `
<div class="menu-card-header">
    <h3>📄 Files</h3>
</div>
<div class="menu-card-content">
    <div class="file-tree-sidebar">
        ${treeHtml}
    </div>
</div>
    `;
  });
}
