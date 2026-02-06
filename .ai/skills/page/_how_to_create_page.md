---
name: "How to Create a New Page with Sections"
summary: "Complete guide for creating new pages with multiple sections using modular asset-based architecture"
params:
  - page_name: "Name of the new page to create"
  - section_count: "Number of sections to include in the page"
  - section_types: "Types of sections (data, forms, charts, etc.)"
---

# How to Create a New Page with Sections

This guide explains how to create a new page with multiple sections, similar to the References page we just built. The pattern uses a modular asset-based architecture where each section is a separate asset that can be reused and tested independently.

## Overview

Pages with sections use three main components:

1. **Section Assets**: Individual components that extend `SectionAsset`
2. **Page Assets**: Container that extends `AssetPageSection` and combines sections
3. **Router Registration**: Register the page asset in the main routes

## Step 1: Create Section Assets

Create individual section assets that extend `SectionAsset`. Each section should focus on a specific functionality.

### Example: Create `my_section_asset.ts`

```typescript
import { SectionAsset } from "../../base/asset_base.ts";

export class MySectionAsset extends SectionAsset {
  override url = "/api/my-section"; // API endpoint for this section

  override content = async (): Promise<string> => {
    // Return HTML content for this section
    return `
      <div class="my-section">
        <h3>My Section Title</h3>
        <p>Section content goes here</p>
        <!-- Your section HTML here -->
      </div>
    `;
  };
}

export const mySectionAsset = new MySectionAsset();
```

**Key Points:**

- Extend `SectionAsset` (not `PageAsset`)
- Implement `content()` method that returns HTML string
- Export both the class and an instance
- The `url` is used for AJAX requests (HTMX integration)

## Step 2: Create the Page Asset

Create a page asset that extends `AssetPageSection` to combine multiple sections.

### Example: Create `my_page_asset.ts`

```typescript
import { AssetPageSection } from "../../base/asset_page_section.ts";
import { mySectionAsset } from "./my_section_asset.ts";
import { anotherSectionAsset } from "./another_section_asset.ts";

export class MyPageAsset extends AssetPageSection {
  override url = "/page/my-page"; // Main page URL

  title = "📋 My Custom Page"; // Page title with emoji

  sections() {
    return [
      {
        id: "my-section",
        title: "📝 My Section",
        asset: mySectionAsset,
        open: true, // Section starts expanded
        autoload: true, // Load content immediately
      },
      {
        id: "another-section",
        title: "🔧 Another Section",
        asset: anotherSectionAsset,
        open: false, // Section starts collapsed
        autoload: false, // Load content on demand
      },
    ];
  }
}

export const myPageAsset = new MyPageAsset();
```

**Key Points:**

- Extend `AssetPageSection`
- Implement `sections()` method returning array of section configurations
- Each section config includes:
  - `id`: Unique identifier
  - `title`: Display title
  - `asset`: The section asset instance
  - `open`: Whether section starts expanded
  - `autoload`: Whether to load content immediately

## Step 3: Register in Router

Add your page asset to the main routes file.

### Update `main_routes.ts`

```typescript
// Add import at top
import { myPageAsset } from "../assets/page/my_page_asset.ts";

// Add to allAssets array
const allAssets: BaseAsset[] = [
  // ... existing assets
  myPageAsset, // Add your new page asset
];
```

**Key Points:**

- Import your page asset
- Add it to the `allAssets` array
- The router automatically registers GET routes for all assets

## Step 4: Apply Markdown Content Styling

For sections that display tabular data or complex markdown content, add the `markdown-content` CSS class to improve table appearance and readability.

### Styling Configuration

```typescript
override content = async (): Promise<string> => {
  // Generate your markdown content with tables
  const content = generateMarkdownContent();

  // Add markdown-content class for better styling
  return `<div class="my-section-content markdown-content">${await markdownToHtml(content)}</div>`;
};
```

### Styling Benefits

The `markdown-content` class provides:

- **Professional table styling** with borders, padding, and background colors
- **Improved readability** with proper text contrast and spacing
- **Consistent appearance** matching the application's dark theme
- **Responsive design** that works across different screen sizes

## Step 5: Configure Card Navigation

The `AssetPageSection` automatically provides card-based navigation between sections. Each section becomes an expandable card that users can open/close and navigate between.

### Card Navigation Configuration

```typescript
sections() {
  return [
    {
      id: "my-section",          // Unique identifier for navigation
      title: "📝 My Section",    // Display title with emoji
      asset: mySectionAsset,     // The section asset
      open: true,                // true = card starts expanded
      autoload: true             // true = load content immediately
    }
  ];
}
```

