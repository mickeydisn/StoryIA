---
name: "How to Edit a Section"
summary: "Complete guide for modifying section content, load methods, and parameter configurations"
params:
  - section_name: "Name of the section to edit"
  - load_method: "Type of load method (immediate, on-demand, lazy, etc.)"
  - has_parameters: "Whether the section uses parameters (true/false)"
---

# How to Edit a Section

This guide explains how to modify existing sections, including changing content, load methods, and parameter configurations. Sections can be updated to improve functionality, performance, or user experience.

## Overview

Editing a section involves:

1. **Locating the section asset** - Find the section you want to modify
2. **Modifying content** - Update HTML, styling, or functionality
3. **Changing load methods** - Adjust when and how content loads
4. **Configuring parameters** - Add, remove, or modify section parameters
5. **Testing changes** - Verify modifications work correctly

## Step 1: Locate the Section Asset

Find the section asset file you want to modify.

### Search for Section Assets

```bash
# Find all section asset files
find deno/ts/assets/page -name "*_section_asset.ts" -type f

# Find specific section assets
find deno/ts/assets/page -name "*my_local_agent*section_asset.ts" -type f
find deno/ts/assets/page -name "*settings*section_asset.ts" -type f
```

### Common Section Asset Locations

Section assets are typically located in:

- `deno/ts/assets/page/[page-name]/[section-name]_section_asset.ts`
- `deno/ts/assets/page/[page-name]/sections/[section-name].ts`
- `deno/ts/assets/page/[page-name]/assets/[section-name].ts`

### Example: Finding MyLocalAgent Section

```bash
# Search for local agent section
find deno/ts/assets/page -name "*my_local_agent*" -type f
```

Expected output:

```
deno/ts/assets/page/local_agent/my_local_agent_section_asset.ts
```

## Step 2: Modify Section Content

Update the HTML content, styling, or functionality of the section.

### Basic Content Modification

```typescript
// Before: Simple content
override content = async (): Promise<string> => {
  return `
    <div class="my-section">
      <h3>Old Title</h3>
      <p>Old content here</p>
    </div>
  `;
};

// After: Enhanced content
override content = async (): Promise<string> => {
  return `
    <div class="my-section markdown-content">
      <h3>Updated Title</h3>
      <p>Enhanced content with better styling</p>

      <!-- New interactive elements -->
      <div class="interactive-content">
        <button class="action-btn">New Action</button>
        <div class="status-indicator">Status: Active</div>
      </div>

      <!-- New table with data -->
      <table>
        <thead>
          <tr>
            <th>Metric</th>
            <th>Value</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Performance</td>
            <td>95%</td>
            <td><span class="status-badge success">Good</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
};
```

### Content Enhancement Best Practices

- **Use `markdown-content` class** for tables and complex layouts
- **Add semantic HTML** for better accessibility
- **Include proper CSS classes** for consistent styling
- **Maintain responsive design** principles

## Step 3: Change Load Methods

Modify how and when the section content loads for better performance.

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
  autoload: false  // Loads only when user opens the section
}

// 3. Lazy Load with Intersection Observer
{
  id: "lazy-section",
  title: "🖼️ Gallery",
  asset: gallerySectionAsset,
  open: false,
  autoload: false  // Custom lazy loading implementation
}
```

### Advanced Load Method Implementations

#### A. Conditional Loading Based on User Role

```typescript
export class ConditionalSectionAsset extends SectionAsset {
  override url = "/api/conditional-section";

  title = "🔒 Admin Tools";

  override content = async (): Promise<string> => {
    // Check user permissions
    const userRole = await this.getUserRole();

    if (userRole !== "admin") {
      return `
        <div class="access-denied">
          <h3>Access Denied</h3>
          <p>You need admin privileges to access this section.</p>
        </div>
      `;
    }

    return `
      <div class="admin-section">
        <h3>Admin Controls</h3>
        <div class="admin-tools">
          <!-- Admin-specific content -->
        </div>
      </div>
    `;
  };

  private async getUserRole(): Promise<string> {
    // Implementation to get user role
    return "user"; // or 'admin'
  }
}
```

#### B. Progressive Loading with Skeleton States

