---
name: "How to Create a Short How-To Documentation"
summary: "Template and guide for creating concise how-to documentation files"
params:
  - topic: "Topic or feature to document"
  - target_audience: "Intended audience for the documentation"
  - complexity_level: "Complexity level (beginner, intermediate, advanced)"
---

# How to Create a Short How-To Documentation

Template and guide for creating concise how-to documentation files that focus on actionable steps and essential information.

## Overview

Short how-to documentation should:

1. **Focus on actionable steps** - Emphasize practical implementation
2. **Limit examples** - Include only essential code examples
3. **Be concise** - Keep under 250 lines total
4. **Provide quick reference** - Designed for rapid implementation
5. **Maintain essential guidance** - Include key best practices and troubleshooting

## Step 1: Define Documentation Structure

### Front Matter Configuration

```yaml
---
name: "Concise topic description"
summary: "Brief summary of what this covers"
params:
  - param1: "Essential parameter description"
  - param2: "Essential parameter description"
---
```

### Documentation Sections

1. **Overview** - Brief explanation of the topic
2. **Step-by-Step Instructions** - Essential implementation steps only
3. **Best Practices** - Key recommendations (3-5 points)
4. **Common Issues** - Top 2-3 troubleshooting items
5. **Quick Checklist** - Implementation verification

## Step 2: Write Concise Content

### Overview Section

```markdown
# Topic Title

Brief explanation (2-3 sentences) covering:

- What this accomplishes
- When to use it
- Key benefits
```

### Step-by-Step Instructions

For each step:

- **Clear, actionable title** - Use imperative mood
- **Essential explanation** - One sentence why
- **Minimal code** - Only necessary code
- **No variations** - Single recommended approach

## Step 3: Focus on Essentials

### Best Practices Section

```markdown
## Best Practices

- **Practice 1** - Brief description (one line)
- **Practice 2** - Brief description (one line)
- **Practice 3** - Brief description (one line)
```

### Common Issues Section

```markdown
## Common Issues

### Issue: Brief description

**Solution**: One-line resolution

### Issue: Brief description

**Solution**: One-line resolution
```

## Step 4: Create Quick Checklist

```markdown
## Quick Checklist

- [ ] Step 1 completed
- [ ] Step 2 completed
- [ ] Step 3 completed
- [ ] Best practices applied
- [ ] Testing verified
```

## Step 5: Maintain Brevity

### Content Guidelines

- **Total length**: Under 250 lines
- **Code examples**: Maximum 3-5 lines each
- **Explanations**: One sentence per concept
- **Examples**: One per step maximum
- **Best practices**: 3-5 bullet points
- **Troubleshooting**: 2-3 common issues

### What to Omit

- Detailed background information
- Multiple implementation approaches
- Extensive code variations
- Advanced edge cases
- Comprehensive testing strategies
- Extensive references

## Step 6: Template Structure

````markdown
---
name: "Topic Name"
summary: "Brief description"
params:
  - param1: "Description"
---

# Topic Title

## Overview

[Brief 2-3 sentence explanation]

## Step 1: [Actionable Title]

[One sentence explanation]

```code
[Essential code only]
```
````

## Step 2: [Actionable Title]

[One sentence explanation]

```code
[Essential code only]
```

## Step 3: [Actionable Title]

[One sentence explanation]

```code
[Essential code only]
```

## Best Practices

- **Practice 1** - One line description
- **Practice 2** - One line description
- **Practice 3** - One line description

## Common Issues

### Issue: Brief description

**Solution**: One-line resolution

### Issue: Brief description

**Solution**: One-line resolution

## Quick Checklist

- [ ] Step 1 completed
- [ ] Step 2 completed
- [ ] Step 3 completed
- [ ] Best practices applied
- [ ] Testing verified
