import { SectionAsset, PageAsset, TAssetParam, ApiAsset } from "../../base/asset_base.ts";
import { AssetPageSection } from "../../base/asset_page_section.ts";

// Import assets from dedicated files
import { allDbEntriesAsset } from "./all_db_entries_asset.ts";
import { allMdFile } from "./all_md_file_asset.ts";
import { allMdFileAssetByFile } from "./all_md_file_asset_byfile.ts";
import { allFileEntriesAsset } from "./all_file_entries_asset.ts";
import { unionEntriesAsset } from "./union_entries_asset.ts";
import { chaptersOverviewAsset } from "./chapters_overview_asset.ts";

// Page version with sections
export class ReferencesPageAsset extends AssetPageSection {
  override url = "/page/references2";

  title = "� Database References Generator v2";

  sections() {
    return [
      {
        id: "all-md-files-byfile",
        title: "📁 All Markdown Files (Table)",
        asset: allMdFileAssetByFile,
        open: false,
        autoload: true
      },
      {
        id: "union-entries",
        title: "🔗 Union Entries Analysis",
        asset: unionEntriesAsset,
        open: false,
        autoload: true
      },
      {
        id: "chapters-overview",
        title: "📚 Chapters Overview",
        asset: chaptersOverviewAsset,
        open: false,
        autoload: true
      }

      /*
      {
        id: "all-db-entries",
        title: "📁 All DB Entries",
        asset: allDbEntriesAsset,
        open: false,
        autoload: true
      },
      {
        id: "all-md-files",
        title: "📄 All Markdown Files",
        asset: allMdFile,
        open: false,
        autoload: true
      },      
      {
        id: "all-file-entries",
        title: "📊 All File Entries Analysis",
        asset: allFileEntriesAsset,
        open: false,
        autoload: true
      },

        */
    ];
  }
}

export const referencesPageAsset = new ReferencesPageAsset();
