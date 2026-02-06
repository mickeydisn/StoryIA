# Deno Schema Report Interface

A full-screen web interface for exploring database schemas and project files built with Deno, Oak, and HTMX.

## 🚀 Quick Start

### Development with Auto-Reload
```bash
# Auto-reload when files change (recommended for development)
deno task dev:reload

# Alternative: standard dev mode
deno task dev

# Production mode
deno task start
```

### Access the Interface
Open [http://localhost:8000](http://localhost:8000) in your browser.

## 📁 Project Structure

```
deno/
├── deno.json          # Deno configuration and scripts
├── ts/
│   ├── server.ts      # Main Oak web server
│   └── routes.ts      # Route handlers and API endpoints
├── css/
│   └── main.css       # Styles and responsive design
├── planning.md        # Implementation plan and documentation
└── README.md          # This file
```

## 🔧 Development Commands

- `deno task dev` - Run with file watching
- `deno task dev:reload` - Run with file watching and clear screen on reload
- `deno task start` - Production mode

## 🎯 Features

- **Full-Screen Interface**: Takes up entire viewport
- **Right Sidebar**: Menu cards with navigation and file tree
- **Main Content**: Dynamic page loading with HTMX
- **File Tree**: Interactive directory browser with expand/collapse
- **Markdown Viewer**: Render markdown files as HTML
- **Responsive Design**: Works on desktop and mobile

## 🛠️ Tech Stack

- **Runtime**: Deno 1.x
- **Web Framework**: Oak
- **Frontend**: HTMX + Vanilla CSS
- **Markdown**: Marked library
- **Styling**: Modern CSS with gradients and animations

## 📝 Menu Cards

### Navigation Card
- Single Home button for focused navigation

### Files Card
- Interactive tree showing database/ and chapiter/ directories
- Expandable folders and clickable files
- Direct navigation to markdown content

## 🔄 Auto-Reload

The `dev:reload` command provides:
- **File Watching**: Automatically restarts server on code changes
- **Clear Screen**: Cleans terminal output on each reload
- **Fast Development**: Instant feedback during development

Perfect for rapid iteration and testing interface changes!
