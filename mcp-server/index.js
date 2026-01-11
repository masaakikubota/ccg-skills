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

// Nano Banana Pro configuration
const NANOBANANA_WRAPPER_PATH = join(homedir(), ".claude", "bin", "nanobanana-wrapper");
const NANOBANANA_OUTPUT_DIR = join(homedir(), ".claude", "nanobanana-output");

// Image generation styles
const IMAGE_STYLES = ["photorealistic", "flat", "modern", "pixel-art", "minimal", "sketch", "watercolor", "3d-render"];

// Image types for specific generation
const IMAGE_TYPES = ["icon", "diagram", "flowchart", "pattern", "ui-mockup", "illustration", "logo", "banner"];

// Diagram types
const DIAGRAM_TYPES = ["flowchart", "architecture", "sequence", "er-diagram", "network", "mindmap", "uml"];

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
 * Execute nanobanana-wrapper for image generation
 */
async function executeNanoBanana(command, prompt, options = {}) {
  return new Promise((resolve, reject) => {
    // Check if wrapper exists
    if (!existsSync(NANOBANANA_WRAPPER_PATH)) {
      reject(new Error(`nanobanana-wrapper not found at ${NANOBANANA_WRAPPER_PATH}. Please install it first.`));
      return;
    }

    // Ensure output directory exists
    const outputDir = options.outputDir || NANOBANANA_OUTPUT_DIR;

    // Build command arguments
    const args = [command, prompt];

    if (options.style) {
      args.push(options.style);
    }

    if (options.imagePath) {
      args.push(options.imagePath);
    }

    // Set environment variables
    const env = {
      ...process.env,
      NANOBANANA_OUTPUT_DIR: outputDir,
    };

    // Spawn the process
    const proc = spawn(NANOBANANA_WRAPPER_PATH, args, {
      stdio: ["pipe", "pipe", "pipe"],
      env,
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

    // Set timeout
    const timeout = setTimeout(() => {
      proc.kill("SIGTERM");
      reject(new Error(`Image generation timed out after ${TIMEOUT_MS / 1000} seconds`));
    }, TIMEOUT_MS);

    proc.on("close", (code) => {
      clearTimeout(timeout);
      if (code === 0) {
        resolve({
          success: true,
          outputPath: stdout.trim(),
          message: `Image generated successfully: ${stdout.trim()}`,
          notes: stderr.trim() || null,
        });
      } else {
        resolve({
          success: false,
          error: stderr || `Process exited with code ${code}`,
          stdout,
        });
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
      // Image Generation Tools (Nano Banana Pro via Vertex AI)
      {
        name: "generate_image",
        description: "Generate an image using Nano Banana Pro (Gemini) via Vertex AI. Creates images from text prompts with various styles. Best for icons, diagrams, UI mockups, patterns, logos, and illustrations. Requires GCP_PROJECT_ID environment variable.",
        inputSchema: {
          type: "object",
          properties: {
            prompt: {
              type: "string",
              description: "Detailed description of the image to generate",
            },
            style: {
              type: "string",
              enum: IMAGE_STYLES,
              description: "Visual style for the image (default: modern)",
            },
            type: {
              type: "string",
              enum: IMAGE_TYPES,
              description: "Type of image to generate (optional, helps optimize the prompt)",
            },
            outputDir: {
              type: "string",
              description: "Output directory for generated images (default: ~/.claude/nanobanana-output)",
            },
          },
          required: ["prompt"],
        },
      },
      {
        name: "edit_image",
        description: "Edit an existing image using Nano Banana Pro (Gemini) via Vertex AI. Modifies images based on text instructions. Requires GCP_PROJECT_ID environment variable.",
        inputSchema: {
          type: "object",
          properties: {
            imagePath: {
              type: "string",
              description: "Absolute path to the image file to edit",
            },
            prompt: {
              type: "string",
              description: "Instructions for how to edit the image",
            },
            style: {
              type: "string",
              enum: IMAGE_STYLES,
              description: "Visual style for the edited image (default: modern)",
            },
            outputDir: {
              type: "string",
              description: "Output directory for edited images (default: ~/.claude/nanobanana-output)",
            },
          },
          required: ["imagePath", "prompt"],
        },
      },
      {
        name: "generate_icon",
        description: "Generate an app icon or UI element using Nano Banana Pro. Optimized for icon generation with proper sizing and recognizable design. Requires GCP_PROJECT_ID environment variable.",
        inputSchema: {
          type: "object",
          properties: {
            prompt: {
              type: "string",
              description: "Description of the icon to generate",
            },
            style: {
              type: "string",
              enum: ["flat", "modern", "minimal", "skeuomorphic", "outline", "3d"],
              description: "Icon style (default: modern)",
            },
            outputDir: {
              type: "string",
              description: "Output directory (default: ~/.claude/nanobanana-output)",
            },
          },
          required: ["prompt"],
        },
      },
      {
        name: "generate_diagram",
        description: "Generate a technical diagram or flowchart using Nano Banana Pro. Best for architecture diagrams, flowcharts, sequence diagrams, and technical illustrations. Requires GCP_PROJECT_ID environment variable.",
        inputSchema: {
          type: "object",
          properties: {
            prompt: {
              type: "string",
              description: "Description of the diagram to generate",
            },
            type: {
              type: "string",
              enum: DIAGRAM_TYPES,
              description: "Type of diagram (default: flowchart)",
            },
            outputDir: {
              type: "string",
              description: "Output directory (default: ~/.claude/nanobanana-output)",
            },
          },
          required: ["prompt"],
        },
      },
      {
        name: "generate_ui_mockup",
        description: "Generate a UI mockup or wireframe using Nano Banana Pro. Creates visual mockups for web pages, mobile apps, and user interfaces. Requires GCP_PROJECT_ID environment variable.",
        inputSchema: {
          type: "object",
          properties: {
            prompt: {
              type: "string",
              description: "Description of the UI mockup to generate",
            },
            platform: {
              type: "string",
              enum: ["web", "mobile", "desktop", "tablet"],
              description: "Target platform (default: web)",
            },
            style: {
              type: "string",
              enum: ["wireframe", "low-fidelity", "high-fidelity", "minimal"],
              description: "Mockup style (default: high-fidelity)",
            },
            outputDir: {
              type: "string",
              description: "Output directory (default: ~/.claude/nanobanana-output)",
            },
          },
          required: ["prompt"],
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

      // Image Generation Tool Handlers
      case "generate_image": {
        const style = args.style || "modern";
        let enhancedPrompt = args.prompt;

        // Enhance prompt based on type if specified
        if (args.type) {
          enhancedPrompt = `Create a ${args.type}: ${args.prompt}`;
        }

        const result = await executeNanoBanana("generate", enhancedPrompt, {
          style,
          outputDir: args.outputDir,
        });

        if (result.success) {
          let responseText = `## Image Generated Successfully\n\n**File:** \`${result.outputPath}\`\n**Style:** ${style}`;
          if (args.type) {
            responseText += `\n**Type:** ${args.type}`;
          }
          if (result.notes) {
            responseText += `\n\n**Notes:** ${result.notes}`;
          }
          return {
            content: [{ type: "text", text: responseText }],
          };
        } else {
          return {
            content: [{ type: "text", text: `## Image Generation Failed\n\n**Error:** ${result.error}` }],
            isError: true,
          };
        }
      }

      case "edit_image": {
        const style = args.style || "modern";

        const result = await executeNanoBanana("edit", args.prompt, {
          style,
          imagePath: args.imagePath,
          outputDir: args.outputDir,
        });

        if (result.success) {
          let responseText = `## Image Edited Successfully\n\n**Original:** \`${args.imagePath}\`\n**Edited:** \`${result.outputPath}\``;
          if (result.notes) {
            responseText += `\n\n**Notes:** ${result.notes}`;
          }
          return {
            content: [{ type: "text", text: responseText }],
          };
        } else {
          return {
            content: [{ type: "text", text: `## Image Editing Failed\n\n**Error:** ${result.error}` }],
            isError: true,
          };
        }
      }

      case "generate_icon": {
        const style = args.style || "modern";
        const enhancedPrompt = `Create an app icon: ${args.prompt}. The icon should be simple, recognizable, and work well at small sizes (16x16 to 512x512). Style: ${style}. Use appropriate background (transparent or solid color).`;

        const result = await executeNanoBanana("generate", enhancedPrompt, {
          style,
          outputDir: args.outputDir,
        });

        if (result.success) {
          let responseText = `## Icon Generated Successfully\n\n**File:** \`${result.outputPath}\`\n**Style:** ${style}`;
          if (result.notes) {
            responseText += `\n\n**Notes:** ${result.notes}`;
          }
          return {
            content: [{ type: "text", text: responseText }],
          };
        } else {
          return {
            content: [{ type: "text", text: `## Icon Generation Failed\n\n**Error:** ${result.error}` }],
            isError: true,
          };
        }
      }

      case "generate_diagram": {
        const diagramType = args.type || "flowchart";
        const enhancedPrompt = `Create a professional ${diagramType} diagram: ${args.prompt}. The diagram should be clear, well-organized, and easy to understand. Use appropriate shapes, arrows, and labels. Style: clean and modern with good contrast.`;

        const result = await executeNanoBanana("generate", enhancedPrompt, {
          style: "modern",
          outputDir: args.outputDir,
        });

        if (result.success) {
          let responseText = `## Diagram Generated Successfully\n\n**Type:** ${diagramType}\n**File:** \`${result.outputPath}\``;
          if (result.notes) {
            responseText += `\n\n**Notes:** ${result.notes}`;
          }
          return {
            content: [{ type: "text", text: responseText }],
          };
        } else {
          return {
            content: [{ type: "text", text: `## Diagram Generation Failed\n\n**Error:** ${result.error}` }],
            isError: true,
          };
        }
      }

      case "generate_ui_mockup": {
        const platform = args.platform || "web";
        const style = args.style || "high-fidelity";
        const enhancedPrompt = `Create a ${style} UI mockup for ${platform}: ${args.prompt}. The mockup should show realistic UI elements, proper spacing, and modern design patterns. Include appropriate navigation, buttons, forms, and content areas.`;

        const result = await executeNanoBanana("generate", enhancedPrompt, {
          style: "modern",
          outputDir: args.outputDir,
        });

        if (result.success) {
          let responseText = `## UI Mockup Generated Successfully\n\n**Platform:** ${platform}\n**Fidelity:** ${style}\n**File:** \`${result.outputPath}\``;
          if (result.notes) {
            responseText += `\n\n**Notes:** ${result.notes}`;
          }
          return {
            content: [{ type: "text", text: responseText }],
          };
        } else {
          return {
            content: [{ type: "text", text: `## UI Mockup Generation Failed\n\n**Error:** ${result.error}` }],
            isError: true,
          };
        }
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
