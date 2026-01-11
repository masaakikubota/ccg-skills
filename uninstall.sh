#!/bin/bash

# CCG Skills Uninstaller

CLAUDE_DIR="$HOME/.claude"
SKILLS_DIR="$CLAUDE_DIR/skills"
MCP_DIR="$CLAUDE_DIR/mcp-servers/ccg-mcp-server"
PROMPTS_DIR="$CLAUDE_DIR/prompts"

echo "=========================================="
echo "  CCG Skills Uninstaller"
echo "=========================================="
echo ""

read -p "Are you sure you want to uninstall CCG Skills? (y/N): " confirm
if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    echo "Cancelled."
    exit 0
fi

echo ""
echo "[1/5] Removing skills..."
rm -rf "$SKILLS_DIR/ccg-routing"
rm -rf "$SKILLS_DIR/ccg-workflow"
rm -rf "$SKILLS_DIR/ccg-analyze"
rm -rf "$SKILLS_DIR/ccg-review"
rm -rf "$SKILLS_DIR/ccg-debug"
rm -rf "$SKILLS_DIR/ccg-test"
rm -rf "$SKILLS_DIR/ccg-optimize"
rm -rf "$SKILLS_DIR/ccg-commit"
rm -rf "$SKILLS_DIR/ccg-feat"
rm -rf "$SKILLS_DIR/ccg-frontend"
rm -rf "$SKILLS_DIR/ccg-backend"
rm -rf "$SKILLS_DIR/ccg-image"

echo "[2/5] Removing MCP server..."
rm -rf "$MCP_DIR"

echo "[3/5] Removing prompts..."
rm -rf "$PROMPTS_DIR"

echo "[4/5] Removing binary wrappers..."
rm -f "$CLAUDE_DIR/bin/codeagent-wrapper"
rm -f "$CLAUDE_DIR/bin/nanobanana-wrapper"

echo "[5/5] Removing nanobanana output directory..."
rm -rf "$CLAUDE_DIR/nanobanana-output"

echo ""
echo "=========================================="
echo "  Uninstallation Complete!"
echo "=========================================="
echo ""
echo "Note: settings.json was not modified."
echo "Please manually remove ccg entries from:"
echo "  $CLAUDE_DIR/settings.json"
echo ""
echo "Restart Claude Code to apply changes."
echo ""
