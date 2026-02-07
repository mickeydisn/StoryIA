import { PageAsset } from "../base/asset_base.ts";
import {
  buildDirectoryTree,
  generateTreeHtml,
} from "../../etc/directoryTree.ts";

// Helper function to generate full tree HTML for main page
async function generateFullTreeHtml(): Promise<string> {
  // Build tree from multiple directories and generate HTML (no limit for full page)
  const treeData = await buildDirectoryTree([
    "../database",
    "../database_build",
    "../chapiter",
  ]);
  return generateTreeHtml(treeData);
}

export class HomeAsset extends PageAsset {
  url = "/page/home";
  title = "🏠 Schema Report Dashboard";
  override content = `
<div class="welcome-section">
    <h2>Welcome to the Schema Report Interface</h2>
    <p>Use the menu on the right to explore your project's database, chapters, and validation reports.</p>

    <div class="quick-stats">
        <div class="stat-card">
            <h3>📁 Database</h3>
            <p>16 Characters, 24 Concepts, 15 Locations, 18 Systems</p>
        </div>
        <div class="stat-card">
            <h3>📖 Chapters</h3>
            <p>7 Chapters with detailed content and mind maps</p>
        </div>
        <div class="stat-card">
            <h3>✅ Validation</h3>
            <p>Automated schema validation and reporting</p>
        </div>
    </div>
</div>
  `;
}

export const homeAsset = new HomeAsset();
