#!/bin/bash
set -e

# CCG Skills Installer
# Multi-model development workflow for Claude Code

REPO_URL="https://raw.githubusercontent.com/masaakikubota/ccg-skills/main"
CLAUDE_DIR="$HOME/.claude"
SKILLS_DIR="$CLAUDE_DIR/skills"
MCP_DIR="$CLAUDE_DIR/mcp-servers/ccg-mcp-server"
PROMPTS_DIR="$CLAUDE_DIR/prompts"
BIN_DIR="$CLAUDE_DIR/bin"
SETTINGS_FILE="$CLAUDE_DIR/settings.json"

echo "=========================================="
echo "  CCG Skills Installer"
echo "  Multi-model development for Claude Code"
echo "=========================================="
echo ""

# Check if running from local directory or remote
if [ -d "./skills" ] && [ -d "./mcp-server" ]; then
    echo "[*] Installing from local directory..."
    LOCAL_INSTALL=true
else
    echo "[*] Installing from remote repository..."
    LOCAL_INSTALL=false
fi

# Create directories
echo "[1/6] Creating directories..."
mkdir -p "$SKILLS_DIR"
mkdir -p "$MCP_DIR"
mkdir -p "$PROMPTS_DIR"
mkdir -p "$BIN_DIR"

# Install Skills
echo "[2/6] Installing skills..."
SKILLS=(
    "ccg-routing"
    "ccg-workflow"
    "ccg-analyze"
    "ccg-review"
    "ccg-debug"
    "ccg-test"
    "ccg-optimize"
    "ccg-commit"
    "ccg-feat"
    "ccg-frontend"
    "ccg-backend"
    "ccg-image"
)

