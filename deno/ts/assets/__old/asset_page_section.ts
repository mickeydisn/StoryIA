import { PageAsset } from "../base/asset_base.ts";
import { TAssetParam } from "../base/asset_base.ts";

// Interface for section configuration
export interface AssetSection {
  id: string;
  title: string;
  url: string;
  open?: boolean;
  params?: Record<string, any>;
  autoload?: boolean;
}

// Abstract base class for pages with sections
export abstract class AssetPageSection extends PageAsset {
  abstract sections(): AssetSection[];

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

  private generateSectionHtml(section: AssetSection): string {
    const openAttr = section.open ? ' open' : '';
    const autoloadAttr = section.autoload ? ' hx-trigger="load"' : '';

    let paramsHtml = '';
    let hasParams = false;

    // Check if the section has parameters
    if (section.params && Object.keys(section.params).length > 0) {
      hasParams = true;
      const paramsJson = JSON.stringify(section.params, null, 2);

      paramsHtml = `
        <div class="section-params" style="margin-bottom: 10px;">
          <label>Parameters:</label>
          <textarea class="params-textarea" name="params-${section.id}" id="params-${section.id}" rows="4" cols="50">${paramsJson}</textarea>
          <button class="load-btn" hx-post="${section.url}"
                  hx-target="#content-${section.id}"
                  hx-include="[name='params-${section.id}']"
                  hx-indicator="#loading-${section.id}">
            Load Section
          </button>
          <div id="loading-${section.id}" class="htmx-indicator">
            Loading...
          </div>
        </div>
      `;
    }

    const contentHtml = hasParams ? `
      <div id="content-${section.id}" class="section-content">
        ${section.autoload ? 'Loading...' : 'Click load to display content'}
      </div>
    ` : `
      <div id="content-${section.id}" class="section-content"${autoloadAttr}
           hx-get="${section.url}" hx-target="this">
        ${section.autoload ? 'Loading...' : 'Click to expand and load content'}
      </div>
    `;

    return `
      <details${openAttr}>
        <summary>${section.title}</summary>
        ${paramsHtml}
        ${contentHtml}
      </details>
    `;
  }
}
