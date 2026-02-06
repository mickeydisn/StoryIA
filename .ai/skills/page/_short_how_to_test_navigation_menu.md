---
name: "Short How to Test Navigation Menu"
summary: "Quick guide for testing navigation menu functionality and ensuring all pages respond correctly"
params:
  - test_pages: "List of pages to test in navigation"
  - test_scenarios: "Types of tests to perform (basic, performance, accessibility)"
---

# How to Test Navigation Menu

Quick guide for testing navigation menu functionality and ensuring all pages respond correctly.

## Overview

Testing navigation involves:

1. **Basic functionality testing** - Verify all navigation links work
2. **Page response testing** - Check pages load correctly
3. **Error handling testing** - Identify broken links
4. **Performance testing** - Measure load times
5. **Accessibility testing** - Ensure navigation is accessible
6. **Cross-browser testing** - Verify compatibility
7. **Mobile responsiveness testing** - Check mobile devices

## Step 1: Basic Functionality Testing

Verify all navigation menu items work correctly.

### Manual Testing Checklist

```bash
# 1. Start the server
deno run --allow-all main.ts

# 2. Open browser and navigate to main application
# 3. Test each navigation item manually:
#    - Click each menu button
#    - Verify page loads correctly
#    - Check for error messages
#    - Verify page content is displayed
#    - Test browser back/forward buttons
```

### Automated Basic Testing

```typescript
describe("Navigation Menu Basic Testing", () => {
  const navigationItems = [
    { name: "Home", url: "/page/home", expectedTitle: "🏠 Home" },
    {
      name: "Local Agent",
      url: "/page/local-agent",
      expectedTitle: "🤖 Local Agent Dashboard",
    },
    {
      name: "File Sections",
      url: "/page/section-files",
      expectedTitle: "📁 File Sections",
    },
    {
      name: "References",
      url: "/page/references",
      expectedTitle: "📊 References",
    },
    {
      name: "References v2",
      url: "/page/references2",
      expectedTitle: "📊 References v2",
    },
  ];

  navigationItems.forEach((item) => {
    test(`Navigation to ${item.name} should work`, async () => {
      const response = await fetch(`http://localhost:8000${item.url}`);

      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toContain("text/html");

      const html = await response.text();
      expect(html).toContain(item.expectedTitle);
      expect(html).toContain('<div class="page-content-box">');
    });
  });
});
```

### HTMX Integration Testing

```typescript
describe("HTMX Navigation Testing", () => {
  test("HTMX attributes are present", async () => {
    const response = await fetch("http://localhost:8000/menu/navigation");
    const html = await response.text();

    expect(html).toContain("hx-get");
    expect(html).toContain('hx-target="#page-content"');
    expect(html).toContain('hx-trigger="click"');
  });

  test("HTMX content loading works", async () => {
    const menuResponse = await fetch("http://localhost:8000/menu/navigation");
    const menuHtml = await menuResponse.text();

    const firstLinkMatch = menuHtml.match(/hx-get="([^"]+)"/);
    expect(firstLinkMatch).toBeTruthy();

    const firstLink = firstLinkMatch[1];
    const pageResponse = await fetch(`http://localhost:8000${firstLink}`);

    expect(pageResponse.status).toBe(200);
    const pageHtml = await pageResponse.text();
    expect(pageHtml).toContain('<div class="page-content-box">');
  });
});
```

## Step 2: Page Response Testing

Verify each page responds correctly and returns expected content.

### Response Code Testing

```bash
# Test all navigation pages return 200 status
echo "Testing page responses..."

pages=(
  "/page/home"
  "/page/local-agent"
  "/page/section-files"
  "/page/references"
  "/page/references2"
)

for page in "${pages[@]}"; do
  echo "Testing $page..."
  response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:8000$page")

  if [ "$response" = "200" ]; then
    echo "✓ $page - OK"
  else
    echo "✗ $page - Error: HTTP $response"
  fi
