// Parameter interface for file viewer
export interface FileViewerParams extends TAssetParam {
  path: string;
}

import { SectionAsset, PageAsset, TAssetParam } from "../../base/asset_base.ts";
import { marked } from "npm:marked";

// Shared content generation logic
async function generateFileContent(params: FileViewerParams): Promise<string> {
  const encodedPath = params.path;
  if (!encodedPath) {
    return `
<div class="error-content">
    <p>File path required</p>
</div>
    `;
  }

  // Decode the URL-encoded path
  const filePath = decodeURIComponent(encodedPath);

  try {
    // Construct full path from deno directory
    const fullPath = `../${filePath}`;
    const fileContent = await Deno.readTextFile(fullPath);
    const htmlContent = marked.parse(fileContent);

    return `<div class="markdown-content">${htmlContent}</div>`;
  } catch (error) {
    return `
<div class="error-content">
    <p>Could not load file: ${filePath}</p>
    <p>Error: ${error instanceof Error ? error.message : String(error)}</p>
    <a href="/page/files" class="back-link" hx-get="/page/files" hx-target="#page-content">← Back to Files</a>
</div>
    `;
  }
}

// Section version - returns only content for use in other pages
export class FileViewerAsset extends SectionAsset<FileViewerParams> {
  override url = "/file/:path*";

  title = (params: Record<string, any>) => {
    const encodedPath = params.path;
    if (encodedPath) {
      const filePath = decodeURIComponent(encodedPath);
      const fileName = filePath.split("/").pop() || "File";
      return `📄 ${fileName}`;
    }
    return "File Not Found";
  };

  override content = async (): Promise<string> => {
    if (this.params) {
      return await generateFileContent(this.params);
    }
    return '<div class="error">No parameters provided</div>';
  };

  protected override async handleRequest(ctx: any): Promise<void> {
    // Check if path is in URL params (from :path*) or query params
    let path = ctx.params.path;

    // If no path in URL params, check query params
    if (!path && ctx.request.url) {
      const url = new URL(ctx.request.url);
      path = url.searchParams.get("path");
    }

    // Populate params with the found path
    this.params = { path } as FileViewerParams;

    // Call parent handleRequest
    await super.handleRequest(ctx);
  }
}

export const fileViewerAsset = new FileViewerAsset();

// Page version - returns full HTML page
export class FileViewerPageAsset extends PageAsset {
  override url = "/page/file/:path*";

  title = (params: Record<string, any>) => {
    const encodedPath = params.path;
    if (encodedPath) {
      const filePath = decodeURIComponent(encodedPath);
      const fileName = filePath.split("/").pop() || "File";
      return `📄 ${fileName}`;
    }
    return "File Not Found";
  };

  override content = async (params: Record<string, any>): Promise<string> => {
    const typedParams: FileViewerParams = { path: params.path };
    return await generateFileContent(typedParams);
  };

  protected override async handleRequest(ctx: any): Promise<void> {
    // Check if path is in URL params (from :path*) or query params
    let path = ctx.params.path;

    // If no path in URL params, check query params
    if (!path && ctx.request.url) {
      const url = new URL(ctx.request.url);
      path = url.searchParams.get("path");
    }

    // Update params with the found path
    ctx.params.path = path;

    // Call parent handleRequest
    await super.handleRequest(ctx);
  }
}

export const fileViewerPageAsset = new FileViewerPageAsset();