**Card Navigation Properties:**

- **`id`**: Unique identifier for the card (used for HTML IDs and navigation)
- **`title`**: Display title shown on the card header
- **`asset`**: The `SectionAsset` instance that provides content
- **`open`**: Whether the card starts in expanded state
- **`autoload`**: Whether to load content when page loads (vs on-demand)

### Navigation Behavior

- **Card Headers**: Click headers to expand/collapse cards
- **Auto-loading**: Cards with `autoload: true` load content immediately
- **Lazy Loading**: Cards with `autoload: false` load content when first opened
- **State Management**: Card states are maintained during navigation
- **HTMX Integration**: Content loads via AJAX for dynamic updates

### Navigation Tips

- Use descriptive `id` values for better debugging
- Set `open: true` for primary sections users need immediately
- Use `autoload: false` for heavy or secondary content
- Include relevant emojis in titles for visual navigation cues
- Keep section titles concise but descriptive

## Step 6: Add Navigation Menu (Optional)

If you want the page accessible from the main navigation menu.

### Update `navigation_menu_asset.ts`

```typescript
// Add to navigation items
const navigationItems = [
  // ... existing items
  {
    title: "My Page",
    url: "/page/my-page",
    icon: "📋",
  },
];
```

### Example: Adding Navigation Button

```typescript
// Update the content in navigation_menu_asset.ts
override content = `
<nav class="sidebar-nav">
    ...
    <button class="nav-button" hx-get="/page/my-page" hx-target="#page-content">📋 My Page</button>
</nav>
  `;
```

**Key Points:**

- Use `hx-get` attribute for HTMX integration
- Set `hx-target="#page-content"` to load content in main area
- Include appropriate emoji icon for visual recognition
- Place button in logical order within the navigation

## Step 7: Directory Structure

Organize your files in a logical directory structure:

```
deno/ts/assets/page/
├── my_page/                    # Directory for your page
│   ├── my_page_asset.ts       # Main page asset
│   ├── my_section_asset.ts    # Individual section assets
│   └── another_section_asset.ts
├── shared/                    # Shared utilities if needed
│   ├── my_utils.ts
│   └── my_types.ts
```

## Complete Example

Here's a complete minimal example:

### `deno/ts/assets/page/example/example_page_asset.ts`

```typescript
import { AssetPageSection } from "../../base/asset_page_section.ts";
import { exampleSectionAsset } from "./example_section_asset.ts";

export class ExamplePageAsset extends AssetPageSection {
  override url = "/page/example";
  title = "🎯 Example Page";

  sections() {
    return [
      {
        id: "example-section",
        title: "📖 Example Section",
        asset: exampleSectionAsset,
        open: true,
        autoload: true,
      },
    ];
  }
}

export const examplePageAsset = new ExamplePageAsset();
```

### `deno/ts/assets/page/example/example_section_asset.ts`

```typescript
import { SectionAsset } from "../../base/asset_base.ts";

export class ExampleSectionAsset extends SectionAsset {
  override url = "/api/example-section";

  override content = async (): Promise<string> => {
    return `
      <div class="example-section">
        <h4>Example Content</h4>
        <p>This is an example section.</p>
        <ul>
          <li>Point 1</li>
          <li>Point 2</li>
        </ul>
      </div>
    `;
  };
}

export const exampleSectionAsset = new ExampleSectionAsset();
```

### Update `main_routes.ts`

```typescript
import { examplePageAsset } from "../assets/page/example/example_page_asset.ts";

// Add to allAssets
const allAssets: BaseAsset[] = [
  // ... other assets
  examplePageAsset,
];
```

## Testing

1. Start your Deno server: `deno run --allow-all main.ts`
2. Navigate to `/page/example` in your browser
3. Verify sections load correctly
4. Check HTMX requests in browser dev tools

## Tips

- **Reusability**: Section assets can be reused across different pages
- **Performance**: Use `autoload: false` for heavy sections
- **Styling**: Use consistent CSS classes for styling
- **Error Handling**: Implement proper error handling in `content()` methods
- **Types**: Use TypeScript interfaces for complex data structures

## Common Patterns

- **Data Tables**: Sections that display tabular data
- **Forms**: Sections with input forms and submission handling
- **File Operations**: Sections that interact with the file system
- **API Integration**: Sections that fetch external data
- **Charts/Visualizations**: Sections with data visualizations

This pattern provides a scalable, maintainable way to build complex pages with multiple interactive sections.