done
```

### Content Validation Testing

```typescript
describe("Page Content Validation", () => {
  const pageTests = [
    {
      url: "/page/home",
      expectedElements: ["<h1>", "Home", "page-content-box"],
      unexpectedElements: ["Error", "Not Found", "404"],
    },
    {
      url: "/page/local-agent",
      expectedElements: ["Local Agent Dashboard", "My Local Agent", "cat"],
      unexpectedElements: ["Error", "Missing", "Unavailable"],
    },
  ];

  pageTests.forEach((test) => {
    test(`Page ${test.url} content validation`, async () => {
      const response = await fetch(`http://localhost:8000${test.url}`);
      const html = await response.text();

      test.expectedElements.forEach((element) => {
        expect(html).toContain(element);
      });

      test.unexpectedElements.forEach((element) => {
        expect(html).not.toContain(element);
      });
    });
  });
});
```

## Step 3: Error Handling Testing

Identify and resolve broken links or missing pages.

### Broken Link Detection

```bash
# Script to detect broken navigation links
#!/bin/bash

echo "=== Broken Link Detection ==="

# Get navigation menu content
menu_content=$(curl -s "http://localhost:8000/menu/navigation")

# Extract all hx-get URLs
urls=$(echo "$menu_content" | grep -o 'hx-get="[^"]*"' | sed 's/hx-get="//' | sed 's/"//')

echo "Found URLs:"
echo "$urls"

