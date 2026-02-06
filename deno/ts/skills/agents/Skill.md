# FileSystem Agent Skill

## Overview

The FileSystem Agent is an AI skill that provides intelligent file system operations and content search capabilities. This agent connects to local LM Studio models to perform file creation, pattern-based file searches, and content analysis using regex patterns.

## Capabilities

### 📝 File Creation

- Create new files with specified content
- Automatic directory creation for nested paths
- Content validation and preview

### 🔍 File Pattern Search

- Glob pattern matching for file names
- Recursive directory traversal
- Filter files by name patterns (e.g., `*.txt`, `*hello*`)

### 🔎 Content Analysis

- Regex-based content search within files
- Filter searches by file type patterns
- Multi-file content analysis

## Configuration

The agent is configured via `config.json` with the following key settings:

```json
{
  "model": {
    "provider": "lm-studio",
    "baseURL": "http://localhost:1234/v1",
    "temperature": 0.7,
    "maxTokens": 2000
  },
  "tools": {
    "create_file": { "enabled": true },
    "search_files": { "enabled": true },
    "search_in_files": { "enabled": true }
  }
}
```

## Usage

### Basic Invocation

```bash
cd deno/ts/skills/agents
deno run --allow-net --allow-read --allow-write --allow-env main.ts --prompt "Your command here"
```

### Example Commands

#### Create Files

```bash
# Create a simple text file
--prompt "Create a file called ./hello_world.txt and write 'Hello Mickey In the File'"

# Create a markdown file
--prompt "Create a file called ./README.md with content '# Project\nThis is a test project.'"

# Create file in subdirectory
--prompt "Create a file called ./docs/guide.txt with content 'Documentation file.'"
```

#### Search Files

```bash
# Find all text files
--prompt "Find all files matching pattern '*.txt'"

# Find files with specific names
--prompt "Find all files matching pattern '*hello*'"

# Search in specific directory
--prompt "Find all files matching pattern '*.js' in directory './src'"
```

#### Content Search

```bash
# Search for specific text
--prompt "Search for files containing 'mickey'"

# Search with regex patterns
--prompt "Search for files containing pattern 'Hello.*World'"

# Search in specific file types
--prompt "Search for files containing 'function' in all JavaScript files"
```

## Agent Behavior

The agent follows these principles:

1. **Tool Selection**: Automatically chooses the appropriate tool based on the user's request
2. **Error Handling**: Provides clear error messages and suggestions for resolution
3. **Context Awareness**: Maintains context throughout the conversation
4. **Safety**: Validates inputs and provides warnings for potentially destructive operations

## Integration

This skill can be integrated into larger AI workflows by:

1. **Importing the Agent**: Use the agent as a module in other Deno applications
2. **API Integration**: Connect to the agent via HTTP endpoints
3. **Task Automation**: Use Deno tasks for automated workflows
4. **Multi-Agent Systems**: Combine with other specialized agents

## Performance Considerations

- **Model Selection**: Use smaller models for faster response times
- **Temperature Settings**: Lower values (0.3-0.7) for more consistent results
- **File System Access**: Ensure proper permissions for target directories
- **Memory Usage**: Monitor system resources during large file operations

## Error Recovery

The agent includes built-in error recovery mechanisms:

- **Connection Failures**: Automatic retry with exponential backoff
- **Permission Errors**: Clear guidance on required permissions
- **Invalid Inputs**: Input validation and helpful error messages
- **Model Unavailability**: Graceful degradation with helpful suggestions

## Security

- **File System Access**: Limited to explicitly granted permissions
- **Input Validation**: All inputs are validated before processing
- **Content Filtering**: Sensitive operations require explicit confirmation
- **Audit Trail**: All operations are logged for review

## Extensibility

The agent architecture supports easy extension:

- **New Tools**: Add tools to the `tools/` directory
- **Custom Prompts**: Modify system prompts for specialized behavior
- **Configuration**: Update `config.json` for different use cases
- **Integration**: Connect to external APIs and services

## Dependencies

- **LangChain Core**: Agent framework and tool management
- **LangChain OpenAI**: LM Studio integration
- **Deno**: Runtime environment with security features
- **LM Studio**: Local model hosting and inference

## Troubleshooting

### Common Issues

1. **Connection Refused**: Ensure LM Studio is running and server is enabled
2. **Permission Denied**: Run with proper Deno permissions
3. **Model Not Loaded**: Load a model in LM Studio first
4. **Slow Responses**: Check system resources and model size

### Debug Mode

Enable verbose logging for troubleshooting:

```bash
deno run --allow-net --allow-read --allow-write --allow-env main.ts --prompt "Your prompt" 2>&1 | head -100
```

## Version History

- **1.0.0**: Initial release with core file system operations
- **Future**: Planned support for additional file operations and integrations

## Support

For issues and questions:

1. Check the troubleshooting section
2. Review configuration settings
3. Verify LM Studio connectivity
4. Consult the tool management documentation
