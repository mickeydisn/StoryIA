import { MenuCardAsset } from "../base/asset_base.ts";

// Navigation menu card asset
export class NavigationMenuAsset extends MenuCardAsset {
  url = "/menu/navigation";
  title = "🧭 Navigation";
  override content = `
<nav class="sidebar-nav">
    <button class="nav-button" hx-post="/page/home" hx-target="#page-content">🏠 Home</button>
    <button class="nav-button" hx-post="/page/workspace" hx-target="#page-content">💼 Workspace</button>
    <button class="nav-button" hx-post="/page/workspace-multi" hx-target="#page-content">🔲 Workspace Multi</button>
    <button class="nav-button" hx-post="/page/section-files" hx-target="#page-content">📁 File Sections</button>
    <button class="nav-button" hx-post="/page/references" hx-target="#page-content">📊 References</button>
    <button class="nav-button" hx-post="/page/references2" hx-target="#page-content">📊 References v2</button>
    <button class="nav-button" hx-post="/page/local-agent" hx-target="#page-content">🤖 Local Agent</button>
</nav>
  `;
}

export const navigationMenuAsset = new NavigationMenuAsset();
