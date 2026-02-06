---
name: "How to Order Pages and Sections"
summary: "Complete guide for organizing, reordering, and removing sections within pages"
params:
  - page_name: "Name of the page to organize"
  - section_order: "Desired order of sections (array of section IDs)"
  - sections_to_remove: "List of sections to remove from the page"
---

# How to Order Pages and Sections

This guide explains how to organize, reorder, and remove sections within pages to maintain a logical and user-friendly structure. Proper section organization improves navigation and user experience.

## Overview

Managing page sections involves:

1. **Understanding section order** - How sections are displayed and navigated
2. **Reordering sections** - Changing the sequence of sections in a page
3. **Removing sections** - Safely removing sections from pages
4. **Organizing page structure** - Best practices for section arrangement
5. **Testing changes** - Verifying section organization works correctly

## Step 1: Understand Section Order

Sections in a page are displayed in the order they are defined in the `sections()` method.

### Default Section Order

```typescript
// Sections are displayed in this order:
sections() {
  return [
    {
      id: "first-section",      // Displayed first
      title: "First Section",
      asset: firstSectionAsset,
      open: true,
      autoload: true
    },
    {
      id: "second-section",     // Displayed second
      title: "Second Section",
      asset: secondSectionAsset,
      open: false,
      autoload: false
    },
    {
      id: "third-section",      // Displayed third
      title: "Third Section",
      asset: thirdSectionAsset,
      open: false,
      autoload: false
    }
  ];
}
```

### Section Display Behavior

- **Top to Bottom**: Sections appear in the order they're defined
- **Card Headers**: Section titles appear as expandable card headers
- **Navigation**: Users can expand/collapse sections independently
- **State Persistence**: Section states (open/closed) are maintained during navigation

## Step 2: Reorder Sections

Change the sequence of sections by modifying their order in the `sections()` array.

### Basic Reordering

```typescript
// Before: Original order
sections() {
  return [
    { id: "overview", title: "Overview", asset: overviewAsset, open: true, autoload: true },
    { id: "analytics", title: "Analytics", asset: analyticsAsset, open: false, autoload: false },
    { id: "settings", title: "Settings", asset: settingsAsset, open: false, autoload: false },
    { id: "help", title: "Help", asset: helpAsset, open: false, autoload: false }
  ];
}

// After: Reordered for better user flow
sections() {
  return [
    { id: "overview", title: "Overview", asset: overviewAsset, open: true, autoload: true },
    { id: "analytics", title: "Analytics", asset: analyticsAsset, open: false, autoload: false },
    { id: "settings", title: "Settings", asset: settingsAsset, open: false, autoload: false },
    { id: "help", title: "Help", asset: helpAsset, open: false, autoload: false }
  ];
}
```

### Strategic Reordering Examples

#### A. User Onboarding Flow

```typescript
// Reordered for new user onboarding
sections() {
  return [
    {
      id: "welcome",
      title: "👋 Welcome",
      asset: welcomeSectionAsset,
      open: true,
      autoload: true
    },
    {
      id: "setup",
      title: "⚙️ Setup Guide",
      asset: setupSectionAsset,
      open: true,
      autoload: true
    },
    {
      id: "dashboard",
      title: "📊 Dashboard",
      asset: dashboardSectionAsset,
      open: false,
      autoload: false
    },
    {
      id: "advanced",
      title: "🔧 Advanced Features",
      asset: advancedSectionAsset,
      open: false,
      autoload: false
    },
    {
      id: "support",
      title: "🆘 Support",
      asset: supportSectionAsset,
      open: false,
      autoload: false
    }
  ];
}
```

#### B. Data Analysis Workflow

```typescript
// Reordered for data analysis workflow
sections() {
  return [
    {
      id: "data-input",
      title: "📥 Data Input",
      asset: dataInputSectionAsset,
      open: true,
      autoload: true
    },
    {
      id: "data-cleaning",
      title: "🧹 Data Cleaning",
      asset: dataCleaningSectionAsset,
      open: false,
      autoload: false
    },
    {
      id: "analysis",
      title: "📈 Analysis",
      asset: analysisSectionAsset,
      open: false,
      autoload: false
    },
    {
      id: "visualization",
      title: "📊 Visualization",
      asset: visualizationSectionAsset,
      open: false,
      autoload: false
    },
    {
      id: "export",
      title: "📤 Export Results",
      asset: exportSectionAsset,
      open: false,
      autoload: false
    }
  ];
}
```

#### C. Configuration Management

