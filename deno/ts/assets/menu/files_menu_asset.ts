import { MenuCardAsset } from "../base/asset_base.ts";
import {
  buildDirectoryTree,
  DirectoryNode,
  FileNode,
  generateTreeHtml,
  TreeData,
} from "../../etc/directoryTree.ts";

// Custom file click handler for the menu - uses HTMX to load files
function menuFileClickHandler(node: FileNode, _name: string): string {
  const encodedPath = encodeURIComponent(node.path);
  return `href="/page/file/${encodedPath}" hx-get="/page/file/${encodedPath}" hx-target="#page-content"`;
}

// Custom directory click handler for the menu - toggles expansion
function menuDirectoryClickHandler(
  _node: DirectoryNode,
  _name: string,
): string {
  return `onclick="this.parentElement.classList.toggle('expanded')"`;
}

// Helper function to generate tree HTML for menu sidebar (compact)
async function generateTreeHtmlForMenu(): Promise<string> {
  // Build tree from multiple directories with filter
  const treeData = await buildDirectoryTree(
    ["../database", "../ai_context"],
    { filters: ["*.md"] },
  );

  // Generate HTML with custom handlers for menu behavior
  return generateTreeHtml(treeData, {
    maxFiles: undefined, // No limit for sidebar - show all directories
    fileClickHandler: menuFileClickHandler,
    directoryClickHandler: menuDirectoryClickHandler,
    treeClass: "file-tree-sidebar",
    fileClass: "tree-file",
    directoryClass: "tree-directory",
  });
}

// Files menu card asset
export class FilesMenuAsset extends MenuCardAsset {
  url = "/menu/files";
  title = "📄 Files";
  override content = async (): Promise<string> => {
    const treeHtml = await generateTreeHtmlForMenu();
    return treeHtml;
  };
}

export const filesMenuAsset = new FilesMenuAsset();
