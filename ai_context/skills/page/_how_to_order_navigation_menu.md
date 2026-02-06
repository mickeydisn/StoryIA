---
name: "How to Order Navigation Menu"
summary: "Complete guide for organizing, reordering, and managing pages in the navigation menu"
params:
  - menu_items: "List of menu items to organize"
  - page_order: "Desired order of pages in navigation"
  - items_to_remove: "List of menu items to remove"
---

# How to Order Navigation Menu

This guide explains how to organize, reorder, and manage pages in the navigation menu to create an intuitive user experience. Proper navigation menu organization helps users find pages quickly and improves overall usability.

## Overview

Managing the navigation menu involves:

1. **Understanding menu structure** - How navigation items are organized and displayed
2. **Reordering menu items** - Changing the sequence of pages in the navigation
3. **Adding pages to navigation** - Including new pages in the menu
4. **Removing pages from navigation** - Safely removing pages from the menu
5. **Organizing menu layout** - Best practices for menu arrangement
6. **Testing navigation changes** - Verifying menu organization works correctly

## Step 1: Understand Navigation Menu Structure

The navigation menu is defined in the `navigation_menu_asset.ts` file and uses HTMX for dynamic loading.

### Default Navigation Structure

```typescript
// Navigation menu structure in navigation_menu_asset.ts
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

### Navigation Menu Behavior

- **HTMX Integration**: Uses `hx-get` for dynamic content loading
- **Target Loading**: All buttons load content into `#page-content`
- **Visual Indicators**: Emoji icons provide visual recognition
- **Responsive Design**: Menu adapts to different screen sizes
- **State Management**: Navigation state is maintained during browsing

## Step 2: Reorder Navigation Items

Change the sequence of pages in the navigation menu by modifying the button order.

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

// After: Reordered for better user flow
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

### Strategic Reordering Examples

#### A. User Priority-Based Ordering

```typescript
// Reordered based on user priority and frequency of use
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

#### B. Workflow-Based Ordering

```typescript
// Reordered to match user workflow
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

#### C. User Role-Based Ordering

```typescript
// Dynamic ordering based on user role
override content = async (params?: Record<string, any>): Promise<string> => {
  const userRole = params?.userRole || 'user';

  let menuItems = `
    <button class="nav-button" hx-get="/page/home" hx-target="#page-content">🏠 Home</button>
    <button class="nav-button" hx-get="/page/local-agent" hx-target="#page-content">🤖 Local Agent</button>
    <button class="nav-button" hx-get="/page/section-files" hx-target="#page-content">📁 File Sections</button>
    <button class="nav-button" hx-get="/page/references" hx-target="#page-content">📊 References</button>
  `;

  // Add role-specific items
  if (userRole === 'admin') {
    menuItems += `
      <button class="nav-button" hx-get="/page/admin" hx-target="#page-content">🔒 Admin</button>
      <button class="nav-button" hx-get="/page/user-management" hx-target="#page-content">👥 User Management</button>
    `;
  }

  if (userRole === 'developer') {
    menuItems += `
      <button class="nav-button" hx-get="/page/developer-tools" hx-target="#page-content">🛠️ Developer Tools</button>
      <button class="nav-button" hx-get="/page/api-docs" hx-target="#page-content">📚 API Documentation</button>
    `;
  }

  return `
<nav class="sidebar-nav">
    ${menuItems}
</nav>
  `;
};
```

## Step 3: Add Pages to Navigation

Include new pages in the navigation menu with proper organization.

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
// Organize new pages by category
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

### Adding Contextual Navigation

```typescript
// Add contextual navigation based on current page
override content = async (params?: Record<string, any>): Promise<string> => {
  const currentPage = params?.currentPage || 'home';

  let contextualItems = '';

  if (currentPage === 'local-agent') {
    contextualItems = `
      <div class="contextual-nav">
        <span class="context-label">Agent Actions:</span>
        <button class="nav-button small" hx-get="/page/local-agent#settings" hx-target="#page-content">⚙️ Settings</button>
        <button class="nav-button small" hx-get="/page/local-agent#analytics" hx-target="#page-content">📈 Analytics</button>
      </div>
    `;
  }

  return `
<nav class="sidebar-nav">
    <button class="nav-button" hx-get="/page/home" hx-target="#page-content">🏠 Home</button>
    <button class="nav-button" hx-get="/page/local-agent" hx-target="#page-content">🤖 Local Agent</button>
    <button class="nav-button" hx-get="/page/section-files" hx-target="#page-content">📁 File Sections</button>
    ${contextualItems}
