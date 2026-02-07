// Parameter interface for file viewer
export interface FileViewerParams extends TAssetParam {
  path: string;
}

import { PageAsset, SectionAsset, TAssetParam } from "../../base/asset_base.ts";
import { marked } from "npm:marked";

// JavaScript for collapsible markdown elements
const collapsibleScript = `
<script>
(function() {
  function initCollapsible() {
    // Make headers collapsible
    document.querySelectorAll('.markdown-content h1, .markdown-content h2, .markdown-content h3, .markdown-content h4, .markdown-content h5, .markdown-content h6').forEach(header => {
      if (header.classList.contains('collapsible-initialized')) return;
      header.classList.add('collapsible-initialized');
      
      header.classList.add('collapsible-header');
      header.classList.add('expanded');
      
      header.addEventListener('click', function() {
        const isExpanded = this.classList.contains('expanded');
        this.classList.toggle('expanded', !isExpanded);
        this.classList.toggle('collapsed', isExpanded);
        
        // Collapse/expand all siblings until next header of same or higher level
        const headerLevel = parseInt(this.tagName.charAt(1));
        let sibling = this.nextElementSibling;
        while (sibling) {
          if (sibling.tagName.match(/^H[1-6]$/)) {
            const siblingLevel = parseInt(sibling.tagName.charAt(1));
            if (siblingLevel <= headerLevel) break;
          }
          if (isExpanded) {
            sibling.classList.add('section-hidden');
          } else {
            sibling.classList.remove('section-hidden');
          }
          sibling = sibling.nextElementSibling;
        }
      });
    });
    
    
    // Make table rows collapsible (except header)
    document.querySelectorAll('.markdown-content table').forEach(table => {
      if (table.classList.contains('collapsible-table-initialized')) return;
      table.classList.add('collapsible-table-initialized');
      
      const thead = table.querySelector('thead');
      const tbody = table.querySelector('tbody');
      
      if (thead && tbody) {
        // Add toggle to header row
        const headerRow = thead.querySelector('tr');
        if (headerRow) {
          const firstTh = headerRow.querySelector('th');
          if (firstTh && !firstTh.querySelector('.table-toggle')) {
            const toggle = document.createElement('button');
            toggle.className = 'table-toggle expanded';
            toggle.innerHTML = '<span class="toggle-icon">▼</span>';
            toggle.type = 'button';
            toggle.title = 'Toggle rows';
            firstTh.insertBefore(toggle, firstTh.firstChild);
            
            toggle.addEventListener('click', function(e) {
              e.stopPropagation();
              const isExpanded = this.classList.contains('expanded');
              this.classList.toggle('expanded', !isExpanded);
              this.classList.toggle('collapsed', isExpanded);
              tbody.classList.toggle('rows-hidden', isExpanded);
            });
          }
        }
        
        // Add row-specific toggles for nested rows (simple approach: group by indentation or content)
        const rows = tbody.querySelectorAll('tr');
        rows.forEach(row => {
          row.classList.add('table-row-expandable');
          
          // Double-click to hide individual row
          row.addEventListener('dblclick', function(e) {
            if (e.target.tagName !== 'BUTTON') {
              this.classList.toggle('row-hidden');
            }
          });
        });
      }
    });
  }
  
  // Initialize syntax highlighting
  function initHighlighting() {
    if (typeof hljs !== 'undefined') {
      document.querySelectorAll('.markdown-content pre code').forEach((block) => {
        hljs.highlightElement(block);
      });
    }
  }
  
  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initCollapsible();
      initHighlighting();
    });
  } else {
    initCollapsible();
    initHighlighting();
  }
  
  // Also re-initialize after HTMX swaps
  document.body.addEventListener('htmx:afterSwap', function() {
    initCollapsible();
    initHighlighting();
  });
  document.body.addEventListener('htmx:load', function() {
    initCollapsible();
    initHighlighting();
  });
})();
</script>
`;

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
    "&": String.fromCharCode(38) + "amp;",
    "<": String.fromCharCode(38) + "lt;",
    ">": String.fromCharCode(38) + "gt;",
    '"': String.fromCharCode(38) + "quot;",
    "'": String.fromCharCode(38) + "#039;",
  };
  return text.replace(/[&<>"']/g, (char) => entities[char]);
}

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

    result += `${htmlContent}</div>${collapsibleScript}`;

    return result;
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