```typescript
// Reordered for configuration management
sections() {
  return [
    {
      id: "system-status",
      title: "✅ System Status",
      asset: systemStatusSectionAsset,
      open: true,
      autoload: true
    },
    {
      id: "basic-config",
      title: "⚙️ Basic Configuration",
      asset: basicConfigSectionAsset,
      open: false,
      autoload: false
    },
    {
      id: "advanced-config",
      title: "🔧 Advanced Configuration",
      asset: advancedConfigSectionAsset,
      open: false,
      autoload: false
    },
    {
      id: "security",
      title: "🔒 Security Settings",
      asset: securitySectionAsset,
      open: false,
      autoload: false
    },
    {
      id: "monitoring",
      title: "👀 Monitoring",
      asset: monitoringSectionAsset,
      open: false,
      autoload: false
    }
  ];
}
```

## Step 3: Remove Sections Safely

Remove sections from pages while maintaining system integrity.

### Safe Section Removal Process

#### A. Identify Section Dependencies

Before removing a section, check for dependencies:

```typescript
// Check if section is referenced elsewhere
// 1. Search for section asset imports
grep -r "sectionToRemoveAsset" deno/ts/

// 2. Check for cross-section references
grep -r "sectionToRemove" deno/ts/

// 3. Verify no other pages use this section
find deno/ts/assets/page -name "*_page_asset.ts" -exec grep -l "sectionToRemoveAsset" {} \;
```

#### B. Remove Section from Page

```typescript
// Before: Page with section to remove
sections() {
  return [
    { id: "section-a", title: "Section A", asset: sectionAAsset, open: true, autoload: true },
    { id: "section-to-remove", title: "Section to Remove", asset: sectionToRemoveAsset, open: false, autoload: false },
    { id: "section-c", title: "Section C", asset: sectionCAsset, open: false, autoload: false }
  ];
}

// After: Section removed
sections() {
  return [
    { id: "section-a", title: "Section A", asset: sectionAAsset, open: true, autoload: true },
    { id: "section-c", title: "Section C", asset: sectionCAsset, open: false, autoload: false }
  ];
}
```

#### C. Clean Up Unused Assets

After removing a section from all pages, clean up the asset file:

```bash
# Check if section asset is used anywhere
grep -r "UnusedSectionAsset" deno/ts/

# If no references found, remove the file
rm deno/ts/assets/page/[page-name]/unused_section_asset.ts
```

### Section Removal Best Practices

#### A. Deprecation Strategy

```typescript
// Mark section as deprecated before removal
export class DeprecatedSectionAsset extends SectionAsset {
  override url = "/api/deprecated-section";

  title = "⚠️ Deprecated Section (Will be removed)";

  override content = async (): Promise<string> => {
    return `
      <div class="deprecated-section">
        <h3>This section is deprecated</h3>
        <p>This section will be removed in a future version.</p>
        <p>Please migrate to the new section structure.</p>
        <div class="migration-guide">
          <h4>Migration Guide:</h4>
          <ul>
            <li>Feature A → New Section A</li>
            <li>Feature B → New Section B</li>
          </ul>
        </div>
      </div>
    `;
  };
}
```

#### B. Gradual Removal Process

```typescript
// Phase 1: Mark as deprecated (Month 1)
sections() {
  return [
    { id: "active-section", title: "Active Section", asset: activeSectionAsset, open: true, autoload: true },
    { id: "deprecated-section", title: "⚠️ Deprecated Section", asset: deprecatedSectionAsset, open: false, autoload: false }
  ];
}

// Phase 2: Remove from main sections (Month 2)
sections() {
  return [
    { id: "active-section", title: "Active Section", asset: activeSectionAsset, open: true, autoload: true }
  ];
}

// Phase 3: Remove asset file (Month 3)
// Delete: deno/ts/assets/page/[page-name]/deprecated_section_asset.ts
```

## Step 4: Organize Page Structure

Apply best practices for section organization and user experience.

### Section Organization Principles

#### A. Logical Grouping

Group related sections together:

```typescript
sections() {
  return [
    // Information sections
    { id: "overview", title: "📋 Overview", asset: overviewAsset, open: true, autoload: true },
    { id: "details", title: "🔍 Details", asset: detailsAsset, open: false, autoload: false },

    // Action sections
    { id: "controls", title: "⚙️ Controls", asset: controlsAsset, open: false, autoload: false },
    { id: "settings", title: "🔧 Settings", asset: settingsAsset, open: false, autoload: false },

    // Support sections
    { id: "help", title: "🆘 Help", asset: helpAsset, open: false, autoload: false },
    { id: "feedback", title: "💬 Feedback", asset: feedbackAsset, open: false, autoload: false }
  ];
}
```

