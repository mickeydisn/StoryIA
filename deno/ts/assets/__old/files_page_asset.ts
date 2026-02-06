import { PageAsset } from "../base/asset_base.ts";

export class FilesPageAsset extends PageAsset {
  url = "/files";
  title = "📁 Files";
  content = `
<div class="files-content">
    <h2>Project Files</h2>
    <div id="files-list" hx-get="/api/files" hx-trigger="load" hx-target="#files-list">
        <p>Loading files...</p>
    </div>
</div>
  `;
}

export const filesPageAsset = new FilesPageAsset();
