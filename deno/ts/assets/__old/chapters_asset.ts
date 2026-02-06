import { PageAsset } from "../base/asset_base.ts";

export class ChaptersAsset extends PageAsset {
  url = "/page/chapters";
  title = "📖 Project Chapters";
  content = `
<div class="chapters-overview">
    <h2>Chapter Structure</h2>
    <div class="chapters-grid">
        <div class="chapter-item">
            <h3>Chapter 1</h3>
            <p>8 sections - Foundation and setup</p>
        </div>
        <div class="chapter-item">
            <h3>Chapter 2</h3>
            <p>7 sections - Development and progression</p>
        </div>
        <div class="chapter-item">
            <h3>Chapter 3</h3>
            <p>8 sections - Key events and revelations</p>
        </div>
        <div class="chapter-item">
            <h3>Chapter 4</h3>
            <p>6 sections - Challenges and conflicts</p>
        </div>
        <div class="chapter-item">
            <h3>Chapter 5</h3>
            <p>7 sections - Growth and transformation</p>
        </div>
        <div class="chapter-item">
            <h3>Chapter 6</h3>
            <p>8 sections - Climax and resolution</p>
        </div>
        <div class="chapter-item">
            <h3>Chapter 7</h3>
            <p>8 sections - Conclusion and aftermath</p>
        </div>
    </div>
</div>
  `;
}

export const chaptersAsset = new ChaptersAsset();
