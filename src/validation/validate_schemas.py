#!/usr/bin/env python3
"""
Database Schema Validation Script

This script validates database entries against their respective
schemas and generates a validation report.
"""

import os
import re
import glob


def load_schema(schema_file):
    """Load schema file and extract required sections and subsections."""
    sections = {}
    try:
        with open(schema_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Find all section headers and their subsections
        lines = content.split('\n')
        current_section = None

        for line in lines:
            # Check for section header (### Section Name)
            section_match = re.match(r'^### (.+)$', line.strip())
            if section_match:
                current_section = section_match.group(1).strip()
                sections[current_section] = []
            # Check for subsection (marked with **)
            elif current_section and line.strip().startswith('- **'):
                subsection_match = re.match(r'^- \*\*(.+?)\*\*$', line.strip())
                if subsection_match:
                    subsection = subsection_match.group(1).strip()
                    sections[current_section].append(subsection)

    except Exception as e:
        print(f"Error loading schema {schema_file}: {e}")

    return sections


def validate_entry_file(entry_file, required_sections):
    """Validate sections and subsections in an entry file."""
    try:
        with open(entry_file, 'r', encoding='utf-8') as f:
            content = f.read()

        section_results = {}
        subsection_results = {}
        missing_sections = []

        for section, subsections in required_sections.items():
            # Check for section header
            section_patterns = [
                rf'^### {re.escape(section)}$',
                rf'^## {re.escape(section)}$',
                rf'^\* \*\*{re.escape(section)}\*\*$',
            ]

            section_found = False
            for pattern in section_patterns:
                if re.search(pattern, content, re.MULTILINE):
                    section_found = True
                    break

            section_results[section] = section_found
            if not section_found:
                missing_sections.append(section)

            # Check subsections if section exists
            subsection_results[section] = {}
            if section_found and subsections:
                # Find the section content
                section_content = extract_section_content(content, section)
                if section_content:
                    for subsection in subsections:
                        # Check for subsection (look for bold text)
                        subsection_patterns = [
                            rf'\*\*{re.escape(subsection)}\*\*',
                            rf'^\* \*\*{re.escape(subsection)}\*\*$',
                            rf'- \*\*{re.escape(subsection)}\*\*',
                        ]

                        subsection_found = False
                        for pattern in subsection_patterns:
                            if re.search(pattern, section_content, re.MULTILINE):
                                subsection_found = True
                                break

                        subsection_results[section][subsection] = subsection_found

        overall_valid = len(missing_sections) == 0
        return overall_valid, missing_sections, section_results, subsection_results

    except Exception as e:
        print(f"Error validating {entry_file}: {e}")
        return False, [f"File read error: {e}"], {}, {}


def extract_section_content(content, section_name):
    """Extract content of a specific section from the file."""
    # Find section header
    section_patterns = [
        rf'^### {re.escape(section_name)}$',
        rf'^## {re.escape(section_name)}$',
        rf'^\* \*\*{re.escape(section_name)}\*\*$',
    ]

    lines = content.split('\n')
    section_start = -1

    for i, line in enumerate(lines):
        for pattern in section_patterns:
            if re.search(pattern, line.strip(), re.MULTILINE):
                section_start = i
                break
        if section_start != -1:
            break

    if section_start == -1:
        return ""

    # Find next section header or end of file
    section_end = len(lines)
    for i in range(section_start + 1, len(lines)):
        line = lines[i].strip()
        if re.match(r'^#{1,4} .+$', line) or re.match(r'^\* \*\*.+\*\*$', line):
            section_end = i
            break

    section_content = '\n'.join(lines[section_start:section_end])
    return section_content


def validate_database_section(db_path, schema_sections, section_name):
    """Validate all entries in a database section and return per-section statistics."""
    valid_count = 0
    total_count = 0
    invalid_files = []
    section_stats = {section: {'present': 0, 'missing': 0} for section in schema_sections}
    subsection_stats = {}

    # Initialize subsection stats
    for section, subsections in schema_sections.items():
        subsection_stats[section] = {}
        for subsection in subsections:
            subsection_stats[section][subsection] = {'present': 0, 'missing': 0}

    # Find all entry files in this database section
    entry_pattern = os.path.join(db_path, '*.md')
    entry_files = glob.glob(entry_pattern)

    for entry_file in entry_files:
        filename = os.path.basename(entry_file)

        # Skip special files like missing_references.md
        if filename.startswith('missing_references'):
            continue

        total_count += 1
        is_valid, missing_sections, section_results, subsection_results = validate_entry_file(
            entry_file, schema_sections
        )

        if is_valid:
            valid_count += 1
        else:
            invalid_files.append({
                'file': entry_file,
                'missing_sections': missing_sections
            })

        # Update section statistics
        for section, present in section_results.items():
            if present:
                section_stats[section]['present'] += 1
            else:
                section_stats[section]['missing'] += 1

        # Update subsection statistics
        for section, subsections in subsection_results.items():
            for subsection, present in subsections.items():
                if present:
                    subsection_stats[section][subsection]['present'] += 1
                else:
                    subsection_stats[section][subsection]['missing'] += 1

    return valid_count, total_count, invalid_files, section_stats, subsection_stats


def generate_report(results):
    """Generate markdown report with hierarchical validation results and checkboxes."""
    report = "# Database Schema Validation Report\n\n"
    report += "This report shows the validation status of database entries against their schemas.\n\n"

    # Summary table
    report += "## Summary Table\n\n"
    report += "| Database | Valid Files | Total Files | Validity Rate |\n"
    report += "|----------|-------------|-------------|---------------|\n"

    total_valid = 0
    total_files = 0

    for section, data in results.items():
        valid = data['valid_count']
        total = data['total_count']
        rate = f"{(valid/total*100):.1f}%" if total > 0 else "N/A"
        report += f"| {section} | {valid} | {total} | {rate} |\n"

        total_valid += valid
        total_files += total

    overall_rate = f"{(total_valid/total_files*100):.1f}%" if total_files > 0 else "N/A"
    report += f"| **Total** | **{total_valid}** | **{total_files}** | **{overall_rate}** |\n\n"

    # Hierarchical tree structure for each database
    for db_name, data in results.items():
        report += f"## {db_name} Database\n\n"
        report += f"**Files:** {data['total_count']} total, {data['valid_count']} valid\n\n"

        section_stats = data['section_stats']
        subsection_stats = data['subsection_stats']
        total_files_db = data['total_count']

        for section, stats in section_stats.items():
            present = stats['present']

            # Calculate valid sections (sections where all subsections are present in files that have the section)
            subsections = subsection_stats.get(section, {})
            if subsections:
                valid_sections = 0
                for sub_stats in subsections.values():
                    # A subsection is valid if it's present in all files that have the parent section
                    if sub_stats['present'] == present:
                        valid_sections += 1
            else:
                valid_sections = 1 if present == total_files_db else 0

            has_checkbox = "[x]" if present == total_files_db else "[ ]"

            report += f"- {has_checkbox} **{section}** (has: {present}/{total_files_db}, validSub: {valid_sections}/{len(subsections) if subsections else 1})\n"

            # Show subsections - count only among files that have the section
            if subsections:
                for subsection, sub_stats in subsections.items():
                    sub_present = sub_stats['present']
                    sub_checkbox = "[x]" if sub_present == present else "[ ]"
                    report += f"  - {sub_checkbox} {subsection} ({sub_present}/{present})\n"

        report += "\n"

    return report


def main():
    """Main validation function."""
    print("Starting database schema validation...")

    # Define database sections and their schemas
    sections = {
        'Characters': {
            'path': 'database/characters',
            'schema': 'src/schemat/char_schema.md'
        },
        'Concepts': {
            'path': 'database/concepts',
            'schema': 'src/schemat/concept_schema.md'
        },
        'Locations': {
            'path': 'database/locations',
            'schema': 'src/schemat/loc_schema.md'
        },
        'Systems': {
            'path': 'database/systems',
            'schema': 'src/schemat/system_schema.md'
        }
    }

    results = {}

    # Validate each section
    for section_name, config in sections.items():
        print(f"Validating {section_name}...")

        # Load schema
        schema_sections = load_schema(config['schema'])
        if not schema_sections:
            print(f"Warning: No sections found in schema {config['schema']}")
            continue

        # Validate entries
        valid_count, total_count, invalid_files, section_stats, subsection_stats = validate_database_section(
            config['path'], schema_sections, section_name
        )

        results[section_name] = {
            'valid_count': valid_count,
            'total_count': total_count,
            'invalid_files': invalid_files,
            'section_stats': section_stats,
            'subsection_stats': subsection_stats
        }

        print(f"  {section_name}: {valid_count}/{total_count} valid files")

    # Generate report
    report = generate_report(results)

    # Save report
    report_path = 'database_build/_schema_report.md'
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write(report)

    print(f"Report generated: {report_path}")
    print("Validation complete!")


if __name__ == "__main__":
    main()
