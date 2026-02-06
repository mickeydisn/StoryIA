import { AssetPageSection } from "../../base/asset_page_section.ts";
import { myLocalAgentSectionAsset } from "./my_local_agent_section_asset.ts";

export class LocalAgentPageAsset extends AssetPageSection {
  override url = "/page/local-agent"; // Main page URL

  title = "🤖 Local Agent Dashboard"; // Page title with emoji

  sections() {
    return [
      {
        id: "my-local-agent",
        title: "🐱 My Local Agent",
        asset: myLocalAgentSectionAsset,
        open: true, // Section starts expanded
        autoload: true, // Load content immediately
      },
    ];
  }
}

export const localAgentPageAsset = new LocalAgentPageAsset();