</nav>
  `;
};
```

## Step 4: Remove Pages from Navigation

Safely remove pages from the navigation menu while maintaining system integrity.

### Safe Page Removal Process

#### A. Identify Page Dependencies

Before removing a page from navigation, check for dependencies:

```bash
# Check if page is referenced elsewhere
grep -r "/page/removed-page" deno/ts/

# Check for cross-page references
grep -r "removed-page" deno/ts/

# Verify page still exists and is accessible
curl -s "http://localhost:8000/page/removed-page" > /dev/null && echo "Page exists" || echo "Page not found"
```

#### B. Remove Page from Navigation

```typescript
// Before: Navigation with page to remove
override content = `
<nav class="sidebar-nav">
    <button class="nav-button" hx-get="/page/home" hx-target="#page-content">🏠 Home</button>
    <button class="nav-button" hx-get="/page/old-feature" hx-target="#page-content">❌ Old Feature</button>
    <button class="nav-button" hx-get="/page/local-agent" hx-target="#page-content">🤖 Local Agent</button>
</nav>
  `;

// After: Page removed from navigation
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

### Page Removal Best Practices

#### A. Gradual Removal Process

```typescript
// Phase 1: Mark as deprecated (Month 1)
override content = `
<nav class="sidebar-nav">
    <button class="nav-button" hx-get="/page/home" hx-target="#page-content">🏠 Home</button>
    <button class="nav-button deprecated" hx-get="/page/old-feature" hx-target="#page-content">⚠️ Old Feature (Deprecated)</button>
    <button class="nav-button" hx-get="/page/local-agent" hx-target="#page-content">🤖 Local Agent</button>
</nav>
  `;

// Phase 2: Move to bottom (Month 2)
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

// Phase 3: Remove completely (Month 3)
override content = `
<nav class="sidebar-nav">
    <button class="nav-button" hx-get="/page/home" hx-target="#page-content">🏠 Home</button>
    <button class="nav-button" hx-get="/page/local-agent" hx-target="#page-content">🤖 Local Agent</button>
</nav>
  `;
```

#### B. User Communication

```typescript
// Add notification about removed pages
override content = `
<nav class="sidebar-nav">
    <div class="nav-notice">
        <span class="notice-icon">📢</span>
        <span>Old Feature has been removed. Check Settings for alternatives.</span>
    </div>
    <button class="nav-button" hx-get="/page/home" hx-target="#page-content">🏠 Home</button>
    <button class="nav-button" hx-get="/page/local-agent" hx-target="#page-content">🤖 Local Agent</button>
</nav>
  `;
