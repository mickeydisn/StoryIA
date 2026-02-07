import { Router, Context } from "oak";
import { setupMainRoutes } from "./routes/main_routes.ts";

export function setupRoutes(router: Router) {
  // Setup main page routes (includes all asset-based routes including menu cards)
  setupMainRoutes(router);

  // Main app layout - root HTML page
  router.get("/", async (ctx: Context) => {
    ctx.response.type = "text/html";
    ctx.response.body = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Schema Report Interface</title>
    <script src="https://unpkg.com/htmx.org@1.9.10"></script>
    <!-- HTMX Config for POST/JSON support -->
    <script>
    // Configure HTMX to use POST by default and send JSON
    document.addEventListener('htmx:configRequest', function(evt) {
      // Convert hx-vals to JSON body for POST requests
      if (evt.detail.verb === 'post') {
        evt.detail.headers['Content-Type'] = 'application/json';
        // If there are parameters, send as JSON body
        if (evt.detail.parameters && Object.keys(evt.detail.parameters).length > 0) {
          evt.detail.body = JSON.stringify(evt.detail.parameters);
          // Clear the parameters to prevent URL encoding
          evt.detail.parameters = {};
        }
      }
    });
    
    // Helper function for programmatic POST requests with JSON
    window.postJson = function(url, data, target) {
      return fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'HX-Request': 'true'
        },
        body: JSON.stringify(data)
      })
      .then(response => response.text())
      .then(html => {
        if (target) {
          const element = typeof target === 'string' ? document.getElementById(target) : target;
          if (element) {
            element.innerHTML = html;
            // Trigger htmx:load event for any nested HTMX
            htmx.trigger(element, 'htmx:load');
          }
        }
        return html;
      });
    };
    </script>
    <!-- Syntax highlighting for code blocks -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/typescript.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/yaml.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/json.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/bash.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/python.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/css.min.js"></script>
    <link rel="stylesheet" href="/css/main.css">
</head>
<body>
    <div class="app-container">
        <!-- Right Sidebar Menu -->
        <aside class="right-sidebar">
            <div class="sidebar-content">
                <!-- Menu cards will be loaded here -->
                <div id="menu-cards" hx-post="/menu/cards" hx-trigger="load" hx-target="#menu-cards">
                    <div class="loading">Loading menu...</div>
                </div>
            </div>
        </aside>

        <!-- Main Content Area -->
        <main class="main-content">
            <div id="page-content" hx-post="/page/home" hx-trigger="load" hx-target="#page-content">
                <div class="loading">Loading content...</div>
            </div>
        </main>
    </div>
</body>
</html>
    `;
  });
}
