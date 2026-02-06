# How to Manage Tools

## Overview

This guide explains how to add, configure, and manage tools for the FileSystem Agent. Tools are the core functionality that enables the agent to perform file system operations and content searches.

## Tool Architecture

### Tool Structure

Each tool follows a standardized structure:

```typescript
export function toolName() {
  return new DynamicTool({
    name: "tool_identifier",
    description: "Clear description of what this tool does",
    func: async (input: string) => {
      // Tool implementation
      return "Tool result";
    },
  });
}
```

### Tool Registration

Tools are registered in the agent configuration and can be enabled/disabled dynamically.

## Adding New Tools

### Step 1: Create the Tool

Create a new tool file in the `tools/` directory:

```typescript
// tools/my_new_tool.ts
import { DynamicTool } from "npm:@langchain/core@0.2.13/tools";

export function myNewTool() {
  return new DynamicTool({
    name: "my_new_tool",
    description: "Description of what this tool does",
    func: async (input: string) => {
      try {
        // Parse input parameters
        const params = JSON.parse(input);

        // Validate required parameters
        if (!params.requiredParam) {
          return "Error: Missing required parameter 'requiredParam'";
        }

        // Tool implementation
        const result = await performOperation(params);

        return `Success: ${result}`;
      } catch (error) {
        if (error instanceof Error) {
          return `Error: ${error.message}`;
        }
        return "Error: Unknown error occurred";
      }
    },
  });
}
```

### Step 2: Register the Tool

