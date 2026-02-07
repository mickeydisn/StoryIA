import { Router } from "oak";
import { BaseAsset } from "../assets/base/asset_base.ts";
import { homeAsset } from "../assets/page/home_asset.ts";
import {
  schemaApiAsset,
  chaptersApiAsset,
  filesApiAsset,
} from "../assets/api/api_assets.ts";
import {
  fileViewerAsset,
  fileViewerPageAsset,
} from "../assets/page/page_test/file_viewer_asset.ts";
import { pageSectionFilesAsset } from "../assets/page/page_test/page_section_files_asset.ts";
import { rightMenuAsset } from "../assets/menu/right_menu_asset.ts";
import { navigationMenuAsset } from "../assets/menu/navigation_menu_asset.ts";
import { filesMenuAsset } from "../assets/menu/files_menu_asset.ts";
import {
  referencesAsset,
  referencesPageAsset,
  databaseEntriesAsset,
  markdownFilesAsset,
  referencesOverviewAsset,
  fileScanAsset,
  detailedTableAsset,
} from "../assets/page/references/references_asset.ts";

// Import new references_asset2 assets
import { referencesPageAsset as referencesPageAsset2 } from "../assets/page/references_asset2/references_asset.ts";
import { allDbEntriesAsset } from "../assets/page/references_asset2/all_db_entries_asset.ts";
import { allMdFile } from "../assets/page/references_asset2/all_md_file_asset.ts";
import { allMdFileAssetByFile } from "../assets/page/references_asset2/all_md_file_asset_byfile.ts";
import { allFileEntriesAsset } from "../assets/page/references_asset2/all_file_entries_asset.ts";
import { unionEntriesAsset } from "../assets/page/references_asset2/union_entries_asset.ts";
import { chaptersOverviewAsset } from "../assets/page/references_asset2/chapters_overview_asset.ts";
import { localAgentPageAsset } from "../assets/page/local_agent/local_agent_page_asset.ts";

// Import workspace assets
import { workspacePageAsset } from "../assets/page/workspace/workspace_page_asset.ts";
import { directoryTreeSectionAsset } from "../assets/page/workspace/directory_tree_section_asset.ts";
import { fileViewerSectionAsset } from "../assets/page/workspace/file_viewer_section_asset.ts";

// Import workspace multi-select assets
import { workspaceMultiPageAsset } from "../assets/page/workspace_multi/workspace_multi_page_asset.ts";
import { directoryTreeMultiSectionAsset } from "../assets/page/workspace_multi/directory_tree_multi_section_asset.ts";
import { concatenateFilesAsset } from "../assets/page/workspace_multi/workspace_multi_page_asset.ts";

// Re-export asset classes for use by asset files
export { PageAsset, ApiAsset } from "../assets/base/asset_base.ts";

// List of all assets
const allAssets: BaseAsset[] = [
  homeAsset,
  schemaApiAsset,
  chaptersApiAsset,
  filesApiAsset,
  fileViewerAsset,
  fileViewerPageAsset,
  pageSectionFilesAsset,
  rightMenuAsset,
  navigationMenuAsset,
  filesMenuAsset,
  referencesAsset,
  referencesPageAsset,
  databaseEntriesAsset,
  markdownFilesAsset,
  referencesOverviewAsset,
  fileScanAsset,
  detailedTableAsset,
  // New references_asset2 assets
  allDbEntriesAsset,
  allMdFile,
  allMdFileAssetByFile,
  allFileEntriesAsset,
  unionEntriesAsset,
  chaptersOverviewAsset,
  referencesPageAsset2,
  localAgentPageAsset,
  // Workspace assets
  workspacePageAsset,
  directoryTreeSectionAsset,
  fileViewerSectionAsset,
  // Workspace multi-select assets
  workspaceMultiPageAsset,
  directoryTreeMultiSectionAsset,
  concatenateFilesAsset,
];

export function setupMainRoutes(router: Router) {
  // Register all assets
  for (const asset of allAssets) {
    if (asset.requestType === "POST") {
      router.post(asset.url, asset.getHandler());
    } else if (asset.requestType === "GET") {
      // Fallback for any legacy GET assets
      router.get(asset.url, asset.getHandler());
    }
    // Add other request types as needed (PUT, DELETE, etc.)
  }
}
