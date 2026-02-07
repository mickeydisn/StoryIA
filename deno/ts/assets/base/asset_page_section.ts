import { PageAsset, SectionAsset } from "./asset_base.ts";
import { TAssetParam } from "./asset_base.ts";

// Interface for section configuration
export interface PageSectionConfig {
  id: string;
  title: string;
  asset: SectionAsset;
  open?: boolean;
  params?: Record<string, any>;
  autoload?: boolean;
}

// Abstract base class for pages with sections
export abstract class AssetPageSection extends PageAsset {
  abstract sections(): PageSectionConfig[];

  protected override async handleRequest(ctx: any): Promise<void> {
    ctx.response.type = "text/html";

    // Handle title generation
    const title = typeof this.title === 'function' ? this.title(ctx.params) : this.title;

    // Generate sections HTML
    const sectionsHtml = this.generateSectionsHtml();

    ctx.response.body = this.generateResponse(title, sectionsHtml);
  }

  private generateSectionsHtml(): string {
    const sections = this.sections();
    const sectionsHtml: string[] = [];

    for (const section of sections) {
      const sectionHtml = this.generateSectionHtml(section);
      sectionsHtml.push(sectionHtml);
    }

    return sectionsHtml.join('\n');
  }

  private generateSectionHtml(section: PageSectionConfig): string {
    const openAttr = section.open ? ' open' : '';

    let paramsHtml = '';
    let hasVisibleParams = false;
    let shouldAutoload = section.autoload || false;
    let loadButtonHtml = '';

    // Check if the section has parameters that should be visible to user
    if (section.params && Object.keys(section.params).length > 0) {
      // Has actual parameter values - hide textarea
      hasVisibleParams = false;
      const paramsJson = JSON.stringify(section.params);
      loadButtonHtml = `<button class="summary-load-btn" data-url="${section.asset.url.replace(':path*', '')}" data-section-id="${section.id}" data-params="${btoa(paramsJson)}" onclick="event.stopPropagation(); loadSectionWithParamsFromData(this)" title="Load/Refresh Section"></button>`;
    } else if (section.params !== undefined) {
      // Has empty params object - show textarea with template
      hasVisibleParams = true;
      const templateJson = this.generateParamTemplate(section.asset);

      paramsHtml = `
        <div class="section-params" style="margin-bottom: 10px;">
          <label>Parameters:</label>
          <textarea class="params-textarea" id="params-${section.id}" rows="4" cols="50">${templateJson}</textarea>
        </div>
      `;
      loadButtonHtml = `<button class="summary-load-btn" onclick="loadSectionWithParams('${section.asset.url}', '${section.id}')" title="Load Section"></button>`;
    } else {
      // No params - still show refresh button for autoload sections
      loadButtonHtml = `<button class="summary-load-btn" data-url="${section.asset.url.replace(':path*', '')}" data-section-id="${section.id}" data-params="${btoa(JSON.stringify({}))}" onclick="loadSectionWithParamsFromData(this)" title="Refresh Section"></button>`;
    }

    const contentHtml = hasVisibleParams ? `
      <div id="content-${section.id}" class="section-content">
        ${paramsHtml}
        <div id="loading-${section.id}" class="htmx-indicator" style="display: none;">
          Loading...
        </div>
      </div>
    ` : shouldAutoload ? `
      <div id="content-${section.id}" class="section-content" data-autoload="true" data-url="${section.asset.url.replace(':path*', '')}" data-section-id="${section.id}" data-params='${JSON.stringify(section.params || {})}'>
        Loading...
      </div>
    ` : `
      <div id="content-${section.id}" class="section-content">
        <div id="loading-${section.id}" class="htmx-indicator" style="display: none;">
          Loading...
        </div>
      </div>
    `;

    return `
      <details${openAttr}>
        <summary>${section.title}${loadButtonHtml}</summary>
        ${contentHtml}
      </details>
    `;
  }

