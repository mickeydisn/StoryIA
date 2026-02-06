---
name: "How to Add a New Section to an Existing Page"
summary: "Step-by-step guide for extending existing pages with new sections using asset-based architecture"
params:
  - page_name: "Name of the existing page to modify"
  - section_name: "Name of the new section to add"
  - section_type: "Type of section (data, form, settings, etc.)"
---

# How to Add a New Section to an Existing Page

This guide explains how to add a new section to an existing page in the modular asset-based architecture. This pattern allows you to extend pages with additional functionality while maintaining clean separation of concerns.

## Overview

Adding a section to an existing page involves:

1. **Finding the existing page asset** - Locate the page you want to modify
2. **Creating a new section asset** - Build the section component
3. **Adding the section to the page** - Register the section in the page's configuration
4. **Testing the integration** - Verify the section works correctly

## Step 1: Find the Existing Page Asset

Before adding a section, you need to locate the page asset file you want to modify.

### Search for Page Assets

Use the following patterns to find page assets:

```bash
# Find all page asset files
find deno/ts/assets/page -name "*_page_asset.ts" -type f

# Find specific page assets
find deno/ts/assets/page -name "*references*page_asset.ts" -type f
find deno/ts/assets/page -name "*local_agent*page_asset.ts" -type f
```

### Common Page Asset Locations

Page assets are typically located in:

- `deno/ts/assets/page/[page-name]/[page-name]_page_asset.ts`
- `deno/ts/assets/page/[page-name]/page_asset.ts`
- `deno/ts/assets/page/[page-name]/index.ts`

### Example: Finding the Local Agent Page

```bash
# Search for local agent page
find deno/ts/assets/page -name "*local_agent*" -type f
```

Expected output:

```
deno/ts/assets/page/local_agent/local_agent_page_asset.ts
deno/ts/assets/page/local_agent/my_local_agent_section_asset.ts
```

### Verify Page Asset Structure

Once you find the page asset, verify it extends `AssetPageSection`:

```typescript
// Valid page asset structure
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

**Error Handling**: If the page asset doesn't extend `AssetPageSection`, you cannot add sections to it. Consider creating a new page asset instead.

## Step 2: Create the New Section Asset

Create a new section asset that extends `SectionAsset`.

### Example: Create `new_section_asset.ts`

```typescript
import { SectionAsset } from "../../base/asset_base.ts";

export class NewSectionAsset extends SectionAsset {
  override url = "/api/new-section"; // API endpoint for this section

  title = "🆕 New Section"; // Section title with emoji

  override content = async (): Promise<string> => {
    return `
      <div class="new-section markdown-content">
        <h3>New Section Title</h3>
        <p>This is the content for the new section.</p>
        
        <!-- Your section content here -->
        <div class="section-content">
          <!-- Add your HTML content -->
        </div>
      </div>
    `;
  };
}

export const newSectionAsset = new NewSectionAsset();
```

**Key Points:**

- Extend `SectionAsset` (not `PageAsset`)
- Implement `content()` method that returns HTML string
- Export both the class and an instance
- Use `markdown-content` class for better styling if displaying tables or complex content
- Choose an appropriate emoji for the title

### Section Asset Best Practices

- **Naming**: Use descriptive names like `userManagementSectionAsset` or `analyticsSectionAsset`
- **URL**: Use a unique API endpoint that doesn't conflict with existing sections
- **Content**: Keep section content focused and self-contained
- **Styling**: Use consistent CSS classes for visual harmony

## Step 3: Add Section to Existing Page

Import the new section asset and add it to the page's `sections()` method.

### Example: Adding to Local Agent Page

```typescript
// Add import at top of local_agent_page_asset.ts
import { newSectionAsset } from "./new_section_asset.ts";

// Add to sections() method
sections() {
  return [
    {
      id: "my-local-agent",
      title: "🐱 My Local Agent",
      asset: myLocalAgentSectionAsset,
      open: true,
      autoload: true
    },
    // Add new section here
    {
      id: "new-section",
      title: "🆕 New Section",
      asset: newSectionAsset,
      open: false,        // Start collapsed for new sections
      autoload: false     // Load on demand for better performance
    }
  ];
}
```

### Section Configuration Options

```typescript
{
  id: "unique-section-id",           // Required: Unique identifier
  title: "Section Title",            // Required: Display title
  asset: sectionAssetInstance,       // Required: The section asset
  open: true|false,                  // Optional: Start expanded/collapsed
  autoload: true|false               // Optional: Load immediately/on-demand
}
```

**Configuration Guidelines:**

- **`id`**: Use kebab-case for consistency (e.g., "user-management", "analytics-dashboard")
- **`title`**: Include relevant emoji for visual recognition
- **`open`**: Set to `false` for new sections to avoid overwhelming users
- **`autoload`**: Set to `false` for performance, especially for heavy sections

## Step 4: Verify Page Registration

Ensure the page asset is registered in the main routes.

### Check Main Routes

```typescript
// In deno/ts/routes/main_routes.ts
import { localAgentPageAsset } from "../assets/page/local_agent/local_agent_page_asset.ts";