#### B. Frequency-Based Ordering

Place frequently used sections first:

```typescript
sections() {
  return [
    // High frequency (daily use)
    { id: "dashboard", title: "📊 Dashboard", asset: dashboardAsset, open: true, autoload: true },
    { id: "quick-actions", title: "⚡ Quick Actions", asset: quickActionsAsset, open: true, autoload: true },

    // Medium frequency (weekly use)
    { id: "reports", title: "📈 Reports", asset: reportsAsset, open: false, autoload: false },
    { id: "analytics", title: "📊 Analytics", asset: analyticsAsset, open: false, autoload: false },

    // Low frequency (monthly use)
    { id: "settings", title: "⚙️ Settings", asset: settingsAsset, open: false, autoload: false },
    { id: "maintenance", title: "🔧 Maintenance", asset: maintenanceAsset, open: false, autoload: false }
  ];
}
```

#### C. User Journey Flow

Organize sections to match user workflows:

```typescript
sections() {
  return [
    // Entry point
    { id: "welcome", title: "👋 Welcome", asset: welcomeAsset, open: true, autoload: true },

    // Setup phase
    { id: "setup", title: "⚙️ Setup", asset: setupAsset, open: false, autoload: false },
    { id: "configuration", title: "🔧 Configuration", asset: configurationAsset, open: false, autoload: false },

    // Usage phase
    { id: "main-features", title: "🌟 Main Features", asset: mainFeaturesAsset, open: false, autoload: false },
    { id: "advanced-features", title: "🚀 Advanced Features", asset: advancedFeaturesAsset, open: false, autoload: false },

    // Support phase
    { id: "help", title: "🆘 Help", asset: helpAsset, open: false, autoload: false },
    { id: "troubleshooting", title: "🔧 Troubleshooting", asset: troubleshootingAsset, open: false, autoload: false }
  ];
}
```

### Section Configuration Optimization

#### A. Performance-Based Configuration

```typescript
sections() {
  return [
    // Lightweight sections (autoload)
    { id: "status", title: "✅ Status", asset: statusAsset, open: true, autoload: true },
    { id: "quick-stats", title: "📊 Quick Stats", asset: quickStatsAsset, open: true, autoload: true },

    // Heavy sections (on-demand)
    { id: "detailed-analytics", title: "📈 Detailed Analytics", asset: detailedAnalyticsAsset, open: false, autoload: false },
    { id: "data-export", title: "📤 Data Export", asset: dataExportAsset, open: false, autoload: false },
    { id: "advanced-settings", title: "🔧 Advanced Settings", asset: advancedSettingsAsset, open: false, autoload: false }
  ];
}
```

#### B. User Role-Based Configuration

```typescript
sections() {
  const userRole = this.getUserRole();
  const sections = [
    { id: "dashboard", title: "📊 Dashboard", asset: dashboardAsset, open: true, autoload: true },
    { id: "reports", title: "📈 Reports", asset: reportsAsset, open: false, autoload: false }
  ];

  // Add admin sections for admin users
  if (userRole === 'admin') {
    sections.push(
      { id: "user-management", title: "👥 User Management", asset: userManagementAsset, open: false, autoload: false },
      { id: "system-settings", title: "⚙️ System Settings", asset: systemSettingsAsset, open: false, autoload: false }
    );
  }

  // Add developer sections for developer users
  if (userRole === 'developer') {
    sections.push(
      { id: "api-docs", title: "📚 API Documentation", asset: apiDocsAsset, open: false, autoload: false },
      { id: "debug-tools", title: "🐛 Debug Tools", asset: debugToolsAsset, open: false, autoload: false }
    );
  }

  return sections;
}
```

## Step 5: Test Section Organization

Verify that section reorganization works correctly and maintains functionality.

### Manual Testing

1. **Start the server**: `deno run --allow-all main.ts`
2. **Navigate to the page**: Visit the page with reorganized sections
3. **Verify section order**: Check that sections appear in the correct order
4. **Test section interaction**: Expand/collapse sections to verify functionality
5. **Check removed sections**: Verify removed sections are no longer accessible

### Automated Testing

```typescript
// Example test for section organization
describe("Section Organization", () => {
  test("Sections appear in correct order", async () => {
    const page = new MyPageAsset();
    const sections = page.sections();

    const sectionIds = sections.map((s) => s.id);
    expect(sectionIds).toEqual(["first", "second", "third"]);
  });

  test("Removed sections are not accessible", async () => {
    const page = new MyPageAsset();
    const sections = page.sections();

    const removedSection = sections.find((s) => s.id === "removed-section");
    expect(removedSection).toBeUndefined();
  });

  test("Section configuration is correct", async () => {
    const page = new MyPageAsset();
    const sections = page.sections();

    const dashboardSection = sections.find((s) => s.id === "dashboard");
    expect(dashboardSection.open).toBe(true);
    expect(dashboardSection.autoload).toBe(true);
  });
});
```

