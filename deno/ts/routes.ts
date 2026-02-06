import { Router } from "oak";
import { setupMainRoutes } from "./routes/main_routes.ts";

export function setupRoutes(router: Router) {
  // Setup main page routes (includes all asset-based routes including menu cards)
  setupMainRoutes(router);

  // Main app layout - root HTML page
  router.get("/", async (ctx) => {
    ctx.response.type = "text/html";
    ctx.response.body = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Schema Report Interface</title>
    <script src="https://unpkg.com/htmx.org@1.9.10"></script>
    <link rel="stylesheet" href="/css/main.css">
</head>
<body>
    <div class="app-container">
        <!-- Right Sidebar Menu -->
        <aside class="right-sidebar">
            <div class="sidebar-content">
                <!-- Menu cards will be loaded here -->
                <div id="menu-cards" hx-get="/menu/cards" hx-trigger="load" hx-target="#menu-cards">
                    <div class="loading">Loading menu...</div>
                </div>
            </div>
        </aside>

        <!-- Main Content Area -->
        <main class="main-content">
            <div id="page-content" hx-get="/page/home" hx-trigger="load" hx-target="#page-content">
                <div class="loading">Loading content...</div>
            </div>
        </main>
    </div>
</body>
</html>
    `;
  });
}