if [ "$LOCAL_INSTALL" = true ]; then
    cp -r ./skills/* "$SKILLS_DIR/"
else
    for skill in "${SKILLS[@]}"; do
        mkdir -p "$SKILLS_DIR/$skill"
        curl -fsSL "$REPO_URL/skills/$skill/SKILL.md" -o "$SKILLS_DIR/$skill/SKILL.md"
    done
fi
echo "    Installed ${#SKILLS[@]} skills"

# Install MCP Server
echo "[3/6] Installing MCP server..."
if [ "$LOCAL_INSTALL" = true ]; then
    cp -r ./mcp-server/* "$MCP_DIR/"
else
    curl -fsSL "$REPO_URL/mcp-server/index.js" -o "$MCP_DIR/index.js"
    curl -fsSL "$REPO_URL/mcp-server/package.json" -o "$MCP_DIR/package.json"
fi

# Install dependencies for MCP server
ORIG_DIR="$(pwd)"
cd "$MCP_DIR"
if [ -f "package.json" ]; then
    echo "    Installing npm dependencies..."
    npm install --silent 2>/dev/null || npm install 2>&1 | tail -3
fi
cd "$ORIG_DIR"

# Install binary wrappers
echo "[4/6] Installing binary wrappers..."
if [ "$LOCAL_INSTALL" = true ]; then
    cp ./bin/codeagent-wrapper "$BIN_DIR/"
    cp ./bin/nanobanana-wrapper "$BIN_DIR/"
else
    curl -fsSL "$REPO_URL/bin/codeagent-wrapper" -o "$BIN_DIR/codeagent-wrapper"
    curl -fsSL "$REPO_URL/bin/nanobanana-wrapper" -o "$BIN_DIR/nanobanana-wrapper"
fi
chmod +x "$BIN_DIR/codeagent-wrapper"
chmod +x "$BIN_DIR/nanobanana-wrapper"
echo "    Installed codeagent-wrapper"
echo "    Installed nanobanana-wrapper"

# Create nanobanana output directory
mkdir -p "$CLAUDE_DIR/nanobanana-output"
echo "    Created nanobanana-output directory"

# Install Prompts
echo "[5/6] Installing prompts..."
if [ "$LOCAL_INSTALL" = true ] && [ -d "./prompts" ]; then
    cp -r ./prompts/* "$PROMPTS_DIR/" 2>/dev/null || true
else
    for model in claude codex gemini; do
        mkdir -p "$PROMPTS_DIR/$model"
        for role in architect analyzer debugger optimizer reviewer tester frontend; do
            curl -fsSL "$REPO_URL/prompts/$model/$role.md" -o "$PROMPTS_DIR/$model/$role.md" 2>/dev/null || true
        done
    done
fi
echo "    Installed prompts"

# Update settings.json
echo "[6/6] Updating settings.json..."

# Create settings.json if not exists
if [ ! -f "$SETTINGS_FILE" ]; then
    echo '{}' > "$SETTINGS_FILE"
fi

# Check if jq is available
if command -v jq &> /dev/null; then
    # Use jq for JSON manipulation
    TMP_FILE=$(mktemp)

    # Ensure mcpServers and skills objects exist
    jq '. + {mcpServers: (.mcpServers // {}), skills: (.skills // {})}' "$SETTINGS_FILE" > "$TMP_FILE" && mv "$TMP_FILE" "$SETTINGS_FILE"

    # Add MCP server
    jq '.mcpServers.ccg = {
        "command": "node",
        "args": ["'"$MCP_DIR/index.js"'"]
    }' "$SETTINGS_FILE" > "$TMP_FILE" && mv "$TMP_FILE" "$SETTINGS_FILE"

    # Add skills
    jq '.skills["ccg-routing"] = {
        "path": "'"$SKILLS_DIR/ccg-routing/SKILL.md"'",
        "description": "CCG multi-model routing rules"
    } | .skills["ccg:workflow"] = {
        "path": "'"$SKILLS_DIR/ccg-workflow/SKILL.md"'",
        "description": "Multi-model collaborative development workflow"
    } | .skills["ccg:analyze"] = {
        "path": "'"$SKILLS_DIR/ccg-analyze/SKILL.md"'",
        "description": "Parallel technical analysis with Codex and Gemini"
    } | .skills["ccg:review"] = {
        "path": "'"$SKILLS_DIR/ccg-review/SKILL.md"'",
        "description": "Multi-model code review"
    } | .skills["ccg:debug"] = {
        "path": "'"$SKILLS_DIR/ccg-debug/SKILL.md"'",
        "description": "Multi-model debugging"
    } | .skills["ccg:test"] = {
        "path": "'"$SKILLS_DIR/ccg-test/SKILL.md"'",
        "description": "Test generation with model-specific expertise"
    } | .skills["ccg:optimize"] = {
        "path": "'"$SKILLS_DIR/ccg-optimize/SKILL.md"'",
        "description": "Performance optimization"
    } | .skills["ccg:commit"] = {
        "path": "'"$SKILLS_DIR/ccg-commit/SKILL.md"'",
        "description": "Conventional Commit message generation"
    } | .skills["ccg:feat"] = {
        "path": "'"$SKILLS_DIR/ccg-feat/SKILL.md"'",
        "description": "Feature development workflow"
    } | .skills["ccg:frontend"] = {
        "path": "'"$SKILLS_DIR/ccg-frontend/SKILL.md"'",
        "description": "Frontend development with Gemini"
    } | .skills["ccg:backend"] = {
        "path": "'"$SKILLS_DIR/ccg-backend/SKILL.md"'",
        "description": "Backend development with Codex"
    } | .skills["ccg:image"] = {
        "path": "'"$SKILLS_DIR/ccg-image/SKILL.md"'",
        "description": "AI image generation with Nano Banana Pro via Vertex AI"
    }' "$SETTINGS_FILE" > "$TMP_FILE" && mv "$TMP_FILE" "$SETTINGS_FILE"

    echo "    Settings updated successfully"
else
    echo "    Warning: jq not found. Please install jq or manually configure settings.json"
    echo ""
    echo "    To install jq:"
    echo "      macOS:  brew install jq"
    echo "      Ubuntu: sudo apt install jq"
    echo ""
    echo "    See README.md for manual configuration instructions."
fi

# Verify installation
echo ""
echo "Verifying installation..."
ERRORS=0

if [ ! -f "$BIN_DIR/codeagent-wrapper" ]; then
    echo "  [ERROR] codeagent-wrapper not found"
    ERRORS=$((ERRORS + 1))
else
    echo "  [OK] codeagent-wrapper"
fi

if [ ! -f "$BIN_DIR/nanobanana-wrapper" ]; then
    echo "  [ERROR] nanobanana-wrapper not found"
    ERRORS=$((ERRORS + 1))
else
    echo "  [OK] nanobanana-wrapper"
fi

if [ ! -f "$MCP_DIR/index.js" ]; then
    echo "  [ERROR] MCP server not found"
    ERRORS=$((ERRORS + 1))
else
    echo "  [OK] MCP server"
fi

if [ ! -d "$SKILLS_DIR/ccg-workflow" ]; then
    echo "  [ERROR] Skills not found"
    ERRORS=$((ERRORS + 1))
else
    echo "  [OK] Skills (${#SKILLS[@]} installed)"
fi

if [ $ERRORS -gt 0 ]; then
    echo ""
    echo "  Installation completed with $ERRORS error(s)"
    exit 1
fi

echo ""
echo "=========================================="
echo "  Installation Complete!"
echo "=========================================="
echo ""
echo "Available commands:"
echo "  /ccg:workflow  - Multi-model development workflow"
echo "  /ccg:analyze   - Parallel technical analysis"
echo "  /ccg:review    - Dual-model code review"
echo "  /ccg:debug     - Multi-model debugging"
echo "  /ccg:test      - Test generation"
echo "  /ccg:optimize  - Performance optimization"
echo "  /ccg:commit    - Commit message generation"
echo "  /ccg:feat      - Feature development"
echo "  /ccg:frontend  - Frontend development (Gemini)"
echo "  /ccg:backend   - Backend development (Codex)"
echo "  /ccg:image     - AI image generation (Nano Banana Pro)"
echo ""
echo "Image generation tools (MCP):"
echo "  generate_image     - General image generation"
echo "  edit_image         - Edit existing images"
echo "  generate_icon      - Create icons and UI elements"
echo "  generate_diagram   - Create technical diagrams"
echo "  generate_ui_mockup - Create UI/UX mockups"
echo ""
echo "NOTE: For image generation, set GCP_PROJECT_ID environment variable:"
echo "  export GCP_PROJECT_ID='your-project-id'"
echo ""
echo "IMPORTANT: Restart Claude Code to use the new skills!"
echo ""
