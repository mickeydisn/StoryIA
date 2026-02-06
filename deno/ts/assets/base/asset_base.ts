import { RouterContext } from "oak";

// Base parameter interface
export interface TAssetParam {}

// Base Asset class for inheritance
export abstract class BaseAsset<T extends TAssetParam = TAssetParam> {
  abstract url: string;
  abstract requestType: string;
  params?: T;

  getHandler(): (ctx: RouterContext<any>) => Promise<void> {
    return async (ctx: RouterContext<any>) => {
      // Populate typed parameters for generic assets
      // This provides type-safe parameter access in asset implementations
      this.params = ctx.params as unknown as T;

      // Delegate to subclass implementation
      await this.handleRequest(ctx);
    };
  }

  protected abstract handleRequest(ctx: RouterContext<any>): Promise<void>;
}

// Utility function to help implement BaseAsset for non-page assets
export function implementBaseAsset<T extends new (...args: any[]) => any>(
  constructor: T,
  url: string,
  requestType: string = "GET"
) {
  return class extends constructor {
    url = url;
    requestType = requestType;
  };
}

// Section Asset class - provides basic content generation without HTML wrapper
export abstract class SectionAsset<T extends TAssetParam = TAssetParam> extends BaseAsset<T> {
  abstract override url: string;
  abstract title: string | ((params: Record<string, any>) => string);
  content: string | ((params: Record<string, any>) => Promise<string>) | (() => Promise<string>) = "";

  requestType = "GET";

  protected async handleRequest(ctx: RouterContext<any>): Promise<void> {
    ctx.response.type = "text/html";

    // Handle title generation
    const title = typeof this.title === 'function' ? this.title(ctx.params) : this.title;

    // Handle content generation with or without params
    let content: string;
    if (typeof this.content === 'function') {
      // Check if content function expects params
      if (this.content.length > 0) {
        // Function expects params, pass them
        content = await (this.content as (params: Record<string, any>) => Promise<string>)(ctx.params);
      } else {
        // Function doesn't expect params
        content = await (this.content as () => Promise<string>)();
      }
    } else {
      content = this.content;
    }

    ctx.response.body = this.generateResponse(title, content);
  }

  protected generateResponse(title: string, content: string): string {
    return content;
  }
}

// HTML Page Asset class
export abstract class PageAsset extends SectionAsset {
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
    `;
  }
}

// Menu Card Asset class
export abstract class MenuCardAsset extends SectionAsset {
  protected override generateResponse(title: string, content: string): string {
    return `
<div class="menu-card-header">
    <h3>${title}</h3>
</div>
<div class="menu-card-content">
    ${content}
</div>
    `;
  }
}

// Make sure all abstract properties in BaseAsset have override modifiers when implemented

// API Asset class for JSON responses
export class ApiAsset extends BaseAsset {
  url: string;
  requestType: string;
  data: any | ((ctx: RouterContext<any>) => Promise<any>);

  constructor(url: string, data: any | ((ctx: RouterContext<any>) => Promise<any>)) {
    super();
    this.url = url;
    this.requestType = "GET";
    this.data = data;
  }

  protected async handleRequest(ctx: RouterContext<any>): Promise<void> {
    ctx.response.type = "application/json";
    const data = typeof this.data === 'function' ? await this.data(ctx) : this.data;
    ctx.response.body = data;
  }
}
