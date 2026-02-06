---
name: "Short How to Order Pages and Sections"
summary: "Quick guide for organizing, reordering, and removing sections within pages"
params:
  - page_name: "Name of the page to organize"
  - section_order: "Desired order of sections (array of section IDs)"
---

# How to Order Pages and Sections

Quick guide for organizing, reordering, and removing sections within pages.

## Overview

Managing page sections involves:

1. **Understanding section order** - How sections are displayed
2. **Reordering sections** - Changing sequence in `sections()` method
3. **Removing sections** - Safely removing from pages
4. **Organizing structure** - Best practices for arrangement
5. **Testing changes** - Verifying organization works

## Step 1: Understand Section Order

Sections display in order defined in `sections()` method.

### Default Section Order

```typescript
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
    }
  ];
}
```

**Display Behavior:**

- Top to bottom order
- Card headers for expandable sections
- Independent expand/collapse
- State persistence during navigation

## Step 2: Reorder Sections

Change section sequence by modifying `sections()` array order.

### Basic Reordering

```typescript
// Before: Original order
sections() {
  return [
    { id: "overview", title: "Overview", asset: overviewAsset, open: true, autoload: true },
    { id: "analytics", title: "Analytics", asset: analyticsAsset, open: false, autoload: false },
    { id: "settings", title: "Settings", asset: settingsAsset, open: false, autoload: false }
  ];
}

// After: Reordered
sections() {
  return [
    { id: "overview", title: "Overview", asset: overviewAsset, open: true, autoload: true },
    { id: "settings", title: "Settings", asset: settingsAsset, open: false, autoload: false },
    { id: "analytics", title: "Analytics", asset: analyticsAsset, open: false, autoload: false }
  ];
}
```

### Strategic Reordering

#### User Onboarding Flow

```typescript
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
    }
  ];
}
```

#### Data Analysis Workflow

```typescript
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
    }
  ];
}
```

## Step 3: Remove Sections Safely

Remove sections while maintaining system integrity.

### Safe Section Removal Process

#### A. Check Dependencies

```bash
# Check if section is referenced elsewhere
grep -r "sectionToRemoveAsset" deno/ts/
grep -r "sectionToRemove" deno/ts/
find deno/ts/assets/page -name "*_page_asset.ts" -exec grep -l "sectionToRemoveAsset" {} \;
```

#### B. Remove from Page

```typescript
// Before: With section to remove
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

```bash
# Check if section asset is used anywhere
grep -r "UnusedSectionAsset" deno/ts/

# If no references found, remove file
rm deno/ts/assets/page/[page-name]/unused_section_asset.ts
```

### Deprecation Strategy

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
      </div>
    `;
  };
}
```

## Step 4: Organize Page Structure

Apply best practices for section organization.

### Section Organization Principles

#### A. Logical Grouping

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

## Step 5: Test Section Organization

Verify reorganization works correctly.

### Manual Testing

1. Start server: `deno run --allow-all main.ts`
2. Navigate to page with reorganized sections
3. Verify section order and functionality
4. Check removed sections are inaccessible

### Automated Testing

```typescript
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
});
```

### Performance Testing

```bash
# Test page load performance
time curl -s "http://localhost:8000/page/my-page" > /dev/null

# Test individual section load times
time curl -s "http://localhost:8000/api/section-a" > /dev/null
time curl -s "http://localhost:8000/api/section-b" > /dev/null
```

## Best Practices

### Planning Phase

- **User Research**: Understand user interaction patterns
- **Usage Analytics**: Analyze section usage frequency
- **Performance Impact**: Consider load times and resource usage
- **Future Growth**: Plan for new sections and features

### Implementation Phase

- **Gradual Changes**: Make incremental reorganizations
- **User Communication**: Inform users about changes
- **Backward Compatibility**: Maintain access during transition
- **Testing**: Thoroughly test all changes

### Maintenance Phase

- **Regular Review**: Periodically review section organization
- **User Feedback**: Collect and analyze feedback
- **Performance Monitoring**: Monitor page load times
- **Documentation**: Keep organization documentation updated

### Common Pitfalls to Avoid

- **Over-organization**: Don't create too many sections
- **Inconsistent Naming**: Use consistent naming conventions
- **Ignoring User Habits**: Don't disrupt established workflows
- **Performance Neglect**: Don't ignore performance impact

This guide provides quick instructions for organizing sections to create logical, user-friendly page structures.