# Test each URL
for url in $urls; do
  if [[ $url == /page/* ]]; then
    echo "Testing: $url"
    status=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:8000$url")

    if [ "$status" = "200" ]; then
      echo "  ✓ OK"
    else
      echo "  ✗ BROKEN (HTTP $status)"
    fi
  fi
done
```

### Error Page Testing

```typescript
describe("Error Handling Testing", () => {
  test("404 pages return proper error", async () => {
    const response = await fetch("http://localhost:8000/page/nonexistent-page");
    expect(response.status).toBe(404);

    const html = await response.text();
    expect(html).toContain("404") || expect(html).toContain("Not Found");
  });

  test("Broken section links are handled gracefully", async () => {
    const response = await fetch(
      "http://localhost:8000/api/nonexistent-section"
    );
    expect(response.status).toBe(404);
  });
});
```

## Step 4: Performance Testing

Measure load times and responsiveness of navigation.

### Load Time Testing

```bash
# Performance testing script
echo "=== Performance Testing ==="

pages=(
  "/page/home"
  "/page/local-agent"
  "/page/section-files"
  "/page/references"
)

echo "Testing page load times..."

for page in "${pages[@]}"; do
  echo "Testing $page..."

  # Measure load time
  time_output=$(curl -w "@curl-format.txt" -o /dev/null -s "http://localhost:8000$page")
  echo "  $time_output"

  # Check if load time is acceptable (< 2 seconds)
  load_time=$(echo "$time_output" | grep -o 'time_total:[0-9.]*' | cut -d: -f2)
  if (( $(echo "$load_time < 2.0" | bc -l) )); then
    echo "  ✓ Load time acceptable"
  else
    echo "  ⚠ Load time slow: ${load_time}s"
  fi
done
```

### Concurrent Request Testing

```typescript
describe("Concurrent Request Testing", () => {
  test("Multiple navigation requests handle correctly", async () => {
    const pages = ["/page/home", "/page/local-agent", "/page/section-files"];

    const promises = pages.map((page) => fetch(`http://localhost:8000${page}`));
    const responses = await Promise.all(promises);

    responses.forEach((response, index) => {
      expect(response.status).toBe(200);
      expect(pages[index]).toContain("/page/");
    });
  });

  test("Navigation responsiveness under load", async () => {
    const startTime = Date.now();

    for (let i = 0; i < 10; i++) {
      await fetch("http://localhost:8000/page/home");
    }

    const endTime = Date.now();
    const totalTime = endTime - startTime;

    expect(totalTime).toBeLessThan(5000); // Should complete in under 5 seconds
  });
});
```

## Step 5: Accessibility Testing

Ensure navigation is accessible to all users.

### Keyboard Navigation Testing

```typescript
describe("Keyboard Navigation Testing", () => {
  test("Navigation buttons are focusable", async () => {
    const response = await fetch("http://localhost:8000/menu/navigation");
    const html = await response.text();

    expect(html).toContain("<button");
    expect(html).toContain('class="nav-button"');
    expect(html).toContain('role="button"') ||
      expect(html).toContain("tabindex");
  });
});
```

### Screen Reader Testing

```typescript
describe("Screen Reader Testing", () => {
  test("Navigation has proper semantic structure", async () => {
    const response = await fetch("http://localhost:8000/menu/navigation");
    const html = await response.text();

    expect(html).toContain("<nav");
    expect(html).toContain('class="sidebar-nav"');
    expect(html).toContain("aria-label") || expect(html).toContain("title");
  });

  test("Navigation items have descriptive labels", async () => {
    const response = await fetch("http://localhost:8000/menu/navigation");
    const html = await response.text();

    expect(html).toContain("Home") || expect(html).toContain("🏠");
    expect(html).toContain("Local Agent") || expect(html).toContain("🤖");
  });
});
```

## Step 6: Cross-Browser Testing

Verify navigation compatibility across different browsers.

### Browser Compatibility Testing

```javascript
describe("Cross-Browser Navigation Testing", () => {
  test("Navigation works in modern browsers", async () => {
    expect(typeof window.htmx).toBe("object");
    expect(typeof fetch).toBe("function");

    const navElement = document.querySelector(".sidebar-nav");
    expect(navElement).toBeTruthy();
    expect(navElement.children.length).toBeGreaterThan(0);
  });
});
```

### Browser-Specific Testing

```bash
# Browser-specific testing checklist
echo "=== Cross-Browser Testing Checklist ==="

browsers=(
  "Chrome"
  "Firefox"
  "Safari"
  "Edge"
  "Opera"
)

for browser in "${browsers[@]}"; do
  echo "Testing in $browser:"
  echo "  ✓ Navigation buttons clickable"
  echo "  ✓ Pages load correctly"
  echo "  ✓ HTMX functionality works"
  echo "  ✓ No JavaScript errors"
  echo "  ✓ Responsive design works"
  echo ""
done
```

## Step 7: Mobile Responsiveness Testing

Check navigation on mobile devices and different screen sizes.

### Responsive Design Testing

```css
/* CSS for responsive navigation testing */
@media (max-width: 768px) {
  .sidebar-nav {
    position: fixed;
    width: 100%;
    z-index: 1000;
  }

  .nav-button {
    width: 100%;
    margin-bottom: 5px;
  }
}
```

### Mobile Testing Script

```bash
# Mobile responsiveness testing
echo "=== Mobile Responsiveness Testing ==="

viewports=(
  "320x568"   # iPhone 5
  "375x667"   # iPhone 6/7/8
  "414x896"   # iPhone XR
  "768x1024"  # iPad
  "1920x1080" # Desktop
)

for viewport in "${viewports[@]}"; do
  echo "Testing viewport: $viewport"
  echo "  Manual testing required for viewport $viewport"
  echo "  Check:"
  echo "    - Navigation layout"
  echo "    - Button sizing"
  echo "    - Touch targets"
  echo "    - Scrolling behavior"
  echo ""
done
```

## Step 8: Automated Testing Suite

Create comprehensive automated testing suite.

### Complete Test Suite

```typescript
describe("Complete Navigation Menu Testing", () => {
  const config = {
    baseUrl: "http://localhost:8000",
    pages: [
      { name: "Home", url: "/page/home", expectedTitle: "🏠 Home" },
      {
        name: "Local Agent",
        url: "/page/local-agent",
        expectedTitle: "🤖 Local Agent Dashboard",
      },
      {
        name: "File Sections",
        url: "/page/section-files",
        expectedTitle: "📁 File Sections",
      },
      {
        name: "References",
        url: "/page/references",
        expectedTitle: "📊 References",
      },
      {
        name: "References v2",
        url: "/page/references2",
        expectedTitle: "📊 References v2",
      },
    ],
    timeout: 5000,
  };

  describe("Basic Functionality", () => {
    test("All navigation pages respond correctly", async () => {
      for (const page of config.pages) {
        const response = await fetch(`${config.baseUrl}${page.url}`);

        expect(response.status).toBe(200);
        expect(response.headers.get("content-type")).toContain("text/html");

        const html = await response.text();
        expect(html).toContain(page.expectedTitle);
      }
    });

    test("HTMX integration works", async () => {
      const response = await fetch(`${config.baseUrl}/menu/navigation`);
      const html = await response.text();

      expect(html).toContain("hx-get");
      expect(html).toContain('hx-target="#page-content"');
    });
  });

  describe("Performance", () => {
    test("All pages load within acceptable time", async () => {
      const startTime = Date.now();

      for (const page of config.pages) {
        await fetch(`${config.baseUrl}${page.url}`);
      }

      const totalTime = Date.now() - startTime;
      expect(totalTime).toBeLessThan(10000); // 10 seconds for all pages
    });
  });

  describe("Error Handling", () => {
    test("404 pages return proper error", async () => {
      const response = await fetch(`${config.baseUrl}/page/nonexistent`);
      expect(response.status).toBe(404);
    });
  });

  describe("Content Validation", () => {
    test("Pages contain expected content structure", async () => {
      for (const page of config.pages) {
        const response = await fetch(`${config.baseUrl}${page.url}`);
        const html = await response.text();

        expect(html).toContain('<div class="page-content-box">');
        expect(html).not.toContain("Error");
        expect(html).not.toContain("Not Found");
      }
    });
  });
});
```

## Common Issues and Solutions

### Issue 1: Broken Navigation Links

**Problem**: Navigation buttons don't load pages or return 404 errors.

**Solution**:

```bash
# Check if page assets are registered
grep -r "page-name" deno/ts/routes/main_routes.ts

# Verify page asset file exists
ls -la deno/ts/assets/page/page-name/

# Check page asset extends correct base class
grep "extends AssetPageSection" deno/ts/assets/page/page-name/page-name_asset.ts
```

### Issue 2: Slow Page Loading

**Problem**: Pages take too long to load when clicked from navigation.

**Solution**:

```bash
# Check server logs for errors
tail -f deno.log

# Monitor resource usage
top -p $(pgrep -f "deno run")

# Test individual section loading
curl -w "@curl-format.txt" -o /dev/null -s "http://localhost:8000/api/section-name"
```

### Issue 3: HTMX Not Working

**Problem**: Navigation clicks don't load content dynamically.

**Solution**:

```bash
# Check if HTMX is loaded
curl -s "http://localhost:8000/" | grep -i htmx

# Verify HTMX attributes in navigation
curl -s "http://localhost:8000/menu/navigation" | grep hx-get

# Test HTMX manually
curl -H "HX-Request: true" "http://localhost:8000/page/home"
```

## Best Practices

### Testing Strategy

- **Automate repetitive tests** - Use scripts for basic functionality
- **Manual testing for UX** - Test user experience manually
- **Regular regression testing** - Run tests after each change
- **Performance monitoring** - Track load times over time

### Test Environment

- **Use production-like data** - Test with realistic content
- **Multiple device testing** - Test on various screen sizes
- **Network condition simulation** - Test with slow connections
- **Browser version testing** - Test on different browser versions

### Documentation

- **Test case documentation** - Document all test scenarios
- **Issue tracking** - Track and document navigation issues
- **Performance baselines** - Establish performance benchmarks
- **Accessibility guidelines** - Document accessibility requirements

This guide provides quick instructions for comprehensive navigation testing to ensure reliable functionality across all scenarios.