```typescript
export class ProgressiveSectionAsset extends SectionAsset {
  override url = "/api/progressive-section";

  title = "📊 Data Visualization";

  override content = async (): Promise<string> => {
    return `
      <div class="progressive-section">
        <div class="loading-skeleton" id="chart-skeleton">
          <div class="skeleton-bar"></div>
          <div class="skeleton-bar"></div>
          <div class="skeleton-bar"></div>
        </div>
        <div class="chart-container" id="chart-container" style="display: none;">
          <!-- Chart will be rendered here -->
        </div>
      </div>
      <script>
        // Progressive loading script
        setTimeout(() => {
          document.getElementById('chart-skeleton').style.display = 'none';
          document.getElementById('chart-container').style.display = 'block';
          // Render actual chart
        }, 1000);
      </script>
    `;
  };
}
```

#### C. Streaming Content Load

```typescript
export class StreamingSectionAsset extends SectionAsset {
  override url = "/api/streaming-section";

  title = "📰 Live Updates";

  override content = async (): Promise<string> => {
    return `
      <div class="streaming-section">
        <h3>Live Feed</h3>
        <div class="feed-container" id="feed-container">
          <!-- Initial content -->
          <div class="feed-item">System initialized</div>
        </div>
        <div class="stream-controls">
          <button onclick="startStream()">Start Stream</button>
          <button onclick="stopStream()">Stop Stream</button>
        </div>
      </div>
      <script>
        function startStream() {
          // Start receiving live updates
          const eventSource = new EventSource('/api/live-updates');
          eventSource.onmessage = function(event) {
            const container = document.getElementById('feed-container');
            const item = document.createElement('div');
            item.className = 'feed-item';
            item.textContent = event.data;
            container.appendChild(item);
          };
        }
        
        function stopStream() {
          // Stop receiving updates
          if (typeof EventSource !== 'undefined') {
            const eventSource = new EventSource('/api/live-updates');
            eventSource.close();
          }
        }
      </script>
    `;
  };
}
```

## Step 4: Configure Section Parameters

Add, modify, or remove parameters that sections can accept.

### Section with Parameters

```typescript
export class ParameterizedSectionAsset extends SectionAsset {
  override url = "/api/parameterized-section/:category/:limit"; // Dynamic URL

  title = "📊 Filtered Data";

  override content = async (params?: Record<string, any>): Promise<string> => {
    // Extract parameters with defaults
    const category = params?.category || "all";
    const limit = parseInt(params?.limit || "10", 10);
    const sortBy = params?.sortBy || "date";

    // Generate content based on parameters
    const data = await this.fetchData(category, limit, sortBy);

    return `
      <div class="parameterized-section">
        <div class="filters">
          <span>Category: ${category}</span>
          <span>Limit: ${limit}</span>
          <span>Sort: ${sortBy}</span>
        </div>
        <div class="data-content">
          ${this.renderData(data)}
        </div>
      </div>
    `;
  };

  private async fetchData(category: string, limit: number, sortBy: string) {
    // Implementation to fetch data based on parameters
    return [];
  }

  private renderData(data: any[]): string {
    // Implementation to render data
    return "<p>No data available</p>";
  }
}
```

### Parameter Types and Validation

```typescript
export class ValidatedSectionAsset extends SectionAsset {
  override url = "/api/validated-section";

  title = "✅ Validated Input";

  override content = async (params?: Record<string, any>): Promise<string> => {
    // Parameter validation
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

    // Validate enum parameters
    const status = params?.status;
    const validStatuses = ["active", "inactive", "pending"];
    if (status && !validStatuses.includes(status)) {
      errors.push(`Status must be one of: ${validStatuses.join(", ")}`);
    }

    // Return error message if validation fails
    if (errors.length > 0) {
      return `
        <div class="validation-errors">
          <h3>Validation Errors</h3>
          <ul>
            ${errors.map((error) => `<li>${error}</li>`).join("")}
          </ul>
        </div>
      `;
    }

    // Process valid parameters
    return this.generateContent(params);
  };

  private generateContent(params: Record<string, any>): string {
    // Generate content based on validated parameters
    return `<p>Content for user ${params.userId}</p>`;
  }
}
```

### Dynamic Parameter Loading

