import { BaseAsset } from "../base/asset_base.ts";
import { RouterContext } from "oak";

// Right menu/sidebar container asset
export class RightMenuAsset extends BaseAsset {
  url = "/menu/cards";
  requestType = "GET";

  protected async handleRequest(ctx: RouterContext<any>): Promise<void> {
    ctx.response.type = "text/html";
    ctx.response.body = `
<!-- Navigation Menu Card -->
<div class="menu-card-box" hx-get="/menu/navigation" hx-trigger="load" hx-target="this">
    <div class="loading">Loading navigation...</div>
</div>

<!-- File Tree Menu Card -->
<div class="menu-card-box" hx-get="/menu/files" hx-trigger="load" hx-target="this">
    <div class="loading">Loading files...</div>
</div>
      `;
  }
}

export const rightMenuAsset = new RightMenuAsset();