### Performance Testing

```bash
# Test page load performance with new section order
time curl -s "http://localhost:8000/page/my-page" > /dev/null

# Test individual section load times
time curl -s "http://localhost:8000/api/section-a" > /dev/null
time curl -s "http://localhost:8000/api/section-b" > /dev/null
```

## Common Reorganization Scenarios

### Scenario 1: User Feedback-Driven Reorganization

```typescript
// Before: Based on developer assumptions
sections() {
  return [
    { id: "advanced", title: "🔧 Advanced", asset: advancedAsset, open: false, autoload: false },
    { id: "basic", title: "⚙️ Basic", asset: basicAsset, open: true, autoload: true },
    { id: "help", title: "🆘 Help", asset: helpAsset, open: false, autoload: false }
  ];
}

// After: Based on user feedback showing most users need help first
sections() {
  return [
    { id: "help", title: "🆘 Help", asset: helpAsset, open: true, autoload: true },
    { id: "basic", title: "⚙️ Basic", asset: basicAsset, open: true, autoload: true },
    { id: "advanced", title: "🔧 Advanced", asset: advancedAsset, open: false, autoload: false }
  ];
}
```

### Scenario 2: Performance-Driven Reorganization

```typescript
// Before: All sections autoload (slow page load)
sections() {
  return [
    { id: "heavy-analytics", title: "📈 Analytics", asset: analyticsAsset, open: true, autoload: true },
    { id: "heavy-reports", title: "📊 Reports", asset: reportsAsset, open: true, autoload: true },
    { id: "heavy-visualizations", title: "🖼️ Visualizations", asset: visualizationsAsset, open: true, autoload: true }
  ];
}

// After: Only lightweight sections autoload
sections() {
  return [
    { id: "status", title: "✅ Status", asset: statusAsset, open: true, autoload: true },
    { id: "quick-stats", title: "📊 Quick Stats", asset: quickStatsAsset, open: true, autoload: true },
    { id: "analytics", title: "📈 Analytics", asset: analyticsAsset, open: false, autoload: false },
    { id: "reports", title: "📊 Reports", asset: reportsAsset, open: false, autoload: false },
    { id: "visualizations", title: "🖼️ Visualizations", asset: visualizationsAsset, open: false, autoload: false }
  ];
}
```

### Scenario 3: Feature Deprecation and Migration

```typescript
// Before: Old feature structure
sections() {
  return [
    { id: "old-feature-a", title: "❌ Old Feature A", asset: oldFeatureAAsset, open: false, autoload: false },
    { id: "old-feature-b", title: "❌ Old Feature B", asset: oldFeatureBAsset, open: false, autoload: false },
    { id: "new-feature", title: "🌟 New Feature", asset: newFeatureAsset, open: false, autoload: false }
  ];
}

// After: Migrated to new structure
sections() {
  return [
    { id: "new-feature", title: "🌟 New Feature", asset: newFeatureAsset, open: true, autoload: true },
    { id: "migration-guide", title: "📋 Migration Guide", asset: migrationGuideAsset, open: false, autoload: false }
  ];
}
```

## Best Practices for Section Organization

### Planning Phase

- **User Research**: Understand how users interact with sections
- **Usage Analytics**: Analyze which sections are used most frequently
- **Performance Impact**: Consider load times and resource usage
- **Future Growth**: Plan for new sections and features

### Implementation Phase

- **Gradual Changes**: Make incremental changes rather than large reorganizations
- **User Communication**: Inform users about section changes
- **Backward Compatibility**: Maintain access to important features during transition
- **Testing**: Thoroughly test all changes before deployment

### Maintenance Phase

- **Regular Review**: Periodically review section organization
- **User Feedback**: Collect and analyze user feedback on section layout
- **Performance Monitoring**: Monitor page load times and section performance
- **Documentation**: Keep section organization documentation up to date

### Common Pitfalls to Avoid

- **Over-organization**: Don't create too many sections or make them too granular
- **Inconsistent Naming**: Use consistent naming conventions for section IDs and titles
- **Ignoring User Habits**: Don't disrupt established user workflows without good reason
- **Performance Neglect**: Don't ignore the performance impact of section organization

This guide provides comprehensive instructions for organizing, reordering, and removing sections to create a logical, user-friendly page structure while maintaining system performance and functionality.
