#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { spawn } from "child_process";
import { homedir } from "os";
import { join } from "path";
import { existsSync } from "fs";

// Paths configuration
const WRAPPER_PATH = join(homedir(), ".claude", "bin", "codeagent-wrapper");
const PROMPTS_DIR = join(homedir(), ".claude", "prompts");

// Timeout in milliseconds (5 minutes)
const TIMEOUT_MS = 300000;

// Routing keywords
const FRONTEND_KEYWORDS = [
  "react", "vue", "angular", "css", "scss", "sass", "tailwind", "html", "ui", "ux",
  "component", "frontend", "フロントエンド", "コンポーネント", "スタイル",
  "レイアウト", "responsive", "レスポンシブ", "animation", "アニメーション",
  "design", "デザイン", "button", "ボタン", "form", "フォーム", "modal", "モーダル",
  "navigation", "ナビ", "next.js", "nuxt", "svelte"
];

const BACKEND_KEYWORDS = [
  "api", "database", "db", "sql", "postgresql", "mysql", "mongodb", "server",
  "backend", "バックエンド", "node", "express", "fastapi", "django",
  "authentication", "認証", "authorization", "認可", "algorithm", "アルゴリズム",
  "logic", "ロジック", "debug", "デバッグ", "error", "エラー", "performance",
  "パフォーマンス", "cache", "キャッシュ", "queue", "キュー", "worker", "cron",
  "batch", "バッチ", "graphql", "rest", "microservice"
];

// Codex roles
const CODEX_ROLES = ["architect", "analyzer", "debugger", "optimizer", "reviewer", "tester"];
// Gemini roles
const GEMINI_ROLES = ["frontend", "analyzer", "debugger", "optimizer", "reviewer", "tester"];

/**
 * Execute codeagent-wrapper with the given parameters
 */