  private generateParamTemplate(asset: SectionAsset): string {
    // Generate a JSON template based on the asset's expected parameters
    // For FileViewerAsset, we know it expects {path: string}
    const template = { path: "" };
    return JSON.stringify(template, null, 2);
  }

  protected override generateResponse(title: string, content: string): string {
    return `
<div class="page-content-box">
    <div class="page-header">
        <h1>${title}</h1>
    </div>
    <div class="page-content">
        ${content}
    </div>
</div>
<link rel="stylesheet" href="/css/sections.css">
<script>
function loadSectionWithParams(url, sectionId, paramsOverride) {
  const textarea = document.getElementById('params-' + sectionId);
  const loadingDiv = document.getElementById('loading-' + sectionId);
  const contentDiv = document.getElementById('content-' + sectionId);

  if (!contentDiv) return;

  let params;
  try {
    if (typeof paramsOverride === 'string') {
      // Parse JSON string (from onclick attribute)
      params = JSON.parse(paramsOverride);
    } else if (paramsOverride !== undefined) {
      // Use provided params object (for autoload)
      params = paramsOverride;
    } else if (textarea) {
      // Parse from textarea
      params = JSON.parse(textarea.value);
    } else {
      throw new Error('No parameters available');
    }

    if (loadingDiv) loadingDiv.style.display = 'block';

    // Handle route patterns like /file/:path* by cleaning URL
    let finalUrl = url;
    if (url.includes(':path*')) {
      finalUrl = url.replace(':path*', '');
    }
    // Ensure URL is absolute
    finalUrl = new URL(finalUrl, window.location.origin).toString();

    // Use POST with JSON body instead of GET with query params
    fetch(finalUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'HX-Request': 'true'
      },
      body: JSON.stringify(params)
    })
      .then(response => response.text())
      .then(html => {
        contentDiv.innerHTML = html;
        if (loadingDiv) loadingDiv.style.display = 'none';
      })
      .catch(error => {
        contentDiv.innerHTML = '<div class="error">Error loading section: ' + error.message + '</div>';
        if (loadingDiv) loadingDiv.style.display = 'none';
      });
  } catch (error) {
    contentDiv.innerHTML = '<div class="error">Invalid JSON parameters: ' + error.message + '</div>';
    if (loadingDiv) loadingDiv.style.display = 'none';
  }
}

function loadSectionWithParamsFromData(buttonElement) {
  const url = buttonElement.getAttribute('data-url');
  const sectionId = buttonElement.getAttribute('data-section-id');
  const paramsBase64 = buttonElement.getAttribute('data-params');

  // Open the details if it's closed
  const details = buttonElement.closest('details');
  if (details && !details.open) {
    details.open = true;
  }

  if (url && sectionId && paramsBase64) {
    try {
      const paramsJson = atob(paramsBase64);
      const params = JSON.parse(paramsJson);
      loadSectionWithParams(url, sectionId, params);
    } catch (error) {
      console.error('Error decoding params:', error);
    }
  }
}

function autoLoadSection(url, sectionId, params) {
  loadSectionWithParams(url, sectionId, params);
}

// Initialize autoload sections immediately
(function() {
  function initAutoload() {
    const autoloadElements = document.querySelectorAll('[data-autoload="true"]');
    autoloadElements.forEach(function(element) {
      const url = element.getAttribute('data-url');
      const sectionId = element.getAttribute('data-section-id');
      const paramsStr = element.getAttribute('data-params');

      if (url && sectionId && paramsStr) {
        try {
          const params = JSON.parse(paramsStr);
          autoLoadSection(url, sectionId, params);
        } catch (error) {
          console.error('Error parsing autoload params:', error);
        }
      }
    });
  }

  // Try to initialize immediately
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAutoload);
  } else {
    // Document already loaded, initialize now
    setTimeout(initAutoload, 1);
  }
})();
</script>
    `;
  }
}
