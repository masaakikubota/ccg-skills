# CCG Skills

Multi-model development workflow for Claude Code using Codex and Gemini.

## Installation

### Quick Install

```bash
curl -fsSL https://raw.githubusercontent.com/YOUR_USERNAME/ccg-skills/main/install.sh | bash
```

### Manual Install

```bash
git clone https://github.com/YOUR_USERNAME/ccg-skills.git
cd ccg-skills
./install.sh
```

## Requirements

- [Claude Code](https://claude.ai/code) CLI
- Node.js 18+
- `jq` (optional, for automatic settings.json configuration)

### codeagent-wrapper

The MCP server requires `codeagent-wrapper` binary to communicate with Codex and Gemini.
Contact the repository maintainer for access or build from source.

## Available Commands

| Command | Description |
|---------|-------------|
| `/ccg:workflow` | Multi-model collaborative development workflow |
| `/ccg:analyze` | Parallel technical analysis with Codex and Gemini |
| `/ccg:review` | Dual-model code review |
| `/ccg:debug` | Multi-model debugging (backend/frontend) |
| `/ccg:test` | Test generation with model-specific expertise |
| `/ccg:optimize` | Performance optimization |
| `/ccg:commit` | Conventional Commit message generation |
| `/ccg:feat` | Feature development workflow |
| `/ccg:frontend` | Frontend development with Gemini |
| `/ccg:backend` | Backend development with Codex |

## Usage Examples

### Workflow - Full Development Cycle

```
/ccg:workflow Implement user authentication with JWT
```

Executes: Research → Planning → Implementation → Review

### Analyze - Multi-perspective Analysis

```
/ccg:analyze Why is the API response slow?
```

Gets analysis from both Codex (backend) and Gemini (frontend) perspectives.

### Review - Code Review

```
/ccg:review
```

Reviews current `git diff` with both models.

### Debug - Smart Debugging

```
/ccg:debug TypeError: Cannot read property 'map' of undefined
```

Auto-routes to appropriate model based on error type.

### Test - Generate Tests

```
/ccg:test src/services/auth.ts
```

Generates tests using the appropriate model (Codex for backend, Gemini for frontend).

### Commit - Generate Commit Message

```
/ccg:commit
```

Analyzes staged changes and generates Conventional Commit message.

### Frontend/Backend - Specialized Development

```
/ccg:frontend Create a responsive navigation component
/ccg:backend Create REST API for user management
```

## Model Routing

| Task Type | Model | Expertise |
|-----------|-------|-----------|
| API/Database | Codex | Backend logic, security, performance |
| UI/Components | Gemini | Frontend, styling, UX |
| Algorithm | Codex | Logic, optimization |
| Styling | Gemini | CSS, responsive design |
| Review | Both | Cross-validation |

## MCP Tools

The CCG MCP server provides these tools (used automatically by skills):

- `ask_codex` - Query Codex for backend tasks
- `ask_gemini` - Query Gemini for frontend tasks
- `ask_both` - Query both models in parallel
- `smart_route` - Auto-route based on task analysis

## Manual Configuration

If automatic configuration fails, add to `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "ccg": {
      "command": "node",
      "args": ["~/.claude/mcp-servers/ccg-mcp-server/index.js"]
    }
  },
  "skills": {
    "ccg:workflow": {
      "path": "~/.claude/skills/ccg-workflow/SKILL.md",
      "description": "Multi-model collaborative development workflow"
    },
    "ccg:analyze": {
      "path": "~/.claude/skills/ccg-analyze/SKILL.md",
      "description": "Parallel technical analysis"
    }
    // ... add other skills
  }
}
```

## Uninstall

```bash
curl -fsSL https://raw.githubusercontent.com/YOUR_USERNAME/ccg-skills/main/uninstall.sh | bash
```

Or manually:

```bash
rm -rf ~/.claude/skills/ccg-*
rm -rf ~/.claude/mcp-servers/ccg-mcp-server
rm -rf ~/.claude/prompts
```

## License

MIT
