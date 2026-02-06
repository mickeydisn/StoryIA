import { ApiAsset } from "../base/asset_base.ts";
import { RouterContext } from "oak";

// Schema API asset
export class SchemaApiAsset extends ApiAsset {
  constructor() {
    super(
      "/api/schema",
      {
        status: "success",
        data: {
          database: {
            characters: 16,
            concepts: 24,
            locations: 15,
            systems: 18
          },
          chapters: 7,
          lastUpdated: new Date().toISOString()
        }
      }
    );
  }
}

export const schemaApiAsset = new SchemaApiAsset();

// Chapters API asset
export class ChaptersApiAsset extends ApiAsset {
  constructor() {
    super(
      "/api/chapters",
      {
        status: "success",
        chapters: [
          { id: 1, title: "Chapter 1", sections: 8 },
          { id: 2, title: "Chapter 2", sections: 7 },
          { id: 3, title: "Chapter 3", sections: 8 },
          { id: 4, title: "Chapter 4", sections: 6 },
          { id: 5, title: "Chapter 5", sections: 7 },
          { id: 6, title: "Chapter 6", sections: 8 },
          { id: 7, title: "Chapter 7", sections: 8 }
        ]
      }
    );
  }
}

export const chaptersApiAsset = new ChaptersApiAsset();

// Files API asset with dynamic content
export class FilesApiAsset extends ApiAsset {
  constructor() {
    super(
      "/api/files",
      async (ctx: RouterContext<any>) => {
        const { buildDirectoryTree } = await import("../../etc/buildDirectoryTree.ts");
        const { generateTreeHtml } = await import("../../etc/treeHelpers.ts");

        try {
          const url = new URL(ctx.request.url);
          const limit = url.searchParams.get('limit');
          const maxFiles = limit ? parseInt(limit) : null;

          const treeData: any = {};

          // Build tree structure for database
          treeData.database = await buildDirectoryTree("../database");

          // Build tree structure for chapiter
          try {
            treeData.chapiter = await buildDirectoryTree("../chapiter");
          } catch (error) {
            console.warn("Could not load chapiter directory:", error instanceof Error ? error.message : String(error));
            treeData.chapiter = {};
          }

          // Generate HTML tree
          const treeHtml = generateTreeHtml(treeData, maxFiles);

          return `
<div class="${maxFiles ? 'recent-files-tree' : 'file-tree'}">
    ${treeHtml}
    ${maxFiles && Object.keys(treeData).some(key => Object.keys(treeData[key]).length > maxFiles) ? `<div class="tree-item"><a href="/page/files" hx-get="/page/files" hx-target="#page-content" class="file-link more-link">📂 View All Files...</a></div>` : ''}
</div>
          `;
        } catch (error) {
          console.error("Error in files API:", error);
          return `<p>Error loading files: ${error instanceof Error ? error.message : String(error)}</p>`;
        }
      }
    );
  }
}

export const filesApiAsset = new FilesApiAsset();