const allAssets: BaseAsset[] = [
  // ... other assets
  localAgentPageAsset, // Must be included here
];
```

**Error Handling**: If the page asset is not in the `allAssets` array, the page won't be accessible. Add it to the array and restart the server.

## Step 5: Test the Integration

Verify that your new section works correctly.

### Manual Testing

1. **Start the server**: `deno run --allow-all main.ts`
2. **Navigate to the page**: Visit `/page/[page-name]` in your browser
3. **Check section visibility**: Verify the new section appears in the page
4. **Test section interaction**: Click the section header to expand/collapse
5. **Verify content loading**: Check that content loads correctly (immediately or on-demand)

### Browser Developer Tools

1. **Network tab**: Monitor HTMX requests when section loads
2. **Console tab**: Check for JavaScript errors
3. **Elements tab**: Verify HTML structure is correct

### Common Issues and Solutions

| Issue                  | Solution                                                    |
| ---------------------- | ----------------------------------------------------------- |
| Section doesn't appear | Verify page asset extends `AssetPageSection`                |
| Content doesn't load   | Check section asset `content()` method implementation       |
| HTMX errors            | Verify section asset URL is unique and accessible           |
| Styling issues         | Ensure `markdown-content` class is used for complex content |

## Step 6: Error Handling and Troubleshooting

### Page Asset Not Found

**Error Message**: "Page asset not found in expected location"

**Solution**:

1. Search for the page using different patterns
2. Check if the page uses a different naming convention
3. Verify the page exists in the application

```bash
# Search with different patterns
find deno/ts/assets/page -name "*[page-name]*" -type f
grep -r "AssetPageSection" deno/ts/assets/page/
```

### Page Asset Doesn't Extend AssetPageSection

**Error Message**: "Cannot add sections to this page asset"

**Solution**:

- The page asset extends a different base class (e.g., `PageAsset`)
- Consider creating a new page asset that extends `AssetPageSection`
- Or modify the existing page to use the section-based architecture

### Section Asset Registration Issues

**Error Message**: "Section not loading or displaying"

**Solution**:

1. Verify section asset is properly exported
2. Check import statement in page asset file
3. Ensure section configuration is correct in `sections()` method
4. Verify section asset URL doesn't conflict with existing assets

## Complete Example

### Adding a "Settings" Section to Local Agent Page

#### 1. Create `settings_section_asset.ts`

```typescript
import { SectionAsset } from "../../base/asset_base.ts";

export class SettingsSectionAsset extends SectionAsset {
  override url = "/api/settings-section";

  title = "⚙️ Settings";

  override content = async (): Promise<string> => {
    return `
      <div class="settings-section markdown-content">
        <h3>Agent Settings</h3>
        <div class="settings-form">
          <div class="setting-item">
            <label>Notification Preferences</label>
            <select>
              <option>Immediate</option>
              <option>Daily Summary</option>
              <option>Weekly Summary</option>
            </select>
          </div>
          <div class="setting-item">
            <label>Auto-save Interval</label>
            <input type="number" value="5" min="1" max="60">
            <span>minutes</span>
          </div>
        </div>
      </div>
    `;
  };
}

export const settingsSectionAsset = new SettingsSectionAsset();
```

#### 2. Update `local_agent_page_asset.ts`

```typescript
import { settingsSectionAsset } from "./settings_section_asset.ts";

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
      id: "settings",
      title: "⚙️ Settings",
      asset: settingsSectionAsset,
      open: false,
      autoload: false
    }
  ];
}
```

#### 3. Test the Integration

1. Start server: `deno run --allow-all main.ts`
2. Visit: `/page/local-agent`
3. Verify "⚙️ Settings" section appears
4. Test expanding/collapsing and content loading

## Best Practices

### Section Organization

- **Logical Grouping**: Group related functionality in sections
- **Consistent Naming**: Use consistent naming patterns for section IDs
- **Progressive Disclosure**: Use `open: false` for secondary sections
- **Performance**: Use `autoload: false` for heavy or infrequently accessed sections

### Content Structure

- **Focused Content**: Each section should have a clear, focused purpose
- **Consistent Styling**: Use consistent CSS classes and styling patterns
- **Accessibility**: Ensure content is accessible and keyboard-navigable
- **Error Handling**: Implement proper error handling in section content

### Maintenance

- **Documentation**: Document the purpose and functionality of each section
- **Testing**: Test sections individually and as part of the page
- **Performance Monitoring**: Monitor section load times and optimize as needed
- **User Feedback**: Gather feedback on section usefulness and usability

## Common Patterns

- **Configuration Sections**: Settings, preferences, options
- **Data Display Sections**: Tables, charts, reports
- **Interactive Sections**: Forms, controls, dashboards
- **Informational Sections**: Help, documentation, status

This approach allows you to extend existing pages with new functionality while maintaining the modular, maintainable architecture of the application.
