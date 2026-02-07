import { AssetPageSection } from "../../base/asset_page_section.ts";
import { directoryTreeSectionAsset } from "./directory_tree_section_asset.ts";

export class WorkspacePageAsset extends AssetPageSection {
  override url = "/page/workspace";
  title = "💼 Workspace";

  sections() {
    return [
      {
        id: "directory-tree",
        title: "📁 Directory Tree",
        asset: directoryTreeSectionAsset,
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
// Global function to open files in workspace (as subsection inside Directory Tree)
window.openFileInWorkspace = function(encodedPath, fileName) {
  // Create a unique section ID based on timestamp
  const sectionId = 'file-' + Date.now();
  
  // Create the new subsection HTML
  const sectionHtml = \`
    <details id="\${sectionId}" open class="file-subsection">
      <summary>
        📄 \${fileName}
        <button class="summary-load-btn close-btn" data-section-id="\${sectionId}" title="Close">✕</button>
        <button class="summary-load-btn delete-btn" data-section-id="\${sectionId}" title="Delete">🗑</button>
      </summary>
      <div class="section-content" id="content-\${sectionId}">
        <div class="htmx-indicator">Loading...</div>
      </div>
    </details>
  \`;
  
  // Find the file subsections container
  let subsectionsContainer = document.querySelector('#file-subsections-container');
  
  // If container doesn't exist, create it inside directory tree content
  if (!subsectionsContainer) {
    const directoryTreeContent = document.querySelector('#content-directory-tree');
    if (directoryTreeContent) {
      subsectionsContainer = document.createElement('div');
      subsectionsContainer.id = 'file-subsections-container';
      subsectionsContainer.className = 'file-subsections-container';
      directoryTreeContent.appendChild(subsectionsContainer);
    }
  }
  
  if (subsectionsContainer) {
    // Create a container for the new subsection
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = sectionHtml;
    const newSection = tempDiv.firstElementChild;
    
    // Append to the subsections container
    subsectionsContainer.appendChild(newSection);
    
    // Add event listeners for close and delete buttons
    const closeBtn = newSection.querySelector('.close-btn');
    const deleteBtn = newSection.querySelector('.delete-btn');
    
    if (closeBtn) {
      closeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const sectionId = this.getAttribute('data-section-id');
        window.closeFileSection(sectionId);
      });
    }
    
    if (deleteBtn) {
      deleteBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const sectionId = this.getAttribute('data-section-id');
        window.deleteFileSection(sectionId);
      });
    }
    
    // Load the file content
    const contentDiv = document.getElementById('content-' + sectionId);
    if (contentDiv) {
      fetch('/workspace/file-viewer?path=' + encodedPath)
        .then(response => response.text())
        .then(html => {
          contentDiv.innerHTML = html;
        })
        .catch(error => {
          contentDiv.innerHTML = '<div class="error">Error loading file: ' + error.message + '</div>';
        });
    }
  }
};

// Close a file section (collapse it)
window.closeFileSection = function(sectionId) {
  const details = document.getElementById(sectionId);
  if (details) {
    details.open = false;
  }
};

// Delete a file section (remove from DOM)
window.deleteFileSection = function(sectionId) {
  const details = document.getElementById(sectionId);
  if (details) {
    details.remove();
  }
};
</script>`,
    );
  }
}

export const workspacePageAsset = new WorkspacePageAsset();