```

## Step 5: Organize Menu Layout

Apply best practices for navigation menu organization and user experience.

### Menu Organization Principles

#### A. Logical Grouping

Group related pages together:

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

Place frequently used pages first:

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

#### C. User Role-Based Organization

```typescript
override content = async (params?: Record<string, any>): Promise<string> => {
  const userRole = params?.userRole || 'user';

  let menuContent = `
    <button class="nav-button" hx-get="/page/home" hx-target="#page-content">🏠 Home</button>
    <button class="nav-button" hx-get="/page/local-agent" hx-target="#page-content">🤖 Local Agent</button>
  `;

  // Add user-specific menu items
  if (userRole === 'admin') {
    menuContent += `
      <div class="menu-category">Administration</div>
      <button class="nav-button" hx-get="/page/admin" hx-target="#page-content">🔒 Admin Panel</button>
      <button class="nav-button" hx-get="/page/user-management" hx-target="#page-content">👥 User Management</button>
      <button class="nav-button" hx-get="/page/system-settings" hx-target="#page-content">⚙️ System Settings</button>
    `;
  }

  if (userRole === 'developer') {
    menuContent += `
      <div class="menu-category">Developer Tools</div>
      <button class="nav-button" hx-get="/page/developer-tools" hx-target="#page-content">🛠️ Developer Tools</button>
      <button class="nav-button" hx-get="/page/api-docs" hx-target="#page-content">📚 API Documentation</button>
      <button class="nav-button" hx-get="/page/debug-console" hx-target="#page-content">🐛 Debug Console</button>
    `;
  }

  return `
<nav class="sidebar-nav">
    ${menuContent}
</nav>
  `;
};
```

### Menu Configuration Optimization

#### A. Performance-Based Organization

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

#### B. Context-Aware Navigation

```typescript
override content = async (params?: Record<string, any>): Promise<string> => {
  const currentPage = params?.currentPage || 'home';
  const breadcrumbs = params?.breadcrumbs || [];

  let contextNav = '';

  // Add breadcrumbs if available
  if (breadcrumbs.length > 0) {
    contextNav = `
      <div class="breadcrumbs">
        ${breadcrumbs.map((crumb: any) => `
          <span class="breadcrumb-item">
            <button class="breadcrumb-link" hx-get="${crumb.url}" hx-target="#page-content">${crumb.title}</button>
            <span class="breadcrumb-separator">›</span>
          </span>
        `).join('')}
      </div>
    `;
  }

  // Add quick actions based on current page
  if (currentPage === 'local-agent') {
    contextNav += `
      <div class="quick-actions">
        <span class="quick-actions-label">Quick Actions:</span>
        <button class="quick-action-btn" hx-get="/page/local-agent#settings" hx-target="#page-content">⚙️ Settings</button>
        <button class="quick-action-btn" hx-get="/page/local-agent#analytics" hx-target="#page-content">📈 Analytics</button>
        <button class="quick-action-btn" hx-get="/page/local-agent#help" hx-target="#page-content">🆘 Help</button>
      </div>
    `;
  }

  return `
<nav class="sidebar-nav">
    ${contextNav}
    <button class="nav-button" hx-get="/page/home" hx-target="#page-content">🏠 Home</button>
    <button class="nav-button" hx-get="/page/local-agent" hx-target="#page-content">🤖 Local Agent</button>
</nav>
  `;
};
```

## Step 6: Test Navigation Organization

Verify that navigation reorganization works correctly and maintains functionality.

### Manual Testing

1. **Start the server**: `deno run --allow-all main.ts`
2. **Navigate to the application**: Visit the main application page
3. **Test menu order**: Verify menu items appear in the correct order
4. **Test page loading**: Click each menu item to verify pages load correctly
5. **Test removed pages**: Verify removed pages are no longer accessible from menu
6. **Test responsive design**: Check menu on different screen sizes

### Automated Testing

```typescript
// Example test for navigation organization
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

  test("HTMX attributes are correct", async () => {
    const menu = new NavigationMenuAsset();
    const content = await menu.content();

    expect(content).toContain("hx-get");
    expect(content).toContain('hx-target="#page-content"');
  });
});
```

### Performance Testing

```bash
# Test navigation responsiveness
time curl -s "http://localhost:8000/menu/navigation" > /dev/null

# Test individual page load times from navigation
time curl -s "http://localhost:8000/page/home" > /dev/null
time curl -s "http://localhost:8000/page/local-agent" > /dev/null
time curl -s "http://localhost:8000/page/section-files" > /dev/null
```

## Common Reorganization Scenarios

### Scenario 1: User Feedback-Driven Reorganization

```typescript
// Before: Based on developer assumptions
override content = `
<nav class="sidebar-nav">
    <button class="nav-button" hx-get="/page/home" hx-target="#page-content">🏠 Home</button>
    <button class="nav-button" hx-get="/page/advanced-tools" hx-target="#page-content">🔧 Advanced Tools</button>
    <button class="nav-button" hx-get="/page/local-agent" hx-target="#page-content">🤖 Local Agent</button>
    <button class="nav-button" hx-get="/page/basic-features" hx-target="#page-content">⚙️ Basic Features</button>
</nav>
  `;

// After: Based on user feedback showing users prefer basic features first
override content = `
<nav class="sidebar-nav">
    <button class="nav-button" hx-get="/page/home" hx-target="#page-content">🏠 Home</button>
    <button class="nav-button" hx-get="/page/basic-features" hx-target="#page-content">⚙️ Basic Features</button>
    <button class="nav-button" hx-get="/page/local-agent" hx-target="#page-content">🤖 Local Agent</button>
    <button class="nav-button" hx-get="/page/advanced-tools" hx-target="#page-content">🔧 Advanced Tools</button>
</nav>
  `;
