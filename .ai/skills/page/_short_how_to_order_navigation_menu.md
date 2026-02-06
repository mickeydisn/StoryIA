---
name: "Short How to Order Navigation Menu"
summary: "Quick guide for organizing, reordering, and managing pages in the navigation menu"
params:
  - menu_items: "List of menu items to organize"
  - page_order: "Desired order of pages in navigation"
---

# How to Order Navigation Menu

Quick guide for organizing, reordering, and managing pages in the navigation menu.

## Overview

Managing navigation involves:

1. **Understanding menu structure** - How navigation items are organized
2. **Reordering menu items** - Changing sequence in navigation
3. **Adding pages to navigation** - Including new pages
4. **Removing pages from navigation** - Safely removing pages
5. **Organizing layout** - Best practices for arrangement
6. **Testing changes** - Verifying organization works

## Step 1: Understand Navigation Structure

Navigation menu is defined in `navigation_menu_asset.ts` with HTMX integration.

### Default Navigation Structure

```typescript
export class NavigationMenuAsset extends MenuCardAsset {
  url = "/menu/navigation";
  title = "🧭 Navigation";

  override content = `
<nav class="sidebar-nav">
    <button class="nav-button" hx-get="/page/home" hx-target="#page-content">🏠 Home</button>
    <button class="nav-button" hx-get="/page/section-files" hx-target="#page-content">📁 File Sections</button>
    <button class="nav-button" hx-get="/page/references" hx-target="#page-content">📊 References</button>
    <button class="nav-button" hx-get="/page/references2" hx-target="#page-content">📊 References v2</button>
    <button class="nav-button" hx-get="/page/local-agent" hx-target="#page-content">🤖 Local Agent</button>
</nav>
  `;
}
```

**Navigation Behavior:**

- HTMX integration for dynamic loading
- All buttons load content into `#page-content`
- Emoji icons for visual recognition
- Responsive design for different screen sizes

## Step 2: Reorder Navigation Items

Change page sequence by modifying button order in navigation.

### Basic Reordering

```typescript
// Before: Original order
override content = `
<nav class="sidebar-nav">
    <button class="nav-button" hx-get="/page/home" hx-target="#page-content">🏠 Home</button>
    <button class="nav-button" hx-get="/page/section-files" hx-target="#page-content">📁 File Sections</button>
    <button class="nav-button" hx-get="/page/references" hx-target="#page-content">📊 References</button>
    <button class="nav-button" hx-get="/page/references2" hx-target="#page-content">📊 References v2</button>
    <button class="nav-button" hx-get="/page/local-agent" hx-target="#page-content">🤖 Local Agent</button>
</nav>
  `;

// After: Reordered
override content = `
<nav class="sidebar-nav">
    <button class="nav-button" hx-get="/page/home" hx-target="#page-content">🏠 Home</button>
    <button class="nav-button" hx-get="/page/local-agent" hx-target="#page-content">🤖 Local Agent</button>
    <button class="nav-button" hx-get="/page/section-files" hx-target="#page-content">📁 File Sections</button>
    <button class="nav-button" hx-get="/page/references" hx-target="#page-content">📊 References</button>
    <button class="nav-button" hx-get="/page/references2" hx-target="#page-content">📊 References v2</button>
</nav>
  `;
```

### Strategic Reordering

#### User Priority-Based Ordering

```typescript
override content = `
<nav class="sidebar-nav">
    <!-- High priority - Daily use -->
    <button class="nav-button" hx-get="/page/home" hx-target="#page-content">🏠 Home</button>
    <button class="nav-button" hx-get="/page/dashboard" hx-target="#page-content">📊 Dashboard</button>
    <button class="nav-button" hx-get="/page/local-agent" hx-target="#page-content">🤖 Local Agent</button>

    <!-- Medium priority - Weekly use -->
    <button class="nav-button" hx-get="/page/section-files" hx-target="#page-content">📁 File Sections</button>
    <button class="nav-button" hx-get="/page/references" hx-target="#page-content">📊 References</button>

    <!-- Low priority - Occasional use -->
    <button class="nav-button" hx-get="/page/references2" hx-target="#page-content">📊 References v2</button>
    <button class="nav-button" hx-get="/page/settings" hx-target="#page-content">⚙️ Settings</button>
