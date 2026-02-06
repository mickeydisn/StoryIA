/**
 * Markdown utilities for generating tables, lists, and formatted content
 */

import { marked } from "npm:marked";

/**
 * Convert an array of objects to a markdown table
 * @param objects - Array of objects to convert
 * @param columns - Array of column definitions with key and header
 * @returns Markdown table string
 */
export function objectArrayToMdTable(
  objects: any[],
  columns: { key: string; header: string }[]
): string {
  if (objects.length === 0) return "";

  let table = "| " + columns.map((col) => col.header).join(" | ") + " |\n";
  table += "|" + columns.map(() => "---").join("|") + "|\n";

  for (const obj of objects) {
    const row = columns.map((col) => {
      const value = obj[col.key];
      return value !== undefined ? String(value) : "";
    });
    table += "| " + row.join(" | ") + " |\n";
  }

  return table;
}

/**
 * Convert markdown to HTML using marked
 * @param markdown - Markdown string to convert
 * @returns HTML string
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  return await marked.parse(markdown);
}
