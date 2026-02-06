#!/usr/bin/env python3
"""
Database ID Validation Script

This script validates and corrects naming conventions in the database files:
- Renames .md files to use underscores (_) instead of hyphens (-) in filenames
- Replaces hyphens with underscores in [[...]] ID references within file content
"""

import glob
import os
import re


def validate_database_ids():
    """Validate and correct database file naming and ID references."""

    # Find all .md files in database subdirectories
    files = glob.glob('database/**/*.md', recursive=True)

    files_processed = 0
    files_renamed = 0
    files_content_updated = 0

    for file_path in files:
        # Skip files that are not actual database entries (like missing_references.md)
        filename = os.path.basename(file_path)
        if filename.startswith('missing_references'):
            continue

        original_path = file_path
        content_changed = False

        # Check and correct filename
        dir_path = os.path.dirname(file_path)
        name_part = filename[:-3]  # remove .md extension

        if '-' in name_part:
            new_name_part = name_part.replace('-', '_')
            new_filename = new_name_part + '.md'
            new_path = os.path.join(dir_path, new_filename)

            print(f"Renaming: {file_path} -> {new_path}")
            os.rename(file_path, new_path)
            file_path = new_path
            files_renamed += 1

        # Read and update content
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # Replace hyphens with underscores in [[...]] patterns
            pattern = r'\[\[([^\]]+)\]\]'
            def replace_func(match):
                inner = match.group(1)
                new_inner = inner.replace('-', '_')
                return '[[' + new_inner + ']]'

            new_content = re.sub(pattern, replace_func, content)

            # Also replace hyphens with underscores in single [ ] patterns and convert to [[ ]]
            pattern_single = r'\[([^\]]+-.*)\]'
            def replace_func_single(match):
                inner = match.group(1)
                new_inner = inner.replace('-', '_')
                return '[[' + new_inner + ']]'

            new_content = re.sub(pattern_single, replace_func_single, new_content)

            if new_content != content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                content_changed = True
                files_content_updated += 1
                print(f"Updated content in: {file_path}")

        except Exception as e:
            print(f"Error processing {file_path}: {e}")
            continue

        files_processed += 1

    print("\nProcessing complete:")
    print(f"Files processed: {files_processed}")
    print(f"Files renamed: {files_renamed}")
    print(f"Files with content updated: {files_content_updated}")

if __name__ == "__main__":
    validate_database_ids()
