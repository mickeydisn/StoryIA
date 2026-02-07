import { SectionAsset } from "../../base/asset_base.ts";
import {
  buildDirectoryTree,
  DirectoryNode,
  FileNode,
  TreeData,
  TreeNode,
} from "../../../etc/directoryTree.ts";

// Store selected files
const selectedFiles = new Set<string>();

// Custom file click handler with checkbox for multi-select
function multiSelectFileClickHandler(node: FileNode, name: string): string {
  const encodedPath = encodeURIComponent(node.path);
  return `href="#" 
          onclick="window.toggleFileSelection('${encodedPath}', '${name}'); return false;"
          class="file-link multi-select-file"
          data-path="${encodedPath}"`;
}

// Generate checkbox HTML for files
function generateFileCheckbox(node: FileNode, name: string): string {
  const encodedPath = encodeURIComponent(node.path);
  const isSelected = selectedFiles.has(node.path);
  return `<input type="checkbox" class="file-checkbox" data-path="${encodedPath}" ${isSelected ? 'checked' : ''} onclick="window.toggleFileSelection('${encodedPath}', '${name}'); event.stopPropagation();">`;
}

// Custom directory click handler with select all functionality
function multiSelectDirectoryClickHandler(
  _node: DirectoryNode,
  _name: string,
): string {
  return `onclick="this.parentElement.classList.toggle('expanded')"`;
}

// Generate select all/unselect all buttons for directories
function generateDirectoryControls(node: DirectoryNode, name: string): string {
  const encodedPath = encodeURIComponent(node.path);
  return `<span class="dir-controls">
    <button class="dir-btn select-all" onclick="window.selectAllInDir('${encodedPath}'); event.stopPropagation();" title="Select All">☑</button>
    <button class="dir-btn unselect-all" onclick="window.unselectAllInDir('${encodedPath}'); event.stopPropagation();" title="Unselect All">☐</button>
  </span>`;
}

// Custom HTML generator for multi-select tree
function generateMultiSelectTreeHtml(
  treeData: TreeData,
  options: {
    treeClass?: string;
    fileClass?: string;
    directoryClass?: string;
  } = {},
): string {
  const {
    treeClass = "file-tree",
    fileClass = "tree-file",
    directoryClass = "tree-directory",
  } = options;

  function generateNodeHtml(
    node: TreeNode | TreeData,
    name: string,
    depth: number = 0,
  ): string {
    const indent = "  ".repeat(depth);

    // Check if this is a directory node
    if (
      typeof node === "object" &&
      node !== null &&
      "type" in node &&
      node.type === "directory"
    ) {
      const dirNode = node as DirectoryNode;
      const clickAttr = multiSelectDirectoryClickHandler(dirNode, name);
      const controlsHtml = generateDirectoryControls(dirNode, name);

      const childrenHtml = Object.entries(dirNode.children)
        .map(([childName, childNode]) =>
          generateNodeHtml(childNode, childName, depth + 1)
        )
        .join("");

      return `
${indent}<div class="tree-item ${directoryClass}">
${indent}  <div class="tree-toggle" ${clickAttr}>${controlsHtml} 📁 ${name}/</div>
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
      const fileNode = node as FileNode;
      const clickAttr = multiSelectFileClickHandler(fileNode, name);
      const checkboxHtml = generateFileCheckbox(fileNode, name);
      const isSelected = selectedFiles.has(fileNode.path);
      const selectedClass = isSelected ? ' selected' : '';

      return `
${indent}<div class="tree-item ${fileClass}${selectedClass}">
${indent}  <a ${clickAttr} class="file-link">${checkboxHtml} 📄 ${name}</a>
${indent}</div>`;
    }

    return "";
  }

  const html = Object.entries(treeData)
    .map(([rootName, rootNode]) => generateNodeHtml(rootNode, rootName))
    .join("");

  return `<div class="directory-tree ${treeClass}">${html}\n</div>`;
}

// Generate tree HTML for multi-select workspace directory
async function generateWorkspaceMultiSelectTreeHtml(): Promise<string> {
  // Build tree from database/entry with **/*.md filter
  const treeData = await buildDirectoryTree(
    "../database/entry",
    { filters: ["**/*.md"] },
  );

  // Generate HTML with custom handlers
  return generateMultiSelectTreeHtml(treeData, {
    treeClass: "workspace-multi-select-tree",
    fileClass: "tree-file",
    directoryClass: "tree-directory",
  });
}

export class DirectoryTreeMultiSectionAsset extends SectionAsset {
  override url = "/workspace/directory-tree-multi";
  title = "📁 Directory Tree Multi-Select";

  override content = async (): Promise<string> => {
    const treeHtml = await generateWorkspaceMultiSelectTreeHtml();

    return `
<div class="workspace-directory-section multi-select">
  <!-- Tree Subsection -->
  <details class="tree-subsection" open>
    <summary>🗂️ Files (Multi-Select)</summary>
    <div class="tree-content">
      ${treeHtml}
    </div>
  </details>
  
  <!-- Selected Files Preview Subsection -->
  <details id="selected-files-preview" class="preview-subsection" open>
    <summary>📄 Selected Files Preview</summary>
    <div class="preview-content" id="preview-content">
      <p class="no-selection">Select files from the tree above to view their concatenated content here.</p>
    </div>
  </details>
</div>
    `;
  };
}

export const directoryTreeMultiSectionAsset = new DirectoryTreeMultiSectionAsset();
