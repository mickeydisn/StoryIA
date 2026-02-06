import { PageAsset } from "../base/asset_base.ts";

export class SchemaAsset extends PageAsset {
  url = "/schema";
  title = "📊 Schema Report";
  content = `
<div class="schema-content">
    <h2>Schema Report</h2>
    <div id="schema-data" hx-get="/api/schema" hx-trigger="load" hx-target="#schema-data">
        <p>Loading schema data...</p>
    </div>
</div>
  `;
}

export const schemaAsset = new SchemaAsset();
