---
name: "Short How to Edit a Section"
summary: "Quick guide for modifying section content, load methods, and parameter configurations"
params:
  - section_name: "Name of the section to edit"
  - load_method: "Type of load method (immediate, on-demand, lazy)"
---

# How to Edit a Section

Quick guide for modifying existing sections, including content, load methods, and parameters.

## Overview

Editing a section involves:

1. **Locate section asset** - Find the section to modify
2. **Modify content** - Update HTML, styling, or functionality
3. **Change load methods** - Adjust when and how content loads
4. **Configure parameters** - Add, remove, or modify section parameters
5. **Test changes** - Verify modifications work correctly

## Step 1: Locate Section Asset

Find the section asset file to modify.

### Search for Section Assets

```bash
# Find all section asset files
find deno/ts/assets/page -name "*_section_asset.ts" -type f

# Find specific section assets
find deno/ts/assets/page -name "*my_local_agent*section_asset.ts" -type f
```

### Common Locations

- `deno/ts/assets/page/[page-name]/[section-name]_section_asset.ts`
- `deno/ts/assets/page/[page-name]/sections/[section-name].ts`

## Step 2: Modify Section Content

Update HTML content, styling, or functionality.

### Basic Content Modification

```typescript
// Before
override content = async (): Promise<string> => {
  return `
    <div class="my-section">
      <h3>Old Title</h3>
      <p>Old content here</p>
    </div>
  `;
};

// After
override content = async (): Promise<string> => {
  return `
    <div class="my-section markdown-content">
      <h3>Updated Title</h3>
      <p>Enhanced content with better styling</p>
    </div>
  `;
};
```

**Best Practices:**

- Use `markdown-content` class for tables
- Add semantic HTML for accessibility
- Maintain responsive design

## Step 3: Change Load Methods

Modify how and when section content loads.

### Load Method Options

```typescript
// 1. Immediate Load (autoload: true)
{
  id: "immediate-section",
  title: "📊 Dashboard",
  asset: dashboardSectionAsset,
  open: true,
  autoload: true  // Loads immediately when page loads
}

// 2. On-Demand Load (autoload: false)
{
  id: "heavy-section",
  title: "📈 Analytics",
  asset: analyticsSectionAsset,
  open: false,
  autoload: false  // Loads only when user opens section
}
```

**Performance Tips:**

- Use `autoload: false` for heavy sections
- Use `autoload: true` for lightweight, frequently accessed content

## Step 4: Configure Section Parameters

Add, modify, or remove parameters that sections accept.

### Section with Parameters

```typescript
export class ParameterizedSectionAsset extends SectionAsset {
  override url = "/api/parameterized-section/:category/:limit";

  title = "📊 Filtered Data";

  override content = async (params?: Record<string, any>): Promise<string> => {
    const category = params?.category || "all";
    const limit = parseInt(params?.limit || "10", 10);

    return `
      <div class="parameterized-section">
        <div class="filters">
          <span>Category: ${category}</span>
          <span>Limit: ${limit}</span>
        </div>
        <div class="data-content">
          <!-- Content based on parameters -->
        </div>
      </div>
    `;
  };
}
```

### Parameter Validation

```typescript
override content = async (params?: Record<string, any>): Promise<string> => {
  const errors: string[] = [];

  // Validate required parameters
  if (!params?.userId) {
    errors.push("User ID is required");
  }

  // Validate numeric parameters
  const limit = parseInt(params?.limit || "10", 10);
  if (isNaN(limit) || limit <= 0 || limit > 100) {
    errors.push("Limit must be a number between 1 and 100");
  }

  // Return errors if validation fails
  if (errors.length > 0) {
    return `
      <div class="validation-errors">
        <h3>Validation Errors</h3>
        <ul>${errors.map(error => `<li>${error}</li>`).join('')}</ul>
      </div>
    `;
  }

  // Process valid parameters
  return this.generateContent(params);
};
```

## Step 5: Update Page Configuration

Modify page asset to reflect section changes.

### Update Section Configuration

```typescript
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
      id: "analytics",
      title: "📈 Analytics",
      asset: analyticsSectionAsset,
      open: false,
      autoload: false,  // Changed for better performance
      params: {
        timeRange: '7d',
        chartType: 'line'
      }
    }
  ];
}
```

### Section Configuration Options

```typescript
{
  id: "section-id",
  title: "Section Title",
  asset: sectionAssetInstance,
  open: true|false,           // Start expanded/collapsed
  autoload: true|false,       // Load immediately/on-demand
  params: {                   // Optional: Default parameters
    param1: "value1",
    param2: "value2"
  },
  lazyLoad: true|false,       // Custom lazy loading
  cacheable: true|false,      // Whether content can be cached
  refreshInterval: number     // Auto-refresh interval in milliseconds
}
```

## Step 6: Test Section Modifications

Verify changes work correctly.

### Manual Testing

1. Start server: `deno run --allow-all main.ts`
2. Navigate to page containing modified section
3. Test content changes and load methods
4. Verify parameter handling

### Performance Testing

```bash
# Test load times
curl -w "@curl-format.txt" -o /dev/null -s "http://localhost:8000/api/my-section"

# Test with parameters
curl -w "@curl-format.txt" -o /dev/null -s "http://localhost:8000/api/parameterized-section?category=tech&limit=10"
```

## Common Modification Scenarios

### Scenario 1: Static to Dynamic Content

```typescript
// Before: Static content
override content = async (): Promise<string> => {
  return `<div>Static content</div>`;
};

// After: Dynamic content with API calls
override content = async (): Promise<string> => {
  const data = await fetch('/api/data').then(r => r.json());
  return `
    <div class="dynamic-content">
      <h3>Dynamic Data</h3>
      <p>Loaded at: ${new Date().toLocaleString()}</p>
      <div>${JSON.stringify(data)}</div>
    </div>
  `;
};
```

### Scenario 2: Adding User Interaction

```typescript
override content = async (): Promise<string> => {
  return `
    <div class="interactive-section">
      <h3>Interactive Section</h3>
      <button onclick="toggleDetails()">Toggle Details</button>
      <div id="details" style="display: none;">
        <p>Additional details here</p>
      </div>
      <script>
        function toggleDetails() {
          const details = document.getElementById('details');
          details.style.display = details.style.display === 'none' ? 'block' : 'none';
        }
      </script>
    </div>
  `;
};
```

## Best Practices

### Content Changes

- **Maintain accessibility**: Ensure new content is accessible
- **Preserve functionality**: Don't break existing features
- **Test thoroughly**: Verify changes work in all scenarios

### Load Method Changes

- **Consider performance**: Use lazy loading for heavy content
- **User experience**: Balance immediate feedback with performance
- **Progressive enhancement**: Support users with JavaScript disabled

### Parameter Changes

- **Validation**: Always validate input parameters
- **Documentation**: Document parameter requirements
- **Backward compatibility**: Maintain compatibility with existing calls

This guide provides quick instructions for editing sections to improve functionality and performance.
