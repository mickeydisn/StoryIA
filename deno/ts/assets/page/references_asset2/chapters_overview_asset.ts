import { SectionAsset } from "../../base/asset_base.ts";
import { listMarkdownFiles } from "./filesUtils.ts";
import { markdownToHtml, objectArrayToMdTable } from "./markdownUtils.ts";

interface ChapterInfo {
  filePath: string;
  chapterNumber: number;
  sceneNumber: number;
  title: string;
}

export class ChaptersOverviewAsset extends SectionAsset {
  override url = "/references/chapters-overview";
  title = "📚 Chapters Overview";

  override content = async (): Promise<string> => {
    try {
      // Get all chapter files
      const chapterFiles = await listMarkdownFiles(["^chapiter/.*/Chap.*\\.md"]);

      // Remove duplicates (in case listMarkdownFiles returns duplicates)
      const uniqueChapterFiles = [...new Set(chapterFiles)];

      // Extract chapter information from each file
      const chapters: ChapterInfo[] = [];
      for (const filePath of uniqueChapterFiles) {
        try {
          const chapterInfo = await extractChapterInfo(filePath);
          if (chapterInfo) {
            chapters.push(chapterInfo);
          }
        } catch (error) {
          console.error(`Error processing chapter file ${filePath}:`, error);
        }
      }

      // Sort chapters by chapter number and scene number
      chapters.sort((a, b) => {
        if (a.chapterNumber !== b.chapterNumber) {
          return a.chapterNumber - b.chapterNumber;
        }
        return a.sceneNumber - b.sceneNumber;
      });

      // Generate markdown content
      let content = `# Chapters Overview\n\n`;
      content += `Found ${chapters.length} chapter sections in the project.\n\n`;

      // Prepare table data for all chapters and scenes
      const tableData = chapters.map(chapter => ({
        chapter: chapter.chapterNumber,
        scene: chapter.sceneNumber,
        title: chapter.title
      }));

      // Define table columns
      const columns = [
        { key: 'chapter', header: 'Chapter' },
        { key: 'scene', header: 'Scene' },
        { key: 'title', header: 'Title' }
      ];

      // Create the table
      const tableMarkdown = objectArrayToMdTable(tableData, columns);
      content += tableMarkdown;

      return `<div class="chapters-overview-content markdown-content">${await markdownToHtml(content)}</div>`;
    } catch (error) {
      return `<div class="error-content"><p>Error: ${error instanceof Error ? error.message : String(error)}</p></div>`;
    }
  };
}

export const chaptersOverviewAsset = new ChaptersOverviewAsset();

/**
 * Extract chapter information from a chapter file
 */
async function extractChapterInfo(filePath: string): Promise<ChapterInfo | null> {
  try {
    const content = await Deno.readTextFile(filePath);
    const lines = content.split('\n');

    // Find the chapter title line (starts with ## [Chapitre)
    for (const line of lines) {
      // Match both quoted and unquoted title formats
      const chapterMatch = line.match(/^## \[Chapitre (\d+), (?:Sc[eè]ne|Section) (\d+)\]:\s*"?(.*?)"?$/);
      if (chapterMatch) {
        const [, chapterNum, sceneNum, title] = chapterMatch;
        return {
          filePath,
          chapterNumber: parseInt(chapterNum),
          sceneNumber: parseInt(sceneNum),
          title: title.trim()
        };
      }
    }

    console.warn(`Could not extract chapter info from ${filePath}`);
    return null;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return null;
  }
}
