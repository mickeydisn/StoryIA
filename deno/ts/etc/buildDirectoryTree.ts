// Utility function to build directory tree structure
export async function buildDirectoryTree(basePath: string): Promise<any> {
  const tree: any = {};

  try {
    for await (const entry of Deno.readDir(basePath)) {
      if (entry.isFile && entry.name.endsWith('.md')) {
        tree[entry.name] = { type: 'file', path: `${basePath}/${entry.name}`.replace('../', '') };
      } else if (entry.isDirectory) {
        const subTree = await buildDirectoryTree(`${basePath}/${entry.name}`);
        if (Object.keys(subTree).length > 0) {
          tree[entry.name] = { type: 'directory', children: subTree, path: `${basePath}/${entry.name}`.replace('../', '') };
        }
      }
    }
  } catch (error) {
    // Skip directories we can't read
    console.warn(`Could not build tree for ${basePath}: ${error instanceof Error ? error.message : String(error)}`);
  }

  return tree;
}