```typescript
export class DynamicParamsSectionAsset extends SectionAsset {
  override url = "/api/dynamic-params-section";

  title = "🔄 Dynamic Parameters";

  override content = async (params?: Record<string, any>): Promise<string> => {
    // Fetch available parameter options
    const categories = await this.getAvailableCategories();
    const users = await this.getAvailableUsers();

    return `
      <div class="dynamic-params-section">
        <h3>Dynamic Parameters</h3>
        <form id="params-form">
          <div class="form-group">
            <label>Category:</label>
            <select id="category-select">
              ${categories
                .map((cat) => `<option value="${cat.id}">${cat.name}</option>`)
                .join("")}
            </select>
          </div>
          <div class="form-group">
            <label>User:</label>
            <select id="user-select">
              ${users
                .map(
                  (user) => `<option value="${user.id}">${user.name}</option>`
                )
                .join("")}
            </select>
          </div>
          <button type="button" onclick="loadWithParams()">Load Content</button>
        </form>
        
        <div id="dynamic-content">
          <!-- Content will be loaded here -->
        </div>
      </div>
      <script>
        function loadWithParams() {
          const category = document.getElementById('category-select').value;
          const user = document.getElementById('user-select').value;
          
          // Load content with new parameters
          fetch(\`\${window.location.pathname}?category=\${category}&user=\${user}\`)
            .then(response => response.text())
            .then(html => {
              document.getElementById('dynamic-content').innerHTML = html;
            });
        }
      </script>
    `;
  };

  private async getAvailableCategories(): Promise<any[]> {
    // Fetch available categories
    return [];
  }

  private async getAvailableUsers(): Promise<any[]> {
    // Fetch available users
    return [];
  }
}
```

## Step 5: Update Page Configuration

Modify the page asset to reflect changes in section configuration.

### Update Section Configuration

```typescript
// In the page asset file
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
    },
    // Update existing section configuration
    {
      id: "analytics",
      title: "📈 Analytics",
      asset: analyticsSectionAsset,
      open: false,
      autoload: false,  // Changed from true to false for better performance
      params: {
        timeRange: '7d',  // Added default parameters
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

Verify that your section modifications work correctly.

### Manual Testing

1. **Start the server**: `deno run --allow-all main.ts`
2. **Navigate to the page**: Visit the page containing your modified section
3. **Test content changes**: Verify new content displays correctly
4. **Test load methods**: Check that content loads at the right time
5. **Test parameters**: Verify parameter handling works as expected

### Automated Testing

```typescript
// Example test for section modifications
describe("Section Modifications", () => {
  test("Content loads correctly", async () => {
    const section = new MySectionAsset();
    const content = await section.content();

    expect(content).toContain("Updated Title");
    expect(content).toContain("markdown-content");
  });

  test("Parameters are handled correctly", async () => {
    const section = new ParameterizedSectionAsset();
    const params = { category: "tech", limit: 5 };
    const content = await section.content(params);

    expect(content).toContain("Category: tech");
    expect(content).toContain("Limit: 5");
  });

  test("Load method works correctly", async () => {
    // Test autoload behavior
    const page = new MyPageAsset();
    const sections = page.sections();

    const section = sections.find((s) => s.id === "my-section");
    expect(section.autoload).toBe(false); // Should be false for performance
  });
});
```

### Performance Testing

```bash
# Test load times
curl -w "@curl-format.txt" -o /dev/null -s "http://localhost:8000/api/my-section"

# Test with parameters
curl -w "@curl-format.txt" -o /dev/null -s "http://localhost:8000/api/parameterized-section?category=tech&limit=10"
```

## Common Modification Scenarios

### Scenario 1: Converting Static Content to Dynamic

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
// Enhanced with interactive elements
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

### Scenario 3: Implementing Caching

```typescript
export class CachedSectionAsset extends SectionAsset {
  private cache: Map<string, { data: string; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  override content = async (params?: Record<string, any>): Promise<string> => {
    const cacheKey = JSON.stringify(params || {});

    // Check cache
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    // Generate new content
    const content = await this.generateContent(params);

    // Cache the result
    this.cache.set(cacheKey, {
      data: content,
      timestamp: Date.now(),
    });

    return content;
  };

  private async generateContent(params?: Record<string, any>): Promise<string> {
    // Implementation to generate content
    return "<p>Cached content</p>";
  }
}
```

## Best Practices for Section Editing

### Content Changes

- **Maintain accessibility**: Ensure new content is accessible to all users
- **Preserve functionality**: Don't break existing features
- **Test thoroughly**: Verify changes work in all scenarios

### Load Method Changes

- **Consider performance**: Use lazy loading for heavy content
- **User experience**: Balance immediate feedback with performance
- **Progressive enhancement**: Support users with JavaScript disabled

### Parameter Changes

- **Validation**: Always validate input parameters
- **Documentation**: Document parameter requirements and defaults
- **Backward compatibility**: Maintain compatibility with existing calls

### Testing

- **Unit tests**: Test individual section functionality
- **Integration tests**: Test section within the page context
- **Performance tests**: Measure load times and resource usage
- **User testing**: Get feedback on usability and functionality

This guide provides comprehensive instructions for editing sections to improve functionality, performance, and user experience while maintaining the modular architecture.
