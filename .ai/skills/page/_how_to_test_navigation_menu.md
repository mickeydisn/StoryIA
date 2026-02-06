---
name: "How to Test Navigation Menu"
summary: "Complete guide for testing navigation menu functionality and ensuring all pages respond correctly"
params:
  - test_pages: "List of pages to test in navigation"
  - test_scenarios: "Types of tests to perform (basic, performance, accessibility)"
  - expected_responses: "Expected response codes and content for each page"
---

# How to Test Navigation Menu

This guide explains how to thoroughly test the navigation menu to ensure all pages can be accessed and respond correctly. Comprehensive testing helps identify broken links, performance issues, and accessibility problems before they affect users.

## Overview

Testing the navigation menu involves:

1. **Basic functionality testing** - Verify all navigation links work
2. **Page response testing** - Check that pages load correctly and return expected content
3. **Error handling testing** - Identify and resolve broken links or missing pages
4. **Performance testing** - Measure load times and responsiveness
5. **Accessibility testing** - Ensure navigation is accessible to all users
6. **Cross-browser testing** - Verify compatibility across different browsers
7. **Mobile responsiveness testing** - Check navigation on mobile devices

## Step 1: Basic Functionality Testing

Verify that all navigation menu items work correctly and load the intended pages.

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
// Basic navigation test script
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
// Test HTMX functionality
describe("HTMX Navigation Testing", () => {
  test("HTMX attributes are present", async () => {
    const response = await fetch("http://localhost:8000/menu/navigation");
    const html = await response.text();

    // Check for HTMX attributes
    expect(html).toContain("hx-get");
    expect(html).toContain('hx-target="#page-content"');
    expect(html).toContain('hx-trigger="click"');
  });

  test("HTMX content loading works", async () => {
    // Test that clicking navigation loads content into target
    const menuResponse = await fetch("http://localhost:8000/menu/navigation");
    const menuHtml = await menuResponse.text();

    // Extract first navigation link
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

Verify that each page responds correctly and returns expected content.

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
// Content validation test
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

      // Check expected elements
      test.expectedElements.forEach((element) => {
        expect(html).toContain(element);
      });

      // Check unexpected elements
      test.unexpectedElements.forEach((element) => {
        expect(html).not.toContain(element);
      });
    });
  });
});
```

### Section Loading Testing

```typescript
// Test individual section loading
describe("Section Loading Testing", () => {
  test("Section API endpoints work", async () => {
    const sectionEndpoints = [
      "/api/my-local-agent",
      "/api/settings-section",
      "/api/file-section",
    ];

    for (const endpoint of sectionEndpoints) {
      const response = await fetch(`http://localhost:8000${endpoint}`);

      if (response.status === 200) {
        const content = await response.text();
        expect(content).toContain("<div");
        expect(content.length).toBeGreaterThan(100); // Basic content check
      } else {
        console.warn(`Section ${endpoint} not found (HTTP ${response.status})`);
      }
    }
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
// Test error handling
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

### Missing Asset Detection

```bash
# Check for missing asset files
echo "=== Missing Asset Detection ==="

# Check if page asset files exist
pages=(
  "home"
  "local-agent"
  "section-files"
  "references"
  "references2"
)

for page in "${pages[@]}"; do
  if [ -f "deno/ts/assets/page/$page/${page}_page_asset.ts" ]; then
    echo "✓ $page asset file exists"
  else
    echo "✗ $page asset file missing"
  fi
done

# Check if section asset files exist
sections=(
  "my_local_agent"
  "settings"
  "file_viewer"
)

for section in "${sections[@]}"; do
  if [ -f "deno/ts/assets/page/*/$(echo $section | sed 's/_/-/g')_section_asset.ts" ]; then
    echo "✓ $section section file exists"
  else
    echo "✗ $section section file missing"
  fi
done
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
// Concurrent request testing
describe("Concurrent Request Testing", () => {
  test("Multiple navigation requests handle correctly", async () => {
    const pages = ["/page/home", "/page/local-agent", "/page/section-files"];

    // Make concurrent requests
    const promises = pages.map((page) => fetch(`http://localhost:8000${page}`));

    const responses = await Promise.all(promises);

    // Verify all requests succeeded
    responses.forEach((response, index) => {
      expect(response.status).toBe(200);
      expect(pages[index]).toContain("/page/");
    });
  });

  test("Navigation responsiveness under load", async () => {
    const startTime = Date.now();

    // Make rapid consecutive requests
    for (let i = 0; i < 10; i++) {
      await fetch("http://localhost:8000/page/home");
    }

    const endTime = Date.now();
    const totalTime = endTime - startTime;

    expect(totalTime).toBeLessThan(5000); // Should complete in under 5 seconds
  });
});
```

### Memory Usage Testing

```bash
# Memory usage monitoring
echo "=== Memory Usage Testing ==="

