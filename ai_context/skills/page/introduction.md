# Page Management Skills - Introduction

Welcome to the Page Management Skills documentation. This collection provides
comprehensive guides for building, organizing, and maintaining pages within the
modular asset-based architecture.

## Overview

This documentation covers everything you need to know about managing pages and
sections in the application, from creating new pages to testing navigation
menus.

---

## Available Guides

### 1. Creating Pages and Sections

| Guide                                                                        | Purpose                      | Key Topics                                                          |
| ---------------------------------------------------------------------------- | ---------------------------- | ------------------------------------------------------------------- |
| **[How to Create a New Page with Sections](_how_to_create_page.md)**         | Build new pages from scratch | Section assets, Page assets, Router registration, Navigation setup  |
| **[How to Add a New Section to an Existing Page](_how_to_add_a_section.md)** | Extend existing pages        | Finding page assets, Creating section assets, Registration, Testing |
| **[How to Edit a Section](_how_to_edit_a_section.md)**                       | Modify existing sections     | Content updates, Load methods, Parameters, Configuration            |

### 2. Organization and Structure

| Guide                                                                 | Purpose                     | Key Topics                                           |
| --------------------------------------------------------------------- | --------------------------- | ---------------------------------------------------- |
| **[How to Order Pages and Sections](_how_to_order_pages_section.md)** | Organize page content       | Section ordering, Removal strategies, Page structure |
| **[How to Order Navigation Menu](_how_to_order_navigation_menu.md)**  | Manage navigation structure | Menu organization, Reordering, Adding/removing pages |

### 3. Testing and Quality Assurance

| Guide                                                              | Purpose                 | Key Topics                                                       |
| ------------------------------------------------------------------ | ----------------------- | ---------------------------------------------------------------- |
| **[How to Test Navigation Menu](_how_to_test_navigation_menu.md)** | Ensure navigation works | Functionality testing, Performance, Accessibility, Cross-browser |

---

## Architecture Overview

The page management system uses a modular asset-based architecture with three
main components:

### 1. Section Assets

Individual content components that extend `SectionAsset`. Each section focuses
on a specific functionality and can be reused across different pages.

```typescript
export class MySectionAsset extends SectionAsset {
  override url = "/api/my-section";

  override content = async (): Promise<string> => {
    return `<div class="my-section">Content here</div>`;
  };
}
```

### 2. Page Assets

Container components that extend `AssetPageSection` and combine multiple
sections into a cohesive page.

```typescript
export class MyPageAsset extends AssetPageSection {
  override url = "/page/my-page";
  title = "📋 My Page";

  sections() {
    return [
      {
        id: "section-1",
        title: "Section 1",
        asset: section1Asset,
        open: true,
        autoload: true,
      },
      {
        id: "section-2",
        title: "Section 2",
        asset: section2Asset,
        open: false,
        autoload: false,
      },
    ];
  }
}
```

### 3. Navigation Menu

The navigation menu provides access to all pages using HTMX for dynamic content
loading.

```typescript
override content = `
<nav class="sidebar-nav">
    <button class="nav-button" hx-get="/page/home" hx-target="#page-content">🏠 Home</button>
    <button class="nav-button" hx-get="/page/my-page" hx-target="#page-content">📋 My Page</button>
</nav>
`;
```

---

## Quick Reference

### Common File Locations

| Component       | Typical Location                                                  |
| --------------- | ----------------------------------------------------------------- |
| Page Assets     | `deno/ts/assets/page/[page-name]/[page-name]_page_asset.ts`       |
| Section Assets  | `deno/ts/assets/page/[page-name]/[section-name]_section_asset.ts` |
| Navigation Menu | `deno/ts/assets/menu/navigation_menu_asset.ts`                    |
| Main Routes     | `deno/ts/routes/main_routes.ts`                                   |

### Section Configuration Options

```typescript
{
  id: "unique-section-id",     // Unique identifier
  title: "Section Title",      // Display title (can include emoji)
  asset: sectionAssetInstance, // The section asset
  open: true|false,            // Start expanded/collapsed
  autoload: true|false         // Load immediately/on-demand
}
```

### Common Commands

```bash
# Find page assets
find deno/ts/assets/page -name "*_page_asset.ts" -type f

# Find section assets
find deno/ts/assets/page -name "*_section_asset.ts" -type f

# Start the server
deno run --allow-all main.ts

# Test a page
curl -s "http://localhost:8000/page/my-page"
```

---

## Best Practices

### Content Creation

- **Use emoji icons** in titles for visual recognition
- **Apply `markdown-content` class** for tables and complex layouts
- **Keep sections focused** on a single purpose
- **Implement error handling** in content methods

### Organization

- **Group related sections** together logically
- **Order by frequency of use** - most used first
- **Use lazy loading** (`autoload: false`) for heavy content
- **Maintain consistent naming** with kebab-case IDs

### Performance

- **Set `autoload: false`** for heavy or infrequently accessed sections
- **Use `open: false`** for secondary sections
- **Monitor load times** and optimize as needed
- **Implement caching** where appropriate

### Testing

- **Test all navigation links** after making changes
- **Verify HTMX integration** works correctly
- **Check mobile responsiveness**
- **Validate accessibility** (keyboard navigation, screen readers)

---

## Workflow Examples

### Creating a New Page

1. Create section assets for page content
2. Create page asset combining sections
3. Register page in `main_routes.ts`
4. Add to navigation menu
5. Test the complete flow

### Adding a Section to Existing Page

1. Locate the target page asset
2. Create new section asset
3. Add section to page's `sections()` method
4. Test integration

### Reorganizing Navigation

1. Review current navigation structure
2. Plan new organization (by priority, workflow, or role)
3. Update `navigation_menu_asset.ts`
4. Test all navigation links
5. Communicate changes to users

---

## Troubleshooting

| Issue                  | Quick Solution                                |
| ---------------------- | --------------------------------------------- |
| Section doesn't appear | Verify page asset extends `AssetPageSection`  |
| Page not accessible    | Check page is registered in `main_routes.ts`  |
| Content doesn't load   | Verify section URL is unique and accessible   |
| HTMX errors            | Check `hx-get` URLs and `hx-target` selectors |
| Slow loading           | Use `autoload: false` for heavy sections      |

---

## Additional Resources

- **Base Classes**: `deno/ts/assets/base/asset_base.ts`,
  `deno/ts/assets/base/asset_page_section.ts`
- **Example Pages**: Check `deno/ts/assets/page/local_agent/` for a complete
  example
- **Navigation**: See `deno/ts/assets/menu/navigation_menu_asset.ts` for menu
  implementation

---

## Summary

This documentation provides a complete toolkit for managing pages in the
application:

- **Create** new pages and sections using modular assets
- **Edit** existing content with flexible configuration options
- **Organize** pages and sections for optimal user experience
- **Test** thoroughly to ensure quality and reliability

Each guide includes step-by-step instructions, code examples, best practices,
and troubleshooting tips to help you build and maintain high-quality pages.

---

_Last updated: Generated from skill documentation files_
