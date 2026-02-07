import { SectionAsset } from "../../base/asset_base.ts";
import {
  buildDirectoryTree,
  DirectoryNode,
  FileNode,
  generateTreeHtml,
} from "../../../etc/directoryTree.ts";

// Custom file click handler for workspace - opens file in a new dynamic section
function workspaceFileClickHandler(node: FileNode, name: string): string {
  const encodedPath = encodeURIComponent(node.path);
  return `href="#" 
          onclick="window.openFileInWorkspace('${encodedPath}', '${name}'); return false;"
          class="file-link"`;
}

// Custom directory click handler for toggle
function workspaceDirectoryClickHandler(
  _node: DirectoryNode,
  _name: string,
): string {
  return `onclick="this.parentElement.classList.toggle('expanded')"`;
}

// Generate tree HTML for workspace directory
async function generateWorkspaceTreeHtml(): Promise<string> {
  // Build tree from database/entry with **/*.md filter
  const treeData = await buildDirectoryTree(
    "../database/entry",
    { filters: ["**/*.md"] },
  );

  // Generate HTML with custom handlers
  return generateTreeHtml(treeData, {
    fileClickHandler: workspaceFileClickHandler,
    directoryClickHandler: workspaceDirectoryClickHandler,
    treeClass: "workspace-file-tree",
    fileClass: "tree-file",
    directoryClass: "tree-directory",
  });
}

export class DirectoryTreeSectionAsset extends SectionAsset {
  override url = "/workspace/directory-tree";
  title = "📁 Directory Tree";

  override content = async (): Promise<string> => {
    const treeHtml = await generateWorkspaceTreeHtml();

    return `
<div class="workspace-directory-section">
  <!-- Tree Subsection -->
  <details class="tree-subsection" open>
    <summary>🗂️ Files</summary>
    <div class="tree-content">
      ${treeHtml}
    </div>
  </details>
</div>
    `;
  };
}

export const directoryTreeSectionAsset = new DirectoryTreeSectionAsset();
