# CCG Skills

Multi-model development workflow for Claude Code using Codex (OpenAI) and Gemini (Google).

## Installation

### Quick Install (Recommended)

```bash
curl -fsSL https://raw.githubusercontent.com/masaakikubota/ccg-skills/main/install.sh | bash
```

### Manual Install

```bash
git clone https://github.com/masaakikubota/ccg-skills.git
cd ccg-skills
./install.sh
```

## Requirements

- [Claude Code](https://claude.ai/code) CLI
- Node.js 18+
- `jq` (for automatic settings.json configuration)

### Installing jq

```bash
# macOS
brew install jq

# Ubuntu/Debian
sudo apt install jq

# Windows (with chocolatey)
choco install jq
```

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

## What Gets Installed

```
~/.claude/
├── bin/
│   └── codeagent-wrapper      # Binary for Codex/Gemini communication
├── mcp-servers/
│   └── ccg-mcp-server/        # MCP server
│       ├── index.js
│       └── package.json
├── skills/
│   └── ccg-*/                 # 11 skill definitions
├── prompts/
│   ├── claude/                # Claude expert prompts
│   ├── codex/                 # Codex expert prompts
│   └── gemini/                # Gemini expert prompts
└── settings.json              # Updated with ccg config
```

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
    },
    "ccg:review": {
      "path": "~/.claude/skills/ccg-review/SKILL.md",
      "description": "Multi-model code review"
    },
    "ccg:debug": {
      "path": "~/.claude/skills/ccg-debug/SKILL.md",
      "description": "Multi-model debugging"
    },
    "ccg:test": {
      "path": "~/.claude/skills/ccg-test/SKILL.md",
      "description": "Test generation"
    },
    "ccg:optimize": {
      "path": "~/.claude/skills/ccg-optimize/SKILL.md",
      "description": "Performance optimization"
    },
    "ccg:commit": {
      "path": "~/.claude/skills/ccg-commit/SKILL.md",
      "description": "Commit message generation"
    },
    "ccg:feat": {
      "path": "~/.claude/skills/ccg-feat/SKILL.md",
      "description": "Feature development"
    },
    "ccg:frontend": {
      "path": "~/.claude/skills/ccg-frontend/SKILL.md",
      "description": "Frontend development"
    },
    "ccg:backend": {
      "path": "~/.claude/skills/ccg-backend/SKILL.md",
      "description": "Backend development"
    }
  }
}
```

## Uninstall

```bash
curl -fsSL https://raw.githubusercontent.com/masaakikubota/ccg-skills/main/uninstall.sh | bash
```

Or manually:

```bash
rm -rf ~/.claude/skills/ccg-*
rm -rf ~/.claude/mcp-servers/ccg-mcp-server
rm -rf ~/.claude/prompts
rm ~/.claude/bin/codeagent-wrapper
```

Then remove `ccg` entries from `~/.claude/settings.json`.

## Troubleshooting

### Skills not showing up

1. Restart Claude Code after installation
2. Check if skills are in `~/.claude/skills/`
3. Verify `settings.json` has the skill entries

### MCP server not working

1. Check if `node` is available: `which node`
2. Verify MCP server exists: `ls ~/.claude/mcp-servers/ccg-mcp-server/`
3. Check npm dependencies: `cd ~/.claude/mcp-servers/ccg-mcp-server && npm install`

### codeagent-wrapper errors

1. Verify binary exists: `ls -la ~/.claude/bin/codeagent-wrapper`
2. Check permissions: `chmod +x ~/.claude/bin/codeagent-wrapper`

## License

MIT
