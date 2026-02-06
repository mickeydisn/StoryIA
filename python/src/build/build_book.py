import os
from pathlib import Path
import re

def natural_sort_key(s):
    """Sort strings with numbers naturally (1, 2, 10 instead of 1, 10, 2)"""
    return [int(text) if text.isdigit() else text.lower()
            for text in re.split('([0-9]+)', str(s))]

def normalize_heading_level(content, level_offset=0):
    """
    Adjust markdown heading levels and extract/normalize titles.
    Handles formats like:
    - "# Section 3 : La Traversée des Spectres"
    - "# Résumé Narratif - Section 2" followed by "## La Nurserie des Chimères"
    """
    lines = content.split('\n')
    normalized_lines = []
    section_title = None
    skip_next_heading = False
    
    for i, line in enumerate(lines):
        # Check for "# Résumé Narratif" or similar pattern
        if re.match(r'^#\s+Résumé\s+Narratif', line, re.IGNORECASE):
            # Try to extract section number from this line
            section_match = re.search(r'Section\s+(\d+)', line, re.IGNORECASE)
            if section_match:
                section_num = section_match.group(1)
                # Look ahead for the next heading (##) which contains the actual title
                for j in range(i+1, min(i+5, len(lines))):
                    if lines[j].startswith('##'):
                        title = lines[j].lstrip('#').strip()
                        section_title = f"Section {section_num} : {title}"
                        skip_next_heading = True
                        break
            continue  # Skip the "Résumé Narratif" line
        
        # Skip the heading we already processed
        if skip_next_heading and line.startswith('##'):
            skip_next_heading = False
            continue
        
        # Adjust heading levels for remaining content
        if line.startswith('#'):
            # Count current level
            current_level = len(re.match(r'^#+', line).group())
            # Add offset (to make them subheadings)
            new_level = current_level + level_offset
            new_heading = '#' * new_level + line[current_level:]
            normalized_lines.append(new_heading)
        else:
            normalized_lines.append(line)
    
    return section_title, '\n'.join(normalized_lines)

def build_book():
    world_dir = Path("./scifi-book-project/world")
    chapters_dir = world_dir / "chapiter"  # Note: keeping your spelling "chapiter"
    output_md = Path("compiled_book.md")
    
    full_text = []
    
    # Add title page
    full_text.append("# My Book\n\n")
    full_text.append("---\n\n")
    
    # Find all chapter directories (chapX)
    if not chapters_dir.exists():
        print(f"Error: Directory {chapters_dir} not found!")
        return
    
    chapters = sorted(
        [d for d in chapters_dir.iterdir() if d.is_dir() and d.name.startswith("chap")],
        key=natural_sort_key
    )
    
    print(f"\n{'='*60}")
    print(f"Found {len(chapters)} chapters to process")
    print(f"{'='*60}\n")
    
    for chapter_idx, chapter in enumerate(chapters, 1):
        chapter_name = chapter.name.replace("_", " ").title()
        print(f"📖 Processing Chapter {chapter_idx}: {chapter.name}")
        
        full_text.append(f"# {chapter_name}\n\n")
        
        # Find all Summary_Section files in this chapter
        summary_files = sorted(
            list(chapter.glob("Summary_Section_*.md")),
            key=natural_sort_key
        )
        
        if not summary_files:
            print(f"   ⚠ Warning: No summary files found in {chapter.name}")
            full_text.append("*No content available*\n\n")
            full_text.append("---\n\n")
            continue
        
        print(f"   Found {len(summary_files)} sections")
        
        for summary_file in summary_files:
            print(f"   └─ {summary_file.name}")
            
            # Read and process content
            try:
                with open(summary_file, 'r', encoding='utf-8') as f:
                    content = f.read().strip()
                
                # Normalize headings and extract title
                section_title, normalized_content = normalize_heading_level(content, level_offset=1)
                
                # If we extracted a title from the content, use it
                if section_title:
                    full_text.append(f"## {section_title}\n\n")
                else:
                    # Fallback: use filename
                    section_name = summary_file.stem.replace("Summary_Section_", "Section ")
                    full_text.append(f"## {section_name}\n\n")
                
                full_text.append(normalized_content)
                full_text.append("\n\n")
                
            except Exception as e:
                print(f"   ✗ Error reading {summary_file}: {e}")
                full_text.append("*Error reading content*\n\n")
        
        full_text.append("---\n\n")
        print()
    
    # Write markdown file
    with open(output_md, 'w', encoding='utf-8') as f:
        f.writelines(full_text)
    
    print(f"✓ Markdown compiled to {output_md.absolute()}")
    
    # Convert to PDF
    convert_to_pdf(output_md)