```

### Scenario 2: Performance-Driven Reorganization

```typescript
// Before: All pages in main navigation (slow initial load)
override content = `
<nav class="sidebar-nav">
    <button class="nav-button" hx-get="/page/home" hx-target="#page-content">🏠 Home</button>
    <button class="nav-button" hx-get="/page/heavy-analytics" hx-target="#page-content">📈 Heavy Analytics</button>
    <button class="nav-button" hx-get="/page/heavy-reports" hx-target="#page-content">📊 Heavy Reports</button>
    <button class="nav-button" hx-get="/page/heavy-visualizations" hx-target="#page-content">🖼️ Heavy Visualizations</button>
</nav>
  `;

// After: Only lightweight pages in main navigation
override content = `
<nav class="sidebar-nav">
    <button class="nav-button" hx-get="/page/home" hx-target="#page-content">🏠 Home</button>
    <button class="nav-button" hx-get="/page/quick-stats" hx-target="#page-content">📊 Quick Stats</button>
    <button class="nav-button" hx-get="/page/local-agent" hx-target="#page-content">🤖 Local Agent</button>

    <!-- Heavy pages moved to submenu -->
    <div class="submenu-trigger">
        <button class="nav-button submenu-btn">📊 Advanced Analytics ▼</button>
        <div class="submenu-content" style="display: none;">
            <button class="nav-button" hx-get="/page/heavy-analytics" hx-target="#page-content">📈 Analytics</button>
            <button class="nav-button" hx-get="/page/heavy-reports" hx-target="#page-content">📊 Reports</button>
            <button class="nav-button" hx-get="/page/heavy-visualizations" hx-target="#page-content">🖼️ Visualizations</button>
        </div>
    </div>
</nav>
  `;
```

### Scenario 3: Feature Deprecation and Migration

```typescript
// Before: Old feature structure
override content = `
<nav class="sidebar-nav">
    <button class="nav-button" hx-get="/page/home" hx-target="#page-content">🏠 Home</button>
    <button class="nav-button" hx-get="/page/old-dashboard" hx-target="#page-content">❌ Old Dashboard</button>
    <button class="nav-button" hx-get="/page/old-reports" hx-target="#page-content">❌ Old Reports</button>
    <button class="nav-button" hx-get="/page/new-dashboard" hx-target="#page-content">🌟 New Dashboard</button>
</nav>
  `;

// After: Migrated to new structure
override content = `
<nav class="sidebar-nav">
    <button class="nav-button" hx-get="/page/home" hx-target="#page-content">🏠 Home</button>
    <button class="nav-button" hx-get="/page/new-dashboard" hx-target="#page-content">🌟 New Dashboard</button>
    <button class="nav-button" hx-get="/page/migration-guide" hx-target="#page-content">📋 Migration Guide</button>

    <!-- Old features moved to legacy section -->
    <div class="legacy-section">
        <span class="legacy-label">Legacy (Deprecated):</span>
        <button class="nav-button legacy" hx-get="/page/old-dashboard" hx-target="#page-content">❌ Old Dashboard</button>
        <button class="nav-button legacy" hx-get="/page/old-reports" hx-target="#page-content">❌ Old Reports</button>
    </div>
</nav>
  `;
```

## Best Practices for Navigation Organization

### Planning Phase

- **User Research**: Understand how users navigate and which pages they use most
- **Analytics Review**: Analyze navigation patterns and page usage statistics
- **User Testing**: Conduct usability testing to identify navigation pain points
- **Accessibility Considerations**: Ensure navigation is accessible to all users

### Implementation Phase

- **Gradual Changes**: Make incremental navigation changes rather than large reorganizations
- **User Communication**: Inform users about navigation changes and new page locations
- **Backward Compatibility**: Maintain access to important pages during transition
- **Testing**: Thoroughly test all navigation changes before deployment

### Maintenance Phase

- **Regular Review**: Periodically review navigation organization based on usage patterns
- **User Feedback**: Collect and analyze user feedback on navigation usability
- **Performance Monitoring**: Monitor navigation responsiveness and page load times
- **Documentation**: Keep navigation structure documentation up to date

### Common Pitfalls to Avoid

- **Over-categorization**: Don't create too many menu categories or submenus
- **Inconsistent Naming**: Use consistent naming conventions for menu items
- **Ignoring User Habits**: Don't disrupt established navigation patterns without good reason
- **Performance Neglect**: Don't ignore the performance impact of navigation structure
- **Mobile Neglect**: Ensure navigation works well on mobile devices

This guide provides comprehensive instructions for organizing, reordering, and managing navigation menu items to create an intuitive, user-friendly navigation experience while maintaining system performance and functionality.