</nav>
  `;
```

#### Workflow-Based Ordering

```typescript
override content = `
<nav class="sidebar-nav">
    <!-- Entry point -->
    <button class="nav-button" hx-get="/page/home" hx-target="#page-content">🏠 Home</button>

    <!-- Primary workflow -->
    <button class="nav-button" hx-get="/page/local-agent" hx-target="#page-content">🤖 Local Agent</button>
    <button class="nav-button" hx-get="/page/section-files" hx-target="#page-content">📁 File Sections</button>

    <!-- Information and reference -->
    <button class="nav-button" hx-get="/page/references" hx-target="#page-content">📊 References</button>
    <button class="nav-button" hx-get="/page/references2" hx-target="#page-content">📊 References v2</button>

    <!-- Administrative -->
    <button class="nav-button" hx-get="/page/settings" hx-target="#page-content">⚙️ Settings</button>
    <button class="nav-button" hx-get="/page/admin" hx-target="#page-content">🔒 Admin</button>
</nav>
  `;
```

## Step 3: Add Pages to Navigation

Include new pages in navigation with proper organization.

### Adding New Pages

```typescript
// Before: Without new page
override content = `
<nav class="sidebar-nav">
    <button class="nav-button" hx-get="/page/home" hx-target="#page-content">🏠 Home</button>
    <button class="nav-button" hx-get="/page/local-agent" hx-target="#page-content">🤖 Local Agent</button>
    <button class="nav-button" hx-get="/page/section-files" hx-target="#page-content">📁 File Sections</button>
</nav>
  `;

// After: With new page added
override content = `
<nav class="sidebar-nav">
    <button class="nav-button" hx-get="/page/home" hx-target="#page-content">🏠 Home</button>
    <button class="nav-button" hx-get="/page/local-agent" hx-target="#page-content">🤖 Local Agent</button>
    <button class="nav-button" hx-get="/page/section-files" hx-target="#page-content">📁 File Sections</button>
    <button class="nav-button" hx-get="/page/new-feature" hx-target="#page-content">🌟 New Feature</button>
</nav>
  `;
```

### Categorizing New Pages

```typescript
override content = `
<nav class="sidebar-nav">
    <!-- Core Features -->
    <div class="menu-category">Core Features</div>
    <button class="nav-button" hx-get="/page/home" hx-target="#page-content">🏠 Home</button>
    <button class="nav-button" hx-get="/page/local-agent" hx-target="#page-content">🤖 Local Agent</button>

    <!-- File Management -->
    <div class="menu-category">File Management</div>
    <button class="nav-button" hx-get="/page/section-files" hx-target="#page-content">📁 File Sections</button>
    <button class="nav-button" hx-get="/page/file-explorer" hx-target="#page-content">🔍 File Explorer</button>

    <!-- References -->
    <div class="menu-category">References</div>
    <button class="nav-button" hx-get="/page/references" hx-target="#page-content">📊 References</button>
    <button class="nav-button" hx-get="/page/references2" hx-target="#page-content">📊 References v2</button>

    <!-- New Features -->
    <div class="menu-category">New Features</div>
    <button class="nav-button" hx-get="/page/new-feature" hx-target="#page-content">🌟 New Feature</button>
    <button class="nav-button" hx-get="/page/beta-tools" hx-target="#page-content">🧪 Beta Tools</button>
</nav>
  `;
```

## Step 4: Remove Pages from Navigation

Safely remove pages while maintaining system integrity.

### Safe Page Removal Process

#### A. Check Dependencies

```bash
# Check if page is referenced elsewhere
grep -r "/page/removed-page" deno/ts/
grep -r "removed-page" deno/ts/
curl -s "http://localhost:8000/page/removed-page" > /dev/null && echo "Page exists" || echo "Page not found"
```

#### B. Remove from Navigation

```typescript
// Before: With page to remove
override content = `
<nav class="sidebar-nav">
    <button class="nav-button" hx-get="/page/home" hx-target="#page-content">🏠 Home</button>
    <button class="nav-button" hx-get="/page/old-feature" hx-target="#page-content">❌ Old Feature</button>
    <button class="nav-button" hx-get="/page/local-agent" hx-target="#page-content">🤖 Local Agent</button>
