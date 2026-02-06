---
name: "Short How to Create a New Page with Sections"
summary: "Quick guide for creating new pages with multiple sections using modular asset-based architecture"
params:
  - page_name: "Name of the new page to create"
  - section_count: "Number of sections to include in the page"
---

# How to Create a New Page with Sections

Quick guide for creating new pages with multiple sections using modular asset-based architecture.

## Overview

Create pages with sections using:

1. **Section Assets** - Individual components extending `SectionAsset`
2. **Page Assets** - Container extending `AssetPageSection`
3. **Router Registration** - Register in main routes

## Step 1: Create Section Assets

Create individual section assets that extend `SectionAsset`.

### Example: Create `my_section_asset.ts`

```typescript
import { SectionAsset } from "../../base/asset_base.ts";

export class MySectionAsset extends SectionAsset {
  override url = "/api/my-section";
  title = "📝 My Section";

  override content = async (): Promise<string> => {
    return `
      <div class="my-section markdown-content">
        <h3>Section Title</h3>
        <p>Section content here</p>
      </div>
    `;
  };
}

export const mySectionAsset = new MySectionAsset();
```

**Key Points:**

- Extend `SectionAsset`
- Implement `content()` method returning HTML string
- Export both class and instance
- Use `markdown-content` class for tables

## Step 2: Create Page Asset

Create page asset extending `AssetPageSection`.

### Example: Create `my_page_asset.ts`

```typescript
import { AssetPageSection } from "../../base/asset_page_section.ts";
import { mySectionAsset } from "./my_section_asset.ts";

export class MyPageAsset extends AssetPageSection {
  override url = "/page/my-page";
  title = "📋 My Custom Page";

  sections() {
    return [
      {
        id: "my-section",
        title: "📝 My Section",
        asset: mySectionAsset,
        open: true,
        autoload: true,
      },
    ];
  }
}

export const myPageAsset = new MyPageAsset();
```

**Key Points:**

- Extend `AssetPageSection`
- Implement `sections()` method
- Configure section properties: id, title, asset, open, autoload

## Step 3: Register in Router

Add page asset to main routes.

### Update `main_routes.ts`

```typescript
import { myPageAsset } from "../assets/page/my_page_asset.ts";

const allAssets: BaseAsset[] = [
  // ... existing assets
  myPageAsset,
];
```

## Step 4: Directory Structure

Organize files logically:

```
deno/ts/assets/page/
├── my_page/
│   ├── my_page_asset.ts
│   └── my_section_asset.ts
```

## Step 5: Test the Page

1. Start server: `deno run --allow-all main.ts`
2. Navigate to: `/page/my-page`
3. Verify sections load correctly

## Best Practices

- **Reusability**: Section assets can be reused across pages
- **Performance**: Use `autoload: false` for heavy sections
- **Styling**: Use consistent CSS classes
- **Error Handling**: Implement proper error handling

## Common Patterns

- **Data Tables**: Sections displaying tabular data
- **Forms**: Sections with input forms
- **File Operations**: Sections interacting with file system
- **API Integration**: Sections fetching external data

This pattern provides scalable, maintainable page creation with modular sections.
