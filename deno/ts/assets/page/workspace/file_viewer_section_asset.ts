import { SectionAsset, TAssetParam } from "../../base/asset_base.ts";
import { marked } from "npm:marked";

// Parameter interface for file viewer
export interface FileViewerParams extends TAssetParam {
  path?: string;
}

// Regex to extract YAML frontmatter
const FRONTMATTER_REGEX = /^---\s*\n([\s\S]*?)\n---\s*(?:\n|$)/;

// Configure marked to add language classes for highlight.js
marked.use({
  renderer: {
    code({ text, lang }: { text: string; lang?: string }): string {
      const language = lang || "plaintext";
      return `<pre><code class="hljs language-${language}">${text}</code></pre>`;
    },
  },
});

// Escape HTML special characters to prevent XSS
function escapeHtml(text: string): string {
  const entities: Record<string, string> = {
    "&": "&",
    "<": "<",
    ">": ">",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (char) => entities[char]);
}

// Generate file content HTML
async function generateFileContent(path?: string): Promise<string> {
  if (!path) {
    return `
<div class="workspace-file-placeholder">
  <p>Click on a file in the directory tree to view its contents here.</p>
  <p>Or enter a file path in the parameters above.</p>
</div>
    `;
  }

  // Decode the URL-encoded path
  const filePath = decodeURIComponent(path);

  try {
    // Construct full path from deno directory
    const fullPath = `../${filePath}`;
    const fileContent = await Deno.readTextFile(fullPath);

    // Extract YAML frontmatter if present
    const frontmatterMatch = fileContent.match(FRONTMATTER_REGEX);
    let yamlContent = "";
    let markdownContent = fileContent;

    if (frontmatterMatch) {
      yamlContent = frontmatterMatch[1].trim();
      markdownContent = fileContent.slice(frontmatterMatch[0].length);
    }

    // Parse markdown content
    const htmlContent = marked.parse(markdownContent);

    // Build the output with YAML frontmatter displayed as <pre> if present
    let result = '<div class="markdown-content">';

    if (yamlContent) {
      result += `<pre class="yaml-frontmatter"><code>${
        escapeHtml(yamlContent)
      }</code></pre>`;
    }

    result += `${htmlContent}</div>`;

    return result;
  } catch (error) {
    return `
<div class="error-content">
    <p>Could not load file: ${filePath}</p>
    <p>Error: ${error instanceof Error ? error.message : String(error)}</p>
</div>
    `;
  }
}

export class FileViewerSectionAsset extends SectionAsset<FileViewerParams> {
  override url = "/workspace/file-viewer";
  title = "📄 File Viewer";

  override content = async (): Promise<string> => {
    if (this.params?.path) {
      return await generateFileContent(this.params.path);
    }
    return await generateFileContent();
  };

  protected override async handleRequest(ctx: any): Promise<void> {
    // Params are now automatically populated from POST body in BaseAsset
    // this.params is already set by getHandler() in asset_base.ts
    // Just need to call parent handleRequest
    await super.handleRequest(ctx);
  }
}

export const fileViewerSectionAsset = new FileViewerSectionAsset();
