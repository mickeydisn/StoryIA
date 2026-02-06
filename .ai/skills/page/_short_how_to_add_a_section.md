---
name: "Short How to Add a New Section to an Existing Page"
summary: "Quick guide for extending existing pages with new sections using asset-based architecture"
params:
  - page_name: "Name of the existing page to modify"
  - section_name: "Name of the new section to add"
---

# How to Add a New Section to an Existing Page

Quick guide for extending existing pages with new sections using asset-based architecture.

## Overview

Adding a section involves:

1. **Find existing page asset** - Locate the page to modify
2. **Create new section asset** - Build the section component
3. **Add section to page** - Register in page configuration
4. **Test integration** - Verify section works correctly

## Step 1: Find Existing Page Asset

Locate the page asset file to modify.

### Search for Page Assets

```bash
# Find all page asset files
find deno/ts/assets/page -name "*_page_asset.ts" -type f

# Find specific page assets
find deno/ts/assets/page -name "*local_agent*page_asset.ts" -type f
```

### Verify Page Asset Structure

Ensure page extends `AssetPageSection`:

```typescript
export class LocalAgentPageAsset extends AssetPageSection {
  override url = "/page/local-agent";
  title = "🤖 Local Agent Dashboard";

  sections() {
    return [
      // Existing sections here
    ];
  }
}
```

**Error Handling**: If page doesn't extend `AssetPageSection`, cannot add sections.

## Step 2: Create New Section Asset

Create section asset extending `SectionAsset`.

### Example: Create `new_section_asset.ts`

```typescript
import { SectionAsset } from "../../base/asset_base.ts";

export class NewSectionAsset extends SectionAsset {
  override url = "/api/new-section";
  title = "🆕 New Section";

  override content = async (): Promise<string> => {
    return `
      <div class="new-section markdown-content">
        <h3>New Section Title</h3>
        <p>Section content here</p>
      </div>
    `;
  };
}

export const newSectionAsset = new NewSectionAsset();
```

**Key Points:**

- Extend `SectionAsset`
- Implement `content()` method
- Export both class and instance
- Use `markdown-content` class for tables

## Step 3: Add Section to Page

Import and add section to page's `sections()` method.

### Example: Adding to Local Agent Page

```typescript
import { newSectionAsset } from "./new_section_asset.ts";

sections() {
  return [
    {
      id: "my-local-agent",
      title: "🐱 My Local Agent",
      asset: myLocalAgentSectionAsset,
      open: true,
      autoload: true
    },
    {
      id: "new-section",
      title: "🆕 New Section",
      asset: newSectionAsset,
      open: false,
      autoload: false
    }
  ];
}
```

### Section Configuration

```typescript
{
  id: "unique-section-id",           // Required: Unique identifier
  title: "Section Title",            // Required: Display title
  asset: sectionAssetInstance,       // Required: The section asset
  open: true|false,                  // Optional: Start expanded/collapsed
  autoload: true|false               // Optional: Load immediately/on-demand
}
```

## Step 4: Verify Page Registration

Ensure page asset is registered in main routes.

### Check Main Routes

```typescript
import { localAgentPageAsset } from "../assets/page/local_agent/local_agent_page_asset.ts";

const allAssets: BaseAsset[] = [
  // ... other assets
  localAgentPageAsset, // Must be included here
];
```

**Error Handling**: If page asset not in `allAssets`, page won't be accessible.

## Step 5: Test Integration

Verify section works correctly.

### Manual Testing

1. Start server: `deno run --allow-all main.ts`
2. Navigate to page: `/page/[page-name]`
3. Check section visibility and interaction
4. Verify content loading

### Common Issues

| Issue                  | Solution                               |
| ---------------------- | -------------------------------------- |
| Section doesn't appear | Verify page extends `AssetPageSection` |
| Content doesn't load   | Check section `content()` method       |
| HTMX errors            | Verify section URL is unique           |

## Best Practices

- **Naming**: Use descriptive section IDs
- **Performance**: Use `autoload: false` for heavy sections
- **Styling**: Use consistent CSS classes
- **Testing**: Test sections individually and in page context

## Quick Checklist

- [ ] Find existing page asset
- [ ] Create new section asset
- [ ] Import section in page asset
- [ ] Add section to `sections()` method
- [ ] Verify page registration
- [ ] Test section functionality

This approach extends existing pages with new functionality while maintaining modular architecture.
