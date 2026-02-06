import { Application, Router, Context, Next } from "jsr:@oak/oak";
import { setupRoutes } from "./routes.ts";

const app = new Application();
const router = new Router();

// Setup routes
setupRoutes(router);

// Static file serving middleware
app.use(async (ctx: Context, next: Next) => {
  if (
    ctx.request.url.pathname.startsWith("/css/") ||
    ctx.request.url.pathname.startsWith("/html/")
  ) {
    try {
      const filePath = `.${ctx.request.url.pathname}`;
      const file = await Deno.readFile(filePath);
      const contentType = ctx.request.url.pathname.endsWith(".css")
        ? "text/css"
        : "text/html";
      ctx.response.body = file;
      ctx.response.type = contentType;
    } catch {
      ctx.response.status = 404;
    }
  } else {
    await next();
  }
});

// Use router
app.use(router.routes());
app.use(router.allowedMethods());

console.log("🚀 Server running on http://localhost:8000");
await app.listen({ port: 8000 });