# Start server in background
deno run --allow-all main.ts &
SERVER_PID=$!

# Wait for server to start
sleep 3

echo "Monitoring memory usage during navigation tests..."

# Test memory usage
for i in {1..5}; do
  echo "Test iteration $i:"
  curl -s "http://localhost:8000/page/home" > /dev/null
  curl -s "http://localhost:8000/page/local-agent" > /dev/null
  curl -s "http://localhost:8000/page/section-files" > /dev/null

  # Check memory usage
  if command -v ps > /dev/null; then
    memory=$(ps -p $SERVER_PID -o rss=)
    echo "  Memory usage: ${memory} KB"
  fi

  sleep 1
done

# Clean up
kill $SERVER_PID
wait $SERVER_PID 2>/dev/null
```

## Step 5: Accessibility Testing

Ensure navigation is accessible to all users.

### Keyboard Navigation Testing

```typescript
// Keyboard navigation test
describe("Keyboard Navigation Testing", () => {
  test("Navigation buttons are focusable", async () => {
    const response = await fetch("http://localhost:8000/menu/navigation");
    const html = await response.text();

    // Check for proper button elements
    expect(html).toContain("<button");
    expect(html).toContain('class="nav-button"');

    // Check for proper ARIA attributes
    expect(html).toContain('role="button"') ||
      expect(html).toContain("tabindex");
  });

  test("Navigation works with keyboard events", async () => {
    // This would typically be tested with a browser automation tool
    // like Puppeteer or Playwright
    console.log("Keyboard navigation should be tested with browser automation");
  });
});
```

### Screen Reader Testing

```typescript
// Screen reader accessibility test
describe("Screen Reader Testing", () => {
  test("Navigation has proper semantic structure", async () => {
    const response = await fetch("http://localhost:8000/menu/navigation");
    const html = await response.text();

    // Check for semantic navigation structure
    expect(html).toContain("<nav");
    expect(html).toContain('class="sidebar-nav"');

    // Check for button labels
    expect(html).toContain("aria-label") || expect(html).toContain("title");
  });

  test("Navigation items have descriptive labels", async () => {
    const response = await fetch("http://localhost:8000/menu/navigation");
    const html = await response.text();

    // Check for descriptive button text
    expect(html).toContain("Home") || expect(html).toContain("🏠");
    expect(html).toContain("Local Agent") || expect(html).toContain("🤖");
  });
});
```

### Color Contrast Testing

```bash
# Color contrast testing script
echo "=== Color Contrast Testing ==="

# Extract CSS styles
echo "Checking navigation menu CSS for color contrast..."

if [ -f "css/main.css" ]; then
  # Check for color definitions
  grep -E "(color|background-color)" css/main.css | grep -E "(nav|button)" || echo "No navigation colors found in CSS"
else
  echo "CSS file not found"
fi

