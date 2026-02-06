import { MenuCardAsset } from "../base/asset_base.ts";
import { buildDirectoryTree } from "../../etc/buildDirectoryTree.ts";
import { generateTreeHtml } from "../../etc/treeHelpers.ts";

// Helper function to generate tree HTML for menu sidebar (compact)
async function generateTreeHtmlForMenu(): Promise<string> {
  const treeData: any = {};

  // Build tree structure for database_build
  try {
    treeData.ai_context = await buildDirectoryTree("../ai_context");
  } catch (error) {
    console.warn(
      "Could not load database_build directory:",
      error instanceof Error ? error.message : String(error),
    );
    treeData.database_build = {};
  }

  // Build tree structure for database
  try {
    treeData.database = await buildDirectoryTree("../database");
  } catch (error) {
    console.warn(
      "Could not load database directory:",
      error instanceof Error ? error.message : String(error),
    );
    treeData.database = {};
  }

  return generateTreeHtml(treeData, null); // No limit for sidebar - show all directories
}

// Files menu card asset
export class FilesMenuAsset extends MenuCardAsset {
  url = "/menu/files";
  title = "📄 Files";
  override content = async (): Promise<string> => {
    const treeHtml = await generateTreeHtmlForMenu();
    return `
<div class="file-tree-sidebar">
    ${treeHtml}
</div>
    `;
  };
}

export const filesMenuAsset = new FilesMenuAsset();
