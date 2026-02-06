import os
import re
from pathlib import Path
import shutil

# The full story text provided by the user
STORY_TEXT = r"""
# 2030 – Le Nouveau Vatican
## I. L’année du basculement
Lorsque la nouvelle fut rendue publique...
[TEXT TRUNCATED HERE FOR BREVITY IN TOOL CALL, WILL PASTE FULL TEXT IN REAL FILE]
"""
# Note: I will need to construct the full string in the file content. 
# Since I cannot put the huge string in this single tool call effectively if I want to be safe with limits,
# I will break this into a creation of the script that reads from a text file, 
# and I'll dump the story into a text file.

def parse_and_create():
    base_path = Path("../src")
    if base_path.exists():
        # Move existing example to a backup or just ignore. 
        # Let's clean up the template "Act_1" if it's just the default one.
        pass

    with open("story_source.txt", "r") as f:
        content = f.read()

    # Split by Major Parts (# Header)
    parts = re.split(r'^#\s+(.+)$', content, flags=re.MULTILINE)
    
    # parts[0] is typically empty or pre-amble.
    # parts[1] is Title 1, parts[2] is Content 1, parts[3] is Title 2, etc.
    
    current_act_idx = 1
    
    for i in range(1, len(parts), 2):
        title = parts[i].strip()
        body = parts[i+1].strip()
        
        # Clean title for folder name
        safe_title = re.sub(r'[^\w\s-]', '', title).strip().replace(' ', '_')
        act_dir = base_path / f"Part_{current_act_idx}_{safe_title}"
        act_dir.mkdir(parents=True, exist_ok=True)
        current_act_idx += 1
        
        # Now parse chapters/scenes within the body
        # Match "## Title" OR "Roman_Numeral. Title" 
        # We look for lines starting with '## ' OR starting with a Roman numeral followed by a dot.
        # The capturing group (group 1) will be the Title.
        
        # Regex explanation:
        # ^(?:##\s*)?       -> Optional "## " at start of line
        # (                 -> Start Group 1 (The Title)
        #   [IVX]+\.\s+.*   -> Roman numeral, dot, space, rest of line
        #   |               -> OR
        #   .*              -> Anything (if preceded by ##, handled by structure of split?) - wait, logic below needs care.
        # )
        
        # Actually easier: simpler regex that captures the whole title line irrespective of prefix, 
        # but we need to identify WHAT separates a scene.
        # We assume a scene starts with "## Title" OR "I. Title"
        
        pattern = r'(?m)^(?:##\s+)?([IVX]+\.\s+.*)$|(?m)^##\s+(.*)$'
        # re.split with multiple groups returns all of them. This gets messy.
        
        # Alternative: standardize the body text first.
        # Add "## " to lines starting with Roman Numerals if they don't have it.
        body = re.sub(r'(?m)^([IVX]+\.\s+)', r'## \1', body)
        
        scenes = re.split(r'(?m)^##\s+(.+)$', body)
        
        # scenes[0] is the intro text of the Act
        if scenes[0].strip():
            intro_dir = act_dir / "Scene_00_Intro"
            intro_dir.mkdir(exist_ok=True)
            with open(intro_dir / "content.md", "w") as f:
                f.write(scenes[0].strip())
            with open(intro_dir / "meta.yaml", "w") as f:
                f.write(f"id: {act_dir.name}.intro\ntitle: Introduction\nstatus: draft\n")

        current_scene_idx = 1
        for j in range(1, len(scenes), 2):
            scene_title = scenes[j].strip()
            scene_body = scenes[j+1].strip()
            
            safe_scene_title = re.sub(r'[^\w\s-]', '', scene_title).strip().replace(' ', '_')
            scene_dir = act_dir / f"Scene_{current_scene_idx:02d}_{safe_scene_title}"
            scene_dir.mkdir(exist_ok=True)
            
            with open(scene_dir / "content.md", "w") as f:
                f.write(scene_body)
            
            # Simple meta generation
            meta_content = f"id: {safe_title}.{safe_scene_title}\n"
            meta_content += f"title: \"{scene_title}\"\n"
            meta_content += "status: draft\n"
            # Try to guess characters included (very basic)
            found_chars = []
            if "Mersault" in scene_body: found_chars.append("../../world/characters/antoine_mersault.yaml")
            if "Memoria" in scene_body: found_chars.append("../../world/characters/memoria_dei.yaml")
            if "Elara" in scene_body: found_chars.append("../../world/characters/elara.yaml")
            
            if found_chars:
                meta_content += "characters:\n"
                for c in found_chars:
                    meta_content += f"  - {c}\n"

            with open(scene_dir / "meta.yaml", "w") as f:
                f.write(meta_content)
                
            current_scene_idx += 1

if __name__ == "__main__":
    parse_and_create()