</nav>
  `;

// After: Page removed
override content = `
<nav class="sidebar-nav">
    <button class="nav-button" hx-get="/page/home" hx-target="#page-content">🏠 Home</button>
    <button class="nav-button" hx-get="/page/local-agent" hx-target="#page-content">🤖 Local Agent</button>
</nav>
  `;
```

#### C. Deprecation Strategy

```typescript
// Mark page as deprecated before removal
override content = `
<nav class="sidebar-nav">
    <button class="nav-button" hx-get="/page/home" hx-target="#page-content">🏠 Home</button>
    <button class="nav-button deprecated" hx-get="/page/old-feature" hx-target="#page-content">⚠️ Old Feature (Deprecated)</button>
    <button class="nav-button" hx-get="/page/local-agent" hx-target="#page-content">🤖 Local Agent</button>
</nav>
  `;
```

### Gradual Removal Process

```typescript
// Phase 1: Mark as deprecated
override content = `
<nav class="sidebar-nav">
    <button class="nav-button" hx-get="/page/home" hx-target="#page-content">🏠 Home</button>
    <button class="nav-button deprecated" hx-get="/page/old-feature" hx-target="#page-content">⚠️ Old Feature (Deprecated)</button>
    <button class="nav-button" hx-get="/page/local-agent" hx-target="#page-content">🤖 Local Agent</button>
</nav>
  `;

// Phase 2: Move to bottom
override content = `
<nav class="sidebar-nav">
    <button class="nav-button" hx-get="/page/home" hx-target="#page-content">🏠 Home</button>
    <button class="nav-button" hx-get="/page/local-agent" hx-target="#page-content">🤖 Local Agent</button>
    <div class="deprecated-section">
        <span class="deprecated-label">Deprecated:</span>
        <button class="nav-button deprecated" hx-get="/page/old-feature" hx-target="#page-content">⚠️ Old Feature</button>
    </div>
</nav>
  `;

// Phase 3: Remove completely
override content = `
<nav class="sidebar-nav">
    <button class="nav-button" hx-get="/page/home" hx-target="#page-content">🏠 Home</button>
    <button class="nav-button" hx-get="/page/local-agent" hx-target="#page-content">🤖 Local Agent</button>
</nav>
  `;
```

## Step 5: Organize Menu Layout

Apply best practices for navigation organization.

### Menu Organization Principles

#### A. Logical Grouping

```typescript
override content = `
<nav class="sidebar-nav">
    <!-- Dashboard & Overview -->
    <div class="menu-category">Dashboard & Overview</div>
    <button class="nav-button" hx-get="/page/home" hx-target="#page-content">🏠 Home</button>
    <button class="nav-button" hx-get="/page/dashboard" hx-target="#page-content">📊 Dashboard</button>

    <!-- Core Features -->
    <div class="menu-category">Core Features</div>
    <button class="nav-button" hx-get="/page/local-agent" hx-target="#page-content">🤖 Local Agent</button>
    <button class="nav-button" hx-get="/page/section-files" hx-target="#page-content">📁 File Sections</button>

    <!-- Reference & Documentation -->
    <div class="menu-category">Reference & Documentation</div>
    <button class="nav-button" hx-get="/page/references" hx-target="#page-content">📊 References</button>
    <button class="nav-button" hx-get="/page/references2" hx-target="#page-content">📊 References v2</button>

    <!-- Settings & Administration -->
    <div class="menu-category">Settings & Administration</div>
    <button class="nav-button" hx-get="/page/settings" hx-target="#page-content">⚙️ Settings</button>
    <button class="nav-button" hx-get="/page/admin" hx-target="#page-content">🔒 Admin</button>
</nav>
  `;
```

#### B. Frequency-Based Ordering