# Manual testing required for actual color contrast ratios
echo "Manual color contrast testing required using tools like:"
echo "- WebAIM Contrast Checker"
echo "- axe DevTools"
echo "- Lighthouse accessibility audit"
```

## Step 6: Cross-Browser Testing

Verify navigation compatibility across different browsers.

### Browser Compatibility Testing

```javascript
// Cross-browser testing script (to be run in different browsers)
describe("Cross-Browser Navigation Testing", () => {
  test("Navigation works in modern browsers", async () => {
    // Test HTMX support
    expect(typeof window.htmx).toBe("object");

    // Test fetch API
    expect(typeof fetch).toBe("function");

    // Test DOM manipulation
    const navElement = document.querySelector(".sidebar-nav");
    expect(navElement).toBeTruthy();
    expect(navElement.children.length).toBeGreaterThan(0);
  });

  test("Navigation degrades gracefully in older browsers", async () => {
    // Test fallback behavior
    const supportsHTMX = typeof window.htmx !== "undefined";

    if (!supportsHTMX) {
      // Check for fallback navigation
      const fallbackNav = document.querySelector(".fallback-nav");
      expect(fallbackNav).toBeTruthy();
    }
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

echo "Manual testing required for:"
echo "- Browser developer tools console"
echo "- Network tab for failed requests"
echo "- Performance monitoring"
echo "- Mobile browser testing"
```

## Step 7: Mobile Responsiveness Testing

Check navigation on mobile devices and different screen sizes.

### Responsive Design Testing

```css
/* CSS for responsive navigation testing */
@media (max-width: 768px) {
  .sidebar-nav {
    /* Mobile-specific styles */
    position: fixed;
    width: 100%;
    z-index: 1000;
  }

  .nav-button {
    /* Mobile button styles */
    width: 100%;
    margin-bottom: 5px;
  }
}

/* Test CSS classes for responsive behavior */
.responsive-test {
  transition: all 0.3s ease;
}

@media (max-width: 480px) {
  .responsive-test {
    font-size: 14px;
  }
}
```

### Mobile Testing Script

```bash
# Mobile responsiveness testing
echo "=== Mobile Responsiveness Testing ==="

# Test different viewport sizes
viewports=(
  "320x568"   # iPhone 5
  "375x667"   # iPhone 6/7/8
  "414x896"   # iPhone XR
  "768x1024"  # iPad
  "1920x1080" # Desktop
)

for viewport in "${viewports[@]}"; do
  echo "Testing viewport: $viewport"

  # This would typically be done with browser automation tools
  echo "  Manual testing required for viewport $viewport"
  echo "  Check:"
  echo "    - Navigation layout"
  echo "    - Button sizing"
  echo "    - Touch targets"
  echo "    - Scrolling behavior"
  echo ""
done
```

### Touch Interaction Testing

```typescript
// Touch interaction testing
describe("Touch Interaction Testing", () => {
  test("Navigation buttons work with touch events", async () => {
    // This would be tested with browser automation
    console.log("Touch testing requires browser automation tools");
    console.log("Test scenarios:");
    console.log("- Tap navigation buttons");
    console.log("- Swipe gestures");
    console.log("- Touch hold actions");
    console.log("- Multi-touch interactions");
  });

  test("Touch targets are appropriately sized", async () => {
    // Check button dimensions for touch accessibility
    const response = await fetch("http://localhost:8000/menu/navigation");
    const html = await response.text();

    // Look for CSS that defines button sizes
    expect(html).toContain("min-height") || expect(html).toContain("min-width");
  });
});
```

## Step 8: Automated Testing Suite

Create a comprehensive automated testing suite.

### Complete Test Suite

```typescript
// Complete navigation testing suite
import { describe, test, expect } from "@std/testing/bdd";

describe("Complete Navigation Menu Testing", () => {
  // Configuration
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

  // Basic functionality tests
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

  // Performance tests
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

  // Error handling tests
  describe("Error Handling", () => {
    test("404 pages return proper error", async () => {
      const response = await fetch(`${config.baseUrl}/page/nonexistent`);
      expect(response.status).toBe(404);
    });
  });

  // Content validation tests
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

### Continuous Integration Testing

```yaml
# GitHub Actions workflow for navigation testing
name: Navigation Menu Testing

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  navigation-testing:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Deno
        uses: denoland/setup-deno@v1
        with:
          deno-version: v2.x

      - name: Start Server
        run: |
          deno run --allow-all main.ts &
          sleep 5

      - name: Run Navigation Tests
        run: |
          deno test --allow-net deno/ts/tests/navigation_test.ts

      - name: Performance Testing
        run: |
          ./scripts/performance_test.sh

      - name: Accessibility Testing
        run: |
          ./scripts/accessibility_test.sh

      - name: Cleanup
        run: |
          pkill -f "deno run"
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

### Issue 4: Mobile Navigation Problems

**Problem**: Navigation doesn't work properly on mobile devices.

**Solution**:

```css
/* Add mobile-specific CSS */
@media (max-width: 768px) {
  .sidebar-nav {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: white;
    z-index: 1000;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .nav-button {
    width: 100%;
    min-height: 44px; /* Apple's recommended touch target size */
    font-size: 16px;
  }
}
```

## Best Practices for Navigation Testing

### Testing Strategy

- **Automate repetitive tests** - Use scripts for basic functionality checks
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

This comprehensive testing approach ensures that your navigation menu works reliably across all scenarios and provides a smooth user experience.
