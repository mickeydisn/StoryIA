import { AssetPageSection, PageSectionConfig } from "../../base/asset_page_section.ts";
import { fileViewerAsset } from "./file_viewer_asset.ts";

// Page with file viewer sections
export class PageSectionFilesAsset extends AssetPageSection {
  url = "/page/section-files";
  title = "File Sections Demo";

  sections(): PageSectionConfig[] {
    return [
      {
        id: "auto-load-references",
        title: "References (Auto-loaded)",
        asset: fileViewerAsset,
        open: true,
        params: { path: "database_build/_references.md" },
        autoload: true
      },
      {
        id: "manual-load-references",
        title: "References (Manual Load)",
        asset: fileViewerAsset,
        open: false,
        params: { path: "database_build/_references.md" },
        autoload: false
      },
      {
        id: "custom-params",
        title: "Custom File Viewer",
        asset: fileViewerAsset,
        open: false,
        params: {}, // Empty params - will show textarea for user input
        autoload: false
      }
    ];
  }
}

export const pageSectionFilesAsset = new PageSectionFilesAsset();
