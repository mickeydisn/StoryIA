#!/usr/bin/env -S deno run --allow-read --allow-write

/**
 * Markdown Template Validation Script
 *
 * This script validates markdown files against a template structure.
 * It compares the section hierarchy of a template file (.tpl.md) with actual markdown files (.md)
 * and reports missing sections/subsections.
 */

interface SectionNode {
  title: string;
  level: number;
  content: string;
  children: SectionNode[];
  isComplete: boolean;
}

interface ValidationResult {
  isValid: boolean;
  missingSectionsCount: number;
  totalSections: number;
  completionPercentage: number;
  missingSections: SectionNode[];
}

interface ValidationOptions {
  mode: "check" | "short" | "detailed";
  templatePath?: string;
  targetPath: string;
}

/**
 * Convert wildcard pattern to regex
 */
function wildcardToRegex(pattern: string): RegExp {
  // Escape regex special characters
  let regexPattern = pattern.replace(/[.+?^${}()|\[\]]/g, "\\$&");
  // Replace * with .* (match any characters)
  regexPattern = regexPattern.replace(/\*/g, ".*");
  // Replace [A-Z_] with .* (match any characters)
  regexPattern = regexPattern.replace(/\[A-Z_\]/g, ".*");
  return new RegExp(`^${regexPattern}$`);
}

/**
 * Check if a title matches a wildcard pattern
 */
function matchesWildcardPattern(
  templateTitle: string,
  targetTitle: string
): boolean {
  if (templateTitle.includes("*") || templateTitle.includes("[A-Z_]")) {
    const regex = wildcardToRegex(templateTitle);
    return regex.test(targetTitle);
  }
  return templateTitle === targetTitle;
}

/**
 * Find matching sections in target (excluding root) with depth checking and wildcard support
 */
function findMatchingSections(
  templateNode: SectionNode,
  targetNode: SectionNode,
  depth = 0
): boolean {
  if (templateNode.title === "root") {
    for (const child of templateNode.children) {
      if (!findMatchingSections(child, targetNode, depth + 1)) {
        // placeholder for missing logic
      }
    }
    return true;
  }

  const matchingChild = targetNode.children.find(
    (child) =>
      matchesWildcardPattern(templateNode.title, child.title) &&
      child.level === templateNode.level
  );

  if (matchingChild) {
    // placeholder for found logic
    return true;
  }
  return false;
}

/**
 * Parse markdown file into a hierarchical section tree
 */
function parseMarkdownToTree(content: string): SectionNode {
  const lines = content.split("\n");
  const root: SectionNode = {
    title: "root",
    level: 0,
    content: "",
    children: [],
    isComplete: true,
  };

  let currentParent = root as SectionNode;
  let currentContent = "";

  for (const line of lines) {
    const headerMatch = line.match(/^(#+)\s+(.+)/);
    if (headerMatch) {
      if (currentContent.trim()) {
        currentParent.content += currentContent.trim() + "\n";
      }

      const headerLevel = headerMatch[1].length;
      const headerTitle = headerMatch[2].trim();

      const newNode: SectionNode = {
        title: headerTitle,
        level: headerLevel,
        content: "",
        children: [],
        isComplete: false,
      };

      let parent = currentParent;
      while (parent.level >= headerLevel) {
        const foundParent = findParentNode(root, parent, headerLevel - 1);
        if (foundParent) {
          parent = foundParent;
        } else {
          break;
        }
      }

      parent.children.push(newNode);
      currentParent = newNode;
      currentContent = "";
    } else {
      currentContent += line + "\n";
    }
  }

  if (currentContent.trim()) {
    currentParent.content += currentContent.trim();
  }

  return root;
}

/**
 * Find parent node at the specified level
 */
function findParentNode(
  root: SectionNode,
  current: SectionNode,
  targetLevel: number
): SectionNode {
  let parent = current;
  while (parent && parent.level > targetLevel) {
    const foundParent = findParentOfNode(root, parent);
    if (foundParent) {
      parent = foundParent;
    } else {
      break;
    }
  }
  return parent;
}

/**
 * Find the parent of a given node
 */
function findParentOfNode(
  root: SectionNode,
  node: SectionNode
): SectionNode | null {
  const stack: SectionNode[] = [root];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) continue;

    for (const child of current.children) {
      if (child === node) {
        return current;
      }
      stack.push(child);
    }
  }

  return null;
}

/**
 * Compare two section trees and identify missing sections
 */
function compareTrees(
  templateTree: SectionNode,
  targetTree: SectionNode
): ValidationResult {
  let totalSections = 0;
  let foundSections = 0;
  const missingSections: SectionNode[] = [];

  function countSections(node: SectionNode) {
    if (node.title !== "root") {
      totalSections++;
    }
    for (const child of node.children) {
      countSections(child);
    }
  }

  countSections(templateTree);
  // placeholder for matching logic

  const completionPercentage =
    totalSections > 0 ? Math.round((foundSections / totalSections) * 100) : 0;

  return {
    isValid: missingSections.length === 0,
    missingSectionsCount: missingSections.length,
    totalSections,
    completionPercentage,
    missingSections,
  };
}

/**
 * Generate validation report based on mode
 */
