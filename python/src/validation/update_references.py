#!/usr/bin/env python3
"""
Database References Generator

This script scans the database and creates a comprehensive reference table
showing all entries, their file status, and usage counts across the project.
"""

import glob
import os
import re


def extract_all_referenced_entries():
    """Extract all referenced entry IDs from all files."""
    entries = set()

    # Find all .md files in the project
    all_md_files = []
    for root in ['chap', 'chapiter', 'audit', 'referance']:
        if os.path.exists(root):
            all_md_files.extend(glob.glob(f'{root}/**/*.md', recursive=True))

    # For database, include both root and subdirs
    if os.path.exists('database'):
        all_md_files.extend(glob.glob('database/*.md'))
        all_md_files.extend(glob.glob('database/**/*.md', recursive=True))

    # Also include root level md files
    all_md_files.extend(glob.glob('*.md'))

    for file_path in all_md_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
        except:
            continue

        # Find all [[...]] and [...] patterns
        pattern_double = r'\[\[([^\]]+)\]\]'
        pattern_single = r'\[([^\]\|\s]+)\]'
        matches = re.findall(pattern_double, content) + re.findall(pattern_single, content)

        for match in matches:
            if match.startswith(('CHAR_', 'CONCEPT_', 'LOC_', 'SYSTEM_')):
                # Normalize - to _ for consistency
                normalized_match = match.replace('-', '_')
                entries.add(normalized_match)

    return sorted(entries)


def scan_references(entries):
    """Scan all project files for references and count occurrences."""
    entry_counts = {entry: {'total': 0, 'chapter': 0, 'Part': 0, 'Mind': 0, 'characters': 0, 'concepts': 0, 'locations': 0, 'systems': 0, 'other': 0} for entry in entries}

    # Find all .md files in the project
    all_md_files = []
    for root in ['chap', 'chapiter', 'audit', 'referance']:
        if os.path.exists(root):
            all_md_files.extend(glob.glob(f'{root}/**/*.md', recursive=True))

    # For database, include both root and subdirs
    if os.path.exists('database'):
        all_md_files.extend(glob.glob('database/*.md'))
        all_md_files.extend(glob.glob('database/**/*.md', recursive=True))

    # Also include root level md files
    all_md_files.extend(glob.glob('*.md'))

    for file_path in all_md_files:

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
        except:
            continue

        # Find all [[...]] and [...] patterns
        pattern_double = r'\[\[([^\]]+)\]\]'
        pattern_single = r'\[([^\]\|\s]+)\]'
        matches = re.findall(pattern_double, content) + re.findall(pattern_single, content)

        # Determine category
        if file_path.startswith('chapiter/'):
            if 'Section' in os.path.basename(file_path):
                category = 'chapter'  # chapier -> chapter
            elif 'Part' in os.path.basename(file_path):
                category = 'Part'
            elif 'Mind' in os.path.basename(file_path):
                category = 'Mind'
            else:
                category = 'chapiter'
        elif file_path.startswith('database/characters/'):
            category = 'characters'
        elif file_path.startswith('database/concepts/'):
            category = 'concepts'
        elif file_path.startswith('database/locations/'):
            category = 'locations'
        elif file_path.startswith('database/systems/'):
            category = 'systems'
        elif file_path.startswith('database/'):
            category = 'other'  # for cross_references, timeline, etc.
        else:
            category = 'other'

        # Count references
        for match in matches:
            # Clean the match (remove surrounding * for bold markdown, replace - with _)
            clean_match = match.strip('*').strip().replace('-', '_')
            # Debug: print found matches
            print(f"Found reference: {clean_match} in {file_path}")
            if clean_match in entry_counts:
                entry_counts[clean_match]['total'] += 1
                entry_counts[clean_match][category] += 1

    return entry_counts

def check_file_existence(entries):
    """Check which entries have corresponding files."""
    file_exists = {}
    for entry in entries:
        # Determine expected path
        if entry.startswith('CHAR_'):
            path = f'database/characters/{entry}.md'
        elif entry.startswith('CONCEPT_'):
            path = f'database/concepts/{entry}.md'
        elif entry.startswith('LOC_'):
            path = f'database/locations/{entry}.md'
        elif entry.startswith('SYSTEM_'):
            path = f'database/systems/{entry}.md'
        else:
            path = None

        file_exists[entry] = os.path.exists(path) if path else False

    return file_exists

def generate_reference_table():
    """Generate the reference table markdown."""
    entries = extract_all_referenced_entries()
    counts = scan_references(entries)
    file_exists = check_file_existence(entries)

    # Separate entries with and without files
    entries_with_files = [e for e in entries if file_exists.get(e, False)]
    entries_without_files = [e for e in entries if not file_exists.get(e, False)]

    # Create markdown table
    table = "# Database References Overview\n\n"

    # Table for entries with files
    table += "## Entries with Files\n\n"
    table += "| Entry_ID | Total References | Chapter References | Part References | Mind References | Characters DB | Concepts DB | Locations DB | Systems DB | Other DB |\n"
    table += "|----------|------------------|-------------------|----------------|----------------|--------------|-------------|--------------|------------|----------|\n"

    for entry in sorted(entries_with_files):
        total = counts[entry]['total']
        chapter = counts[entry]['chapter']
        part = counts[entry]['Part']
        mind = counts[entry]['Mind']
        characters = counts[entry]['characters']
        concepts = counts[entry]['concepts']
        locations = counts[entry]['locations']
        systems = counts[entry]['systems']
        other = counts[entry]['other']

        table += f"| {entry} | {total} | {chapter} | {part} | {mind} | {characters} | {concepts} | {locations} | {systems} | {other} |\n"

    # Table for entries without files
    table += "\n## Entries without Files (Orphaned References)\n\n"
    table += "| Entry_ID | Total References | Chapter References | Part References | Mind References | Characters DB | Concepts DB | Locations DB | Systems DB | Other DB |\n"
    table += "|----------|------------------|-------------------|----------------|----------------|--------------|-------------|--------------|------------|----------|\n"

    # Sort by total references descending
    for entry in sorted(entries_without_files, key=lambda x: counts[x]['total'], reverse=True):
        total = counts[entry]['total']
        chapter = counts[entry]['chapter']
        part = counts[entry]['Part']
        mind = counts[entry]['Mind']
        characters = counts[entry]['characters']
        concepts = counts[entry]['concepts']
        locations = counts[entry]['locations']
        systems = counts[entry]['systems']
        other = counts[entry]['other']

        table += f"| {entry} | {total} | {chapter} | {part} | {mind} | {characters} | {concepts} | {locations} | {systems} | {other} |\n"

    table += "\n## Summary\n\n"
    table += f"- Total unique entries: {len(entries)}\n"
    table += f"- Entries with files: {len(entries_with_files)}\n"
    table += f"- Entries without files: {len(entries_without_files)}\n"
    table += f"- Total references found: {sum(counts[e]['total'] for e in entries)}\n"

    return table

def main():
    """Main function to generate references file."""
    print("Generating database references...")

    content = generate_reference_table()

    with open('database_build/_references.md', 'w', encoding='utf-8') as f:
        f.write(content)

    print("References file created: database_build/_references.md")

if __name__ == "__main__":
    main()