```typescript
override content = `
<nav class="sidebar-nav">
    <!-- High Frequency (Daily Use) -->
    <button class="nav-button high-frequency" hx-get="/page/home" hx-target="#page-content">🏠 Home</button>
    <button class="nav-button high-frequency" hx-get="/page/dashboard" hx-target="#page-content">📊 Dashboard</button>
    <button class="nav-button high-frequency" hx-get="/page/local-agent" hx-target="#page-content">🤖 Local Agent</button>

    <!-- Medium Frequency (Weekly Use) -->
    <button class="nav-button medium-frequency" hx-get="/page/section-files" hx-target="#page-content">📁 File Sections</button>
    <button class="nav-button medium-frequency" hx-get="/page/references" hx-target="#page-content">📊 References</button>

    <!-- Low Frequency (Monthly Use) -->
    <button class="nav-button low-frequency" hx-get="/page/settings" hx-target="#page-content">⚙️ Settings</button>
    <button class="nav-button low-frequency" hx-get="/page/admin" hx-target="#page-content">🔒 Admin</button>
    <button class="nav-button low-frequency" hx-get="/page/reports" hx-target="#page-content">📈 Reports</button>
</nav>
  `;
```

#### C. Performance-Based Organization

```typescript
override content = `
<nav class="sidebar-nav">
    <!-- Lightweight pages (fast loading) -->
    <button class="nav-button lightweight" hx-get="/page/home" hx-target="#page-content">🏠 Home</button>
    <button class="nav-button lightweight" hx-get="/page/status" hx-target="#page-content">✅ Status</button>

    <!-- Medium weight pages -->
    <button class="nav-button medium" hx-get="/page/local-agent" hx-target="#page-content">🤖 Local Agent</button>
    <button class="nav-button medium" hx-get="/page/section-files" hx-target="#page-content">📁 File Sections</button>

    <!-- Heavy pages (resource intensive) -->
    <button class="nav-button heavy" hx-get="/page/analytics" hx-target="#page-content">📈 Analytics</button>
    <button class="nav-button heavy" hx-get="/page/reports" hx-target="#page-content">📊 Reports</button>
    <button class="nav-button heavy" hx-get="/page/data-export" hx-target="#page-content">📤 Data Export</button>
</nav>
  `;
```

## Step 6: Test Navigation Organization

Verify reorganization works correctly.

### Manual Testing

1. Start server: `deno run --allow-all main.ts`
2. Navigate to application
3. Test menu order and page loading
4. Verify removed pages are inaccessible
5. Check responsive design on different screens

### Automated Testing

```typescript
describe("Navigation Menu Organization", () => {
  test("Menu items appear in correct order", async () => {
    const menu = new NavigationMenuAsset();
    const content = await menu.content();

    const expectedOrder = [
      "/page/home",
      "/page/local-agent",
      "/page/section-files",
      "/page/references",
    ];

    expectedOrder.forEach((url, index) => {
      const position = content.indexOf(url);
      expect(position).toBeGreaterThan(-1);
      if (index > 0) {
        const prevPosition = content.indexOf(expectedOrder[index - 1]);
        expect(position).toBeGreaterThan(prevPosition);
      }
    });
  });

  test("Removed pages are not in navigation", async () => {
    const menu = new NavigationMenuAsset();
    const content = await menu.content();

    expect(content).not.toContain("/page/removed-page");
  });
});
```

### Performance Testing

```bash
# Test navigation responsiveness
time curl -s "http://localhost:8000/menu/navigation" > /dev/null

# Test individual page load times
time curl -s "http://localhost:8000/page/home" > /dev/null
time curl -s "http://localhost:8000/page/local-agent" > /dev/null
time curl -s "http://localhost:8000/page/section-files" > /dev/null
```

## Best Practices

### Planning Phase

- **User Research**: Understand navigation patterns
- **Analytics Review**: Analyze page usage statistics
- **User Testing**: Identify navigation pain points
- **Accessibility**: Ensure navigation is accessible

### Implementation Phase

- **Gradual Changes**: Make incremental reorganizations
- **User Communication**: Inform users about changes
- **Backward Compatibility**: Maintain access during transition
- **Testing**: Thoroughly test all changes

### Maintenance Phase

- **Regular Review**: Review navigation based on usage
- **User Feedback**: Collect and analyze feedback
- **Performance Monitoring**: Monitor responsiveness
- **Documentation**: Keep structure documentation updated

### Common Pitfalls to Avoid

- **Over-categorization**: Don't create too many categories
- **Inconsistent Naming**: Use consistent naming
- **Ignoring User Habits**: Don't disrupt established patterns
- **Performance Neglect**: Don't ignore performance impact
- **Mobile Neglect**: Ensure mobile compatibility

This guide provides quick instructions for organizing navigation to create intuitive, user-friendly menu structures.