def convert_to_pdf(md_file):
    """Convert markdown to PDF using pandoc"""
    pdf_file = md_file.with_suffix('.pdf')
    
    # Try pandoc with different engines
    try:
        import subprocess
        
        # Check if pandoc is available
        result = subprocess.run(['pandoc', '--version'], 
                              capture_output=True, 
                              text=True,
                              timeout=5)
        
        if result.returncode != 0:
            raise FileNotFoundError("Pandoc not found")
        
        print(f"\n{'='*60}")
        print("Converting to PDF with Pandoc...")
        print(f"{'='*60}\n")
        
        # Try different PDF engines in order of preference
        engines = [
            ('pdflatex', 'pdflatex'),
            ('xelatex', 'xelatex'),
            ('lualatex', 'lualatex'),
            ('wkhtmltopdf', 'wkhtmltopdf'),
        ]
        
        for engine_name, engine_cmd in engines:
            print(f"Trying {engine_name}...")
            
            # Build pandoc command
            cmd = [
                'pandoc',
                str(md_file),
                '-o', str(pdf_file),
                f'--pdf-engine={engine_cmd}',
                '-V', 'geometry:paperwidth=4.25in',
                '-V', 'geometry:paperheight=6.875in',
                '-V', 'geometry:margin=0.5in',
                '-V', 'fontsize=10pt',
                '-V', 'linestretch=1.2',
                '--toc',
                '--toc-depth=2'
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
            
            if result.returncode == 0:
                print(f"✅ PDF created successfully with {engine_name}: {pdf_file.absolute()}")
                return
            else:
                print(f"   ⚠️  {engine_name} failed, trying next option...")
        
        # If all engines failed
        print("\n❌ All PDF engines failed.")
        print("\n📦 To install LaTeX on macOS:")
        print("   Option 1 (Recommended - smaller):")
        print("     brew install basictex")
        print("     eval \"$(/usr/libexec/path_helper)\"")
        print("     sudo tlmgr update --self")
        print("     sudo tlmgr install collection-fontsrecommended")
        print("\n   Option 2 (Full LaTeX):")
        print("     brew install mactex")
        print("\n   Option 3 (Alternative):")
        print("     brew install wkhtmltopdf")
        
    except FileNotFoundError:
        print("\n⚠️  Pandoc not found!")
        print("\n📦 Install Pandoc on macOS:")
        print("   brew install pandoc")
        print("\n   Or download from: https://pandoc.org/installing.html")
        
    except subprocess.TimeoutExpired:
        print("⚠️  Pandoc timed out (this can happen on first run with LaTeX)")
        
    except Exception as e:
        print(f"❌ Error during PDF conversion: {e}")
    
    print(f"\n📄 Markdown file is ready at: {md_file.absolute()}")
    print("\n💡 Alternative options:")
    print("   1. Use an online converter: https://www.markdowntopdf.com/")
    print("   2. Open the .md file in VS Code and use 'Markdown PDF' extension")
    print("   3. Use Marked 2 app (Mac): https://marked2app.com/")

if __name__ == "__main__":
    build_book()