import { AssetPageSection } from "../../base/asset_page_section.ts";
import { directoryTreeMultiSectionAsset } from "./directory_tree_multi_section_asset.ts";
import { SectionAsset, TAssetParam } from "../../base/asset_base.ts";
import { marked } from "npm:marked";

// Params interface for concatenate files
interface ConcatenateFilesParams extends TAssetParam {
  paths?: string[];
}

// API Asset to concatenate selected files
class ConcatenateFilesAsset extends SectionAsset<ConcatenateFilesParams> {
  override url = "/workspace/concatenate-files";
  title = "Concatenate Files";

  override content = async (): Promise<string> => {
    return ""; // Content handled via handleRequest
  };

  protected override async handleRequest(ctx: any): Promise<void> {
    // Params are populated from POST body by BaseAsset
    const pathsParam = this.params?.paths;

    if (!pathsParam || pathsParam.length === 0) {
      ctx.response.body = "<div class='error'>No files selected</div>";
      return;
    }

    const paths = pathsParam;
    const fileDetails: string[] = [];
    const errors: string[] = [];

    for (const encodedPath of paths) {
      const filePath = decodeURIComponent(encodedPath);
      try {
        const fullPath = `../${filePath}`;
        const fileContent = await Deno.readTextFile(fullPath);
        
        // Get filename for summary
        const fileName = filePath.split("/").pop() || "Unknown";
        
        // Parse markdown content
        const htmlContent = marked.parse(fileContent);
        
        // Wrap in details/summary
        fileDetails.push(`<details class="file-preview-item" open>
  <summary class="file-preview-summary">📄 ${fileName}</summary>
  <div class="file-preview-content markdown-content">
    ${htmlContent}
  </div>
</details>`);
      } catch (error) {
        errors.push(`Error reading ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    // Build final HTML with file details and errors
    let finalHtml = `<div class="files-preview-list">\n${fileDetails.join("\n")}</div>`;

    if (errors.length > 0) {
      finalHtml += `\n<div class="files-preview-errors">\n  <h4>⚠️ Errors:</h4>\n  <ul>\n    ${errors.map(e => `<li>${e}</li>`).join("\n    ")}\n  </ul>\n</div>`;
    }

    ctx.response.type = "text/html";
    ctx.response.body = finalHtml;
  }
}

export const concatenateFilesAsset = new ConcatenateFilesAsset();

// Page Asset
export class WorkspaceMultiPageAsset extends AssetPageSection {
  override url = "/page/workspace-multi";
  title = "💼 Workspace Multi-Select";

  sections() {
    return [
      {
        id: "directory-tree-multi",
        title: "📁 Directory Tree Multi-Select",
        asset: directoryTreeMultiSectionAsset,
        open: true,
        autoload: true,
      },
    ];
  }

  protected override generateResponse(title: string, content: string): string {
    const baseResponse = super.generateResponse(title, content);
    // Add workspace CSS and JavaScript to the response
    return baseResponse.replace(
      '<link rel="stylesheet" href="/css/sections.css">',
      `<link rel="stylesheet" href="/css/sections.css">
<link rel="stylesheet" href="/css/workspace.css">
<script>
// Store selected files
window.selectedFilesMulti = new Set();

// Toggle file selection
window.toggleFileSelection = function(encodedPath, fileName) {
  const checkbox = document.querySelector('input[data-path="' + encodedPath + '"]');
  const fileLink = document.querySelector('a[data-path="' + encodedPath + '"]');
  const fileItem = fileLink?.closest('.tree-file');
  
  if (window.selectedFilesMulti.has(encodedPath)) {
    window.selectedFilesMulti.delete(encodedPath);
    if (checkbox) checkbox.checked = false;
    if (fileItem) fileItem.classList.remove('selected');
  } else {
    window.selectedFilesMulti.add(encodedPath);
    if (checkbox) checkbox.checked = true;
    if (fileItem) fileItem.classList.add('selected');
  }
  
  // Update preview
  window.updatePreview();
};

// Select all files in a directory
window.selectAllInDir = function(encodedDirPath) {
  // Get all checkboxes that are descendants of this directory
  const dirToggle = document.querySelector('[onclick*="' + encodedDirPath + '"]');
  if (!dirToggle) return;
  
  const dirItem = dirToggle.closest('.tree-directory');
  if (!dirItem) return;
  
  const checkboxes = dirItem.querySelectorAll('input.file-checkbox');
  checkboxes.forEach(function(checkbox) {
    const path = checkbox.getAttribute('data-path');
    if (path && !window.selectedFilesMulti.has(path)) {
      window.selectedFilesMulti.add(path);
      checkbox.checked = true;
      const fileItem = checkbox.closest('.tree-file');
      if (fileItem) fileItem.classList.add('selected');
    }
  });
  
  window.updatePreview();
};

// Unselect all files in a directory
window.unselectAllInDir = function(encodedDirPath) {
  // Get all checkboxes that are descendants of this directory
  const dirToggle = document.querySelector('[onclick*="' + encodedDirPath + '"]');
  if (!dirToggle) return;
  
  const dirItem = dirToggle.closest('.tree-directory');
  if (!dirItem) return;
  
  const checkboxes = dirItem.querySelectorAll('input.file-checkbox');
  checkboxes.forEach(function(checkbox) {
    const path = checkbox.getAttribute('data-path');
    if (path && window.selectedFilesMulti.has(path)) {
      window.selectedFilesMulti.delete(path);
      checkbox.checked = false;
      const fileItem = checkbox.closest('.tree-file');
      if (fileItem) fileItem.classList.remove('selected');
    }
  });
  
  window.updatePreview();
};

// Update preview section with concatenated content
window.updatePreview = function() {
  const previewContent = document.getElementById('preview-content');
  if (!previewContent) return;
  
  if (window.selectedFilesMulti.size === 0) {
    previewContent.innerHTML = '<p class="no-selection">Select files from the tree above to view their concatenated content here.</p>';
    return;
  }
  
  // Show loading
  previewContent.innerHTML = '<div class="htmx-indicator">Loading concatenated content...</div>';
  
    // Fetch concatenated content using POST with JSON
    const paths = Array.from(window.selectedFilesMulti);
    fetch('/workspace/concatenate-files', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'HX-Request': 'true'
      },
      body: JSON.stringify({ paths })
    })
      .then(response => response.text())
      .then(html => {
        previewContent.innerHTML = html;
      })
      .catch(error => {
        previewContent.innerHTML = '<div class="error">Error loading content: ' + error.message + '</div>';
      });
};
</script>`,
    );
  }
}

export const workspaceMultiPageAsset = new WorkspaceMultiPageAsset();