1. **Import the tool** in `tools/index.ts` (create if it doesn't exist):

```typescript
// tools/index.ts
export { createFileTool } from "./file_tools.ts";
export { searchFilesTool } from "./file_tools.ts";
export { searchInFilesTool } from "./file_tools.ts";
export { myNewTool } from "./my_new_tool.ts";
```

2. **Add to configuration** in `config.json`:

```json
{
  "tools": {
    "create_file": { "enabled": true },
    "search_files": { "enabled": true },
    "search_in_files": { "enabled": true },
    "my_new_tool": {
      "enabled": true,
      "description": "Description of what this tool does",
      "parameters": {
        "requiredParam": "string - Required parameter description",
        "optionalParam": "string (optional) - Optional parameter description"
      }
    }
  }
}
```

### Step 3: Update System Prompt

Modify the system prompt to include the new tool:

```typescript
// prompts/system_prompt.ts
export const SYSTEM_PROMPT = ChatPromptTemplate.fromMessages([
  [
    "system",
    `
You are a powerful file system agent that can help users with file operations and content searches.

Your capabilities include:
1. Creating new files with specified content
2. Searching for files by name patterns
3. Searching for content within files using regex patterns
4. [NEW] Your new capability description

Available tools:
- create_file: Create a new file with content
- search_files: Search for files by name pattern
- search_in_files: Search for content within files
- [NEW] my_new_tool: Description of new tool

[Add examples of how to use the new tool]
`,
  ],
  ["placeholder", "{agent_scratchpad}"],
]);
```

## Tool Configuration

### Enabling/Disabling Tools

Tools can be enabled or disabled in the configuration:

```json
{
  "tools": {
    "create_file": { "enabled": true },
    "search_files": { "enabled": false },
    "search_in_files": { "enabled": true }
  }
}
```

### Tool Parameters

Define expected parameters for each tool:

```json
{
  "tools": {
    "my_tool": {
      "enabled": true,
      "description": "Tool description",
      "parameters": {
        "param1": "string - Description of parameter 1",
        "param2": "number (optional) - Description of parameter 2"
      }
    }
  }
}
```

## Tool Categories

### File Operations

- **create_file**: Create new files
- **update_file**: Modify existing files
- **delete_file**: Remove files
- **copy_file**: Copy files
- **move_file**: Move/rename files

### Search Operations

- **search_files**: Find files by name patterns
- **search_in_files**: Find content within files
- **list_directory**: List directory contents
- **find_files_by_size**: Find files by size criteria

### Content Operations

- **read_file**: Read file contents
- **extract_text**: Extract text from various formats
- **search_and_replace**: Replace text patterns
- **format_code**: Format code files

### System Operations

- **get_file_info**: Get file metadata
- **check_permissions**: Check file permissions
- **create_backup**: Create file backups
- **validate_files**: Validate file formats

## Tool Best Practices

### Input Validation

- Always validate required parameters
- Provide clear error messages
- Handle edge cases gracefully

### Error Handling

- Use try-catch blocks for async operations
- Return descriptive error messages
- Log errors for debugging

### Performance

- Use efficient algorithms for file operations
- Implement proper error handling for large files
- Consider memory usage for content operations

### Security

- Validate file paths to prevent directory traversal
- Check file permissions before operations
- Sanitize user inputs

## Tool Examples

### File Backup Tool

```typescript
// tools/backup_tool.ts
import { DynamicTool } from "npm:@langchain/core@0.2.13/tools";

export function backupFileTool() {
  return new DynamicTool({
    name: "backup_file",
    description: "Create a backup copy of a file",
    func: async (input: string) => {
      try {
        const params = JSON.parse(input);
        const { sourcePath, backupSuffix = "_backup" } = params;

        if (!sourcePath) {
          return "Error: Missing required parameter 'sourcePath'";
        }

        const backupPath = sourcePath.replace(/\.[^/.]+$/, `${backupSuffix}$&`);

        const content = await Deno.readTextFile(sourcePath);
        await Deno.writeTextFile(backupPath, content);

        return `Backup created: ${backupPath}`;
      } catch (error) {
        return `Error creating backup: ${
          error instanceof Error ? error.message : "Unknown error"
        }`;
      }
    },
  });
}
```

### File Validation Tool

```typescript
// tools/validation_tool.ts
import { DynamicTool } from "npm:@langchain/core@0.2.13/tools";

export function validateFileTool() {
  return new DynamicTool({
    name: "validate_file",
    description: "Validate file format and content",
    func: async (input: string) => {
      try {
        const params = JSON.parse(input);
        const { filePath, format } = params;

        if (!filePath || !format) {
          return "Error: Missing required parameters 'filePath' and 'format'";
        }

        const content = await Deno.readTextFile(filePath);

        let isValid = false;
        let validationMessage = "";

        switch (format.toLowerCase()) {
          case "json":
            try {
              JSON.parse(content);
              isValid = true;
              validationMessage = "JSON is valid";
            } catch (e) {
              validationMessage = `JSON validation failed: ${e.message}`;
            }
            break;
          case "markdown":
            isValid = content.includes("#") || content.includes("##");
            validationMessage = isValid
              ? "Markdown format detected"
              : "No markdown headers found";
            break;
          default:
            validationMessage = `Unknown format: ${format}`;
        }

        return `Validation result: ${validationMessage} (Valid: ${isValid})`;
      } catch (error) {
        return `Error validating file: ${
          error instanceof Error ? error.message : "Unknown error"
        }`;
      }
    },
  });
}
```

## Tool Management Commands

### List Available Tools

```bash
deno run --allow-net --allow-read --allow-write --allow-env main.ts --prompt "List all available tools and their descriptions"
```

### Test Tool Functionality

```bash
deno run --allow-net --allow-read --allow-write --allow-env main.ts --prompt "Test the backup_file tool with ./test.txt"
```

### Enable/Disable Tools

Modify the `config.json` file to enable or disable specific tools, then restart the agent.

## Debugging Tools

### Enable Debug Mode

Set verbose logging in the configuration:

```json
{
  "execution": {
    "verbose": true,
    "maxRetries": 3,
    "retryDelay": 1000
  }
}
```

### Tool Testing

Create test scripts for individual tools:

```typescript
// test-tools.ts
import { createFileTool } from "./tools/file_tools.ts";

async function testTool() {
  const tool = createFileTool();
  const result = await tool.invoke('{"path": "test.txt", "content": "test"}');
  console.log("Tool result:", result);
}

testTool();
```

## Tool Integration

### Multi-Tool Workflows

Combine multiple tools for complex operations:

```bash
--prompt "Create a file called ./config.json with content '{\"app\": \"test\"}', then validate it as JSON"
```

### Tool Dependencies

Some tools may depend on others:

```typescript
// tools/complex_tool.ts
import { createFileTool } from "./file_tools.ts";

export function complexOperationTool() {
  return new DynamicTool({
    name: "complex_operation",
    description: "Perform multiple file operations",
    func: async (input: string) => {
      // This tool might call other tools internally
      // or coordinate multiple operations
    },
  });
}
```

## Future Tool Ideas

- **File compression/decompression**
- **Image processing and analysis**
- **Code analysis and metrics**
- **File synchronization**
- **Search engine integration**
- **Version control operations**
- **Cloud storage integration**
- **Email/file sharing**
- **Document conversion**
- **Batch file operations**

## Conclusion

The tool management system provides a flexible and extensible way to enhance the FileSystem Agent's capabilities. By following the established patterns and best practices, you can easily add new functionality to meet specific requirements.
