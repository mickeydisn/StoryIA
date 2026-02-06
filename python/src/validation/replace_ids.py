import os

# Dictionary of replacements: without ID -> with ID
replacements = {
    'SYSTEM_CODEC_PROUSTIEN_S2': 'SYSTEM_CODEC_PROUSTIEN_S2',
}

# Extensions to process (add more if needed)
extensions = ('.md', '.py', '.txt', '.json')

def replace_in_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content
        for old, new in replacements.items():
            content = content.replace(old, new)

        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated: {filepath}")
    except Exception as e:
        print(f"Error processing {filepath}: {e}")

# Walk through all files in the current directory and subdirectories
for root, dirs, files in os.walk('.'):
    for file in files:
        if file.endswith(extensions):
            filepath = os.path.join(root, file)
            replace_in_file(filepath)

print("Replacement complete.")
