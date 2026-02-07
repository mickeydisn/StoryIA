import { RouterContext } from "oak";

// Base parameter interface
export interface TAssetParam {}

// Helper to parse POST body
async function parsePostBody(ctx: RouterContext<any>): Promise<any> {
  const contentType = ctx.request.headers.get("content-type") || "";
  
  if (contentType.includes("application/json")) {
    try {
      const body = await ctx.request.body.json();
      return body || {};
    } catch {
      return {};
    }
  }
  
  return {};
}

// Base Asset class for inheritance
export abstract class BaseAsset<T extends TAssetParam = TAssetParam> {
  abstract url: string;
  requestType: "GET" | "POST" = "POST";
  params?: T;

  getHandler(): (ctx: RouterContext<any>) => Promise<void> {
    return async (ctx: RouterContext<any>) => {
      // For POST requests, parse the body and merge with URL params
      if (this.requestType === "POST") {
        const body = await parsePostBody(ctx);
        // Merge URL params with body params (body takes precedence)
        this.params = { ...ctx.params, ...body } as unknown as T;
      } else {
        // For backward compatibility with GET
        this.params = ctx.params as unknown as T;
      }

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
  requestType: "GET" | "POST" = "POST"
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

  override requestType: "GET" | "POST" = "POST";

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
  override requestType: "GET" | "POST" = "POST";
  data: any | ((ctx: RouterContext<any>) => Promise<any>);

  constructor(url: string, data: any | ((ctx: RouterContext<any>) => Promise<any>)) {
    super();
    this.url = url;
    this.requestType = "POST";
    this.data = data;
  }

  protected async handleRequest(ctx: RouterContext<any>): Promise<void> {
    ctx.response.type = "application/json";
    const data = typeof this.data === 'function' ? await this.data(ctx) : this.data;
    ctx.response.body = data;
  }
}