function generateReport(
  result: ValidationResult,
  options: ValidationOptions
): string {
  if (result.isValid) {
    return "Valid: The document matches the template structure completely.";
  }

  const validSectionsCount = result.totalSections - result.missingSectionsCount;

  switch (options.mode) {
    case "check":
      return `Invalid: Missing ${result.missingSectionsCount} sections, ${validSectionsCount} valid sections (${result.completionPercentage}% complete)`;
    case "short":
      return generateShortReport(result);
    case "detailed":
      return generateDetailedReport(result);
    default:
      return "Invalid mode specified";
  }
}

/**
 * Generate short report with just section titles
 */
function generateShortReport(result: ValidationResult): string {
  let report = `# Missing Sections Report\n\n`;
  report += `**Status**: Invalid (${result.missingSectionsCount} sections missing, ${result.completionPercentage}% complete)\n\n`;
  report += `## Missing Sections\n\n`;

  for (const section of result.missingSections) {
    const indent = "  ".repeat(Math.max(0, section.level - 1));
    report += `${indent}- ${section.title}\n`;
  }

  return report;
}

/**
 * Generate detailed report with section content
 */
function generateDetailedReport(result: ValidationResult): string {
  let report = `# Detailed Missing Sections Report\n\n`;
  report += `**Status**: Invalid (${result.missingSectionsCount} sections missing, ${result.completionPercentage}% complete)\n\n`;
  report += `## Missing Sections with Content\n\n`;

  for (const section of result.missingSections) {
    const indent = "  ".repeat(Math.max(0, section.level - 1));
    report += `${indent}### ${section.title}\n\n`;

    if (section.content.trim()) {
      report += `${section.content.trim()}\n\n`;
    } else {
      report += `(No content in template)\n\n`;
    }

    if (section.children.length > 0) {
      report += addChildrenSections(section.children, section.level + 1);
    }
  }

  return report;
}

/**
 * Recursively add child sections to detailed report
 */
function addChildrenSections(
  children: SectionNode[],
  baseLevel: number
): string {
  let content = "";

  for (const child of children) {
    const indent = "  ".repeat(Math.max(0, child.level - 1));
    content += `${indent}#### ${child.title}\n\n`;

    if (child.content.trim()) {
      content += `${child.content.trim()}\n\n`;
    } else {
      content += `(No content in template)\n\n`;
    }

    if (child.children.length > 0) {
      content += addChildrenSections(child.children, child.level + 1);
    }
  }

  return content;
}

/**
 * Read file content
 */
async function readFile(path: string): Promise<string> {
  try {
    const content = await Deno.readTextFile(path);
    return content;
  } catch (error) {
    throw new Error(
      `Failed to read file ${path}: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

/**
 * Get the template path automatically based on target directory structure
 */
async function getTemplatePath(targetPath: string): Promise<string> {
  // Extract directory from target path
  const targetDir = targetPath.substring(0, targetPath.lastIndexOf("/"));

  // Replace "database" with "database_template"
  const templateBaseDir = targetDir.replace("database", "database_template");

  // Look for _all_.tpl.md in the template directory structure
  const templatePath = `${templateBaseDir}/_all_.tpl.md`;

  try {
    await Deno.stat(templatePath);
    return templatePath;
  } catch (error) {
    throw new Error(`Template file not found at: ${templatePath}`);
  }
}

/**
 * Main validation function
 */
async function validateMarkdownTemplate(
  options: ValidationOptions
): Promise<string> {
  try {
    // If no template path is provided, auto-discover it
    const templatePath =
      options.templatePath || (await getTemplatePath(options.targetPath));

    const templateContent = await readFile(templatePath);
    const targetContent = await readFile(options.targetPath);

    const templateTree = parseMarkdownToTree(templateContent);
    const targetTree = parseMarkdownToTree(targetContent);

    const result = compareTrees(templateTree, targetTree);
    return generateReport(result, options);
  } catch (error) {
    return `Error: ${error instanceof Error ? error.message : String(error)}`;
  }
}

/**
 * Parse command line arguments
 */
function parseArguments(): ValidationOptions {
  const args = Deno.args;

  if (args.length < 2) {
    console.log(
      "Usage: validate_markdown_template.ts <mode> [template_path] <target_path>"
    );
    console.log("Modes: check, short, detailed");
    console.log("If template_path is not provided, it will be auto-discovered");
    Deno.exit(1);
  }

  const mode = args[0] as "check" | "short" | "detailed";

  // If there are only two arguments (mode + target), then we don't have a template path
  if (args.length === 2) {
    const targetPath = args[1];

    if (!["check", "short", "detailed"].includes(mode)) {
      console.log("Invalid mode. Use: check, short, or detailed");
      Deno.exit(1);
    }

    return { mode, targetPath };
  }
  // If there are three arguments (mode + template + target), use the provided template path
  else if (args.length === 3) {
    const mode = args[0] as "check" | "short" | "detailed";
    const templatePath = args[1];
    const targetPath = args[2];

    if (!["check", "short", "detailed"].includes(mode)) {
      console.log("Invalid mode. Use: check, short, or detailed");
      Deno.exit(1);
    }

    return { mode, templatePath, targetPath };
  }

  // If there are more than three arguments, show error
  console.log(
    "Usage: validate_markdown_template.ts <mode> [template_path] <target_path>"
  );
  console.log("Modes: check, short, detailed");
  Deno.exit(1);
}

/**
 * Main execution
 */
async function main() {
  try {
    const options = parseArguments();
    const result = await validateMarkdownTemplate(options);
    console.log(result);
  } catch (error) {
    console.error(
      `Error in main: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

if (import.meta.main) {
  main();
}

export { validateMarkdownTemplate };
export type { ValidationOptions, ValidationResult };
