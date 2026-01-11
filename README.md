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
- **For image generation (optional):**
  - GCP Project with Vertex AI API enabled
  - `gcloud` CLI with ADC configured
  - `export GCP_PROJECT_ID="your-project-id"`

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
| `/ccg:image` | AI image generation with Nano Banana Pro |

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

### Image - AI Image Generation

```
/ccg:image A modern app icon for a task management app
/ccg:image icon: Shopping cart icon --style=flat
/ccg:image diagram: OAuth 2.0 authentication flow --type=sequence
/ccg:image ui: Dashboard with analytics charts --platform=web
/ccg:image edit: ./logo.png Add gradient background
```

Requires `GCP_PROJECT_ID` environment variable and Vertex AI API access.

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

### Code Generation Tools
- `ask_codex` - Query Codex for backend tasks
- `ask_gemini` - Query Gemini for frontend tasks
- `ask_both` - Query both models in parallel
- `smart_route` - Auto-route based on task analysis

### Image Generation Tools (Nano Banana Pro)
- `generate_image` - General image generation with various styles
- `edit_image` - Edit existing images with text instructions
- `generate_icon` - Create app icons and UI elements
- `generate_diagram` - Create technical diagrams (flowchart, architecture, etc.)
- `generate_ui_mockup` - Create UI/UX mockups for web/mobile

## What Gets Installed

```
~/.claude/
├── bin/
│   ├── codeagent-wrapper      # Binary for Codex/Gemini communication
│   └── nanobanana-wrapper     # Shell script for image generation
├── mcp-servers/
│   └── ccg-mcp-server/        # MCP server (includes image generation tools)
│       ├── index.js
│       └── package.json
├── skills/
│   └── ccg-*/                 # 12 skill definitions (including ccg-image)
├── prompts/
│   ├── claude/                # Claude expert prompts
│   ├── codex/                 # Codex expert prompts
│   └── gemini/                # Gemini expert prompts
├── nanobanana-output/         # Generated images output directory
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
    },
    "ccg:image": {
      "path": "~/.claude/skills/ccg-image/SKILL.md",
      "description": "AI image generation with Nano Banana Pro"
    }
  }
}
```

## Image Generation Setup

To enable image generation features, configure GCP Vertex AI:

### 1. Set Environment Variables

```bash
# Add to ~/.zshrc or ~/.bashrc
export GCP_PROJECT_ID="your-gcp-project-id"
export GCP_REGION="us-central1"  # Optional, defaults to us-central1
```

### 2. Enable Vertex AI API

```bash
gcloud services enable aiplatform.googleapis.com
```

### 3. Configure ADC Authentication

```bash
gcloud auth application-default login
```

### 4. Grant IAM Role

Ensure your account has `roles/aiplatform.user` role.

### Alternative: External MCP Server (Method 1)

You can also use the standalone `nanobanana-mcp-server`:

```json
{
  "mcpServers": {
    "nanobanana": {
      "command": "uvx",
      "args": ["nanobanana-mcp-server@latest"],
      "env": {
        "NANOBANANA_AUTH_METHOD": "vertex_ai",
        "GCP_PROJECT_ID": "${GCP_PROJECT_ID}",
        "GCP_REGION": "us-central1"
      }
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
rm -rf ~/.claude/nanobanana-output
rm ~/.claude/bin/codeagent-wrapper
rm ~/.claude/bin/nanobanana-wrapper
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

### Image generation not working

1. Verify GCP Project ID is set: `echo $GCP_PROJECT_ID`
2. Check ADC authentication: `gcloud auth application-default print-access-token`
3. Verify Vertex AI API is enabled: `gcloud services list --enabled | grep aiplatform`
4. Check nanobanana-wrapper: `ls -la ~/.claude/bin/nanobanana-wrapper`
5. Test manually: `~/.claude/bin/nanobanana-wrapper generate "test image" modern`

### Image generation errors

- **"GCP_PROJECT_ID not set"**: Export the variable: `export GCP_PROJECT_ID="your-project-id"`
- **"Failed to get access token"**: Re-authenticate: `gcloud auth application-default login`
- **"API request failed with status 403"**: Check IAM permissions for `roles/aiplatform.user`
- **"No image in response"**: The model may have refused the prompt. Try a different description.

## License

MIT