async function executeWrapper(backend, task, workdir, role) {
  return new Promise((resolve, reject) => {
    // Check if wrapper exists
    if (!existsSync(WRAPPER_PATH)) {
      reject(new Error(`codeagent-wrapper not found at ${WRAPPER_PATH}. Please install CCG first.`));
      return;
    }

    // Build command arguments
    const args = ["--backend", backend];

    // Add role file if specified
    if (role) {
      const roleFile = join(PROMPTS_DIR, backend, `${role}.md`);
      if (existsSync(roleFile)) {
        args.push("--role-file", roleFile);
      }
    }

    // Add stdin flag and workdir
    args.push("-", workdir || ".");

    // Spawn the process
    const proc = spawn(WRAPPER_PATH, args, {
      stdio: ["pipe", "pipe", "pipe"],
      timeout: TIMEOUT_MS,
    });

    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    proc.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    // Send task to stdin
    proc.stdin.write(task);
    proc.stdin.end();

    // Set timeout
    const timeout = setTimeout(() => {
      proc.kill("SIGTERM");
      reject(new Error(`Process timed out after ${TIMEOUT_MS / 1000} seconds`));
    }, TIMEOUT_MS);

    proc.on("close", (code) => {
      clearTimeout(timeout);
      if (code === 0) {
        resolve(stdout);
      } else {
        resolve(`Exit code: ${code}\n\nOutput:\n${stdout}\n\nErrors:\n${stderr}`);
      }
    });

    proc.on("error", (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });
}

/**
 * Calculate routing score for a task
 */
function calculateRouteScore(task) {
  const lowerTask = task.toLowerCase();

  let frontendScore = 0;
  let backendScore = 0;

  for (const keyword of FRONTEND_KEYWORDS) {
    if (lowerTask.includes(keyword.toLowerCase())) {
      frontendScore++;
    }
  }

  for (const keyword of BACKEND_KEYWORDS) {
    if (lowerTask.includes(keyword.toLowerCase())) {
      backendScore++;
    }
  }

  return { frontendScore, backendScore };
}

// Create server instance
const server = new Server(
  {
    name: "ccg-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "ask_codex",
        description: "Ask Codex (OpenAI) for backend, logic, algorithm, and debugging tasks. Best for server-side code, APIs, databases, and performance optimization.",
        inputSchema: {
          type: "object",
          properties: {
            task: {
              type: "string",
              description: "The task or question to send to Codex",
            },
            workdir: {
              type: "string",
              description: "Working directory (default: current directory)",
            },
            role: {
              type: "string",
              enum: CODEX_ROLES,
              description: "Expert role: architect, analyzer, debugger, optimizer, reviewer, tester",
            },
          },
          required: ["task"],
        },
      },
      {
        name: "ask_gemini",
        description: "Ask Gemini (Google) for frontend, UI, CSS, and component design tasks. Best for React, Vue, styling, responsive design, and user experience.",
        inputSchema: {
          type: "object",
          properties: {
            task: {
              type: "string",
              description: "The task or question to send to Gemini",
            },
            workdir: {
              type: "string",
              description: "Working directory (default: current directory)",
            },
            role: {
              type: "string",
              enum: GEMINI_ROLES,
              description: "Expert role: frontend, analyzer, debugger, optimizer, reviewer, tester",
            },
          },
          required: ["task"],
        },
      },
      {
        name: "ask_both",
        description: "Ask both Codex and Gemini the same question in parallel and compare their responses. Useful for getting diverse perspectives or cross-validating solutions.",
        inputSchema: {
          type: "object",
          properties: {
            task: {
              type: "string",
              description: "The task or question to send to both models",
            },
            workdir: {
              type: "string",
              description: "Working directory (default: current directory)",
            },
          },
          required: ["task"],
        },
      },
      {
        name: "smart_route",
        description: "Automatically analyze the task and route to the best model (Codex for backend, Gemini for frontend). Uses keyword analysis to determine the optimal choice.",
        inputSchema: {
          type: "object",
          properties: {
            task: {
              type: "string",
              description: "The task to analyze and route",
            },
            workdir: {
              type: "string",
              description: "Working directory (default: current directory)",
            },
          },
          required: ["task"],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "ask_codex": {
        const result = await executeWrapper("codex", args.task, args.workdir, args.role);
        return {
          content: [
            {
              type: "text",
              text: `## Codex Response\n\n${result}`,
            },
          ],
        };
      }

      case "ask_gemini": {
        const result = await executeWrapper("gemini", args.task, args.workdir, args.role);
        return {
          content: [
            {
              type: "text",
              text: `## Gemini Response\n\n${result}`,
            },
          ],
        };
      }

      case "ask_both": {
        // Execute both in parallel
        const [codexResult, geminiResult] = await Promise.allSettled([
          executeWrapper("codex", args.task, args.workdir),
          executeWrapper("gemini", args.task, args.workdir),
        ]);

        let response = "";

        response += "## Codex Response\n\n";
        if (codexResult.status === "fulfilled") {
          response += codexResult.value;
        } else {
          response += `Error: ${codexResult.reason.message}`;
        }

        response += "\n\n---\n\n## Gemini Response\n\n";
        if (geminiResult.status === "fulfilled") {
          response += geminiResult.value;
        } else {
          response += `Error: ${geminiResult.reason.message}`;
        }

        return {
          content: [
            {
              type: "text",
              text: response,
            },
          ],
        };
      }

      case "smart_route": {
        const { frontendScore, backendScore } = calculateRouteScore(args.task);

        // Default to Codex if scores are equal
        const selectedBackend = frontendScore > backendScore ? "gemini" : "codex";
        const selectedModel = selectedBackend === "gemini" ? "Gemini" : "Codex";

        const result = await executeWrapper(selectedBackend, args.task, args.workdir);

        return {
          content: [
            {
              type: "text",
              text: `## Smart Routing Result\n\n**Selected Model:** ${selectedModel}\n**Reason:** Frontend score: ${frontendScore}, Backend score: ${backendScore}\n\n---\n\n## ${selectedModel} Response\n\n${result}`,
            },
          ],
        };
      }

      default:
        return {
          content: [
            {
              type: "text",
              text: `Unknown tool: ${name}`,
            },
          ],
          isError: true,
        };
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("CCG MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
