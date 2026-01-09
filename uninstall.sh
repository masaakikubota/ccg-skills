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
echo "[1/3] Removing skills..."
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

echo "[2/3] Removing MCP server..."
rm -rf "$MCP_DIR"

echo "[3/3] Removing prompts..."
rm -rf "$PROMPTS_DIR"

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
