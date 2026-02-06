// Helper function to generate HTML tree structure
export function generateTreeHtml(treeData: any, maxFiles?: number | null): string {
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
  <a href="/page/file/${encodedPath}" hx-get="/page/file/${encodedPath}" hx-target="#page-content" class="file-link">
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
