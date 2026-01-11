# CCG Image - AI Image Generation with Nano Banana Pro

Generate images using Nano Banana Pro (Gemini) via Vertex AI ADC authentication.
This skill enables autonomous image generation for web development, UI design, and documentation.

## IMPORTANT: MCP Server Configuration

**This skill requires the `ccg` MCP server.** When calling image generation tools, use:

- `mcp__ccg__generate_image` - General image generation
- `mcp__ccg__generate_icon` - Icon generation
- `mcp__ccg__generate_diagram` - Diagram generation
- `mcp__ccg__generate_ui_mockup` - UI mockup generation
- `mcp__ccg__edit_image` - Image editing

If MCP tools are not available, use the nanobanana-wrapper CLI directly:
```bash
~/.claude/bin/nanobanana-wrapper generate "<prompt>"
```

## Prerequisites

Before using this skill, ensure:

1. **GCP Project Setup**
   ```bash
   export GCP_PROJECT_ID="your-project-id"
   export GCP_REGION="us-central1"  # Optional, defaults to us-central1
   ```

2. **Vertex AI API Enabled**
   - Enable `aiplatform.googleapis.com` in GCP Console

3. **ADC Authentication**
   ```bash
   gcloud auth application-default login
   ```

4. **IAM Role**
   - `roles/aiplatform.user` assigned to your account

## Usage

```
/ccg:image <prompt> [options]
```

## Available MCP Tools

This skill uses the following MCP tools from the CCG server:

| Tool | Description | Best For |
|------|-------------|----------|
| `generate_image` | General image generation | Illustrations, patterns, artwork |
| `edit_image` | Edit existing images | Modifications, enhancements |
| `generate_icon` | App icons and UI elements | Icons, logos, symbols |
| `generate_diagram` | Technical diagrams | Flowcharts, architecture, ER diagrams |
| `generate_ui_mockup` | UI/UX mockups | Web pages, mobile apps, dashboards |

## Command Patterns

### Basic Image Generation

```
/ccg:image A serene mountain landscape at sunset
/ccg:image シンプルなペンギンのロゴ
/ccg:image Abstract geometric pattern with blue and gold --style=minimal
```

### Icon Generation (use `icon:` prefix)

```
/ccg:image icon: User profile avatar
/ccg:image icon: Shopping cart for e-commerce --style=flat
/ccg:image icon: ホームボタンのアイコン --style=modern
```

### Diagram Generation (use `diagram:` prefix)

```
/ccg:image diagram: User authentication flow
/ccg:image diagram: OAuth 2.0 authorization code flow --type=sequence
/ccg:image diagram: マイクロサービスアーキテクチャ --type=architecture
/ccg:image diagram: Database schema for e-commerce --type=er-diagram
```

### UI Mockup Generation (use `ui:` or `mockup:` prefix)

```
/ccg:image ui: Login page with social auth buttons
/ccg:image mockup: Dashboard with analytics charts --platform=web
/ccg:image ui: モバイルアプリのプロフィール画面 --platform=mobile
```

### Image Editing (use `edit:` prefix)

```
/ccg:image edit: /path/to/image.png Remove the background
/ccg:image edit: ./logo.png Add a gradient overlay
/ccg:image edit: ./photo.jpg 背景を夜景に変更
```

## Process Workflow

### 1. Analyze Request

When receiving an image generation request:

1. **Parse the prompt** to determine:
   - Image type (icon, diagram, mockup, general)
   - Style preferences (flat, modern, minimal, etc.)
   - Platform (web, mobile, desktop)
   - Any reference images for editing

2. **Select the appropriate MCP tool:**

| Prompt Pattern | MCP Tool |
|----------------|----------|
| General description | `generate_image` |
| `icon:` prefix | `generate_icon` |
| `diagram:` prefix | `generate_diagram` |
| `ui:` or `mockup:` prefix | `generate_ui_mockup` |
| `edit:` prefix | `edit_image` |

### 2. Generate Image

Call the selected MCP tool with enhanced prompts:

**For `generate_image`:**
```json
{
  "prompt": "detailed description",
  "style": "modern",
  "type": "illustration"
}
```

**For `generate_icon`:**
```json
{
  "prompt": "icon description",
  "style": "flat"
}
```

**For `generate_diagram`:**
```json
{
  "prompt": "diagram description",
  "type": "flowchart"
}
```

**For `generate_ui_mockup`:**
```json
{
  "prompt": "UI description",
  "platform": "web",
  "style": "high-fidelity"
}
```

**For `edit_image`:**
```json
{
  "imagePath": "/absolute/path/to/image.png",
  "prompt": "editing instructions",
  "style": "modern"
}
```

### 3. Report Results

After generation:
1. Report the output file path
2. Suggest viewing the image with the Read tool
3. Offer follow-up actions (edit, variations, resize)

## Style Options

### Image Styles
| Style | Description |
|-------|-------------|
| `photorealistic` | Photo-like realistic images |
| `flat` | Flat design, solid colors |
| `modern` | Contemporary, clean design (default) |
| `pixel-art` | Retro pixel art style |
| `minimal` | Minimalist, simple design |
| `sketch` | Hand-drawn sketch style |
| `watercolor` | Watercolor painting effect |
| `3d-render` | 3D rendered look |

### Icon Styles
| Style | Description |
|-------|-------------|
| `flat` | Flat 2D icons |
| `modern` | Modern, gradient-enabled |
| `minimal` | Ultra-minimal design |
| `skeuomorphic` | Realistic 3D appearance |
| `outline` | Line-based outline icons |
| `3d` | 3D rendered icons |

### Diagram Types
| Type | Use Case |
|------|----------|
| `flowchart` | Process flows, decision trees |
| `architecture` | System architecture diagrams |
| `sequence` | Sequence/interaction diagrams |
| `er-diagram` | Entity-relationship diagrams |
| `network` | Network topology diagrams |
| `mindmap` | Mind maps, concept maps |
| `uml` | UML class/component diagrams |

### UI Mockup Styles
| Style | Description |
|-------|-------------|
| `wireframe` | Basic structure outlines |
| `low-fidelity` | Simple, grayscale layouts |
| `high-fidelity` | Detailed, realistic mockups |
| `minimal` | Clean, minimal design |

## Integration with Other CCG Skills

### With /ccg:frontend

Generate icons and assets for frontend development:

```
User: Create a navigation component with custom icons
1. /ccg:image icon: Home navigation icon --style=outline
2. /ccg:image icon: Settings gear icon --style=outline
3. /ccg:image icon: User profile icon --style=outline
4. /ccg:frontend Create a responsive navigation bar using these icons
```

### With /ccg:workflow

Use as part of a larger development workflow:

```
Phase 1: Design
- /ccg:image ui: Dashboard wireframe for analytics app
- /ccg:image diagram: Data flow architecture

Phase 2: Implementation
- /ccg:frontend Implement the dashboard based on the mockup
- /ccg:backend Create the API endpoints for analytics data
```

### With /ccg:analyze

Analyze existing UI and generate improvements:

```
1. /ccg:analyze Review the current UI implementation
2. /ccg:image ui: Improved version addressing the identified issues
```

## Output Location

Generated images are saved to:
- **Default:** `~/.claude/nanobanana-output/`
- **Custom:** Use `--output` option or `outputDir` parameter

File naming convention:
```
image_YYYYMMDD_HHMMSS_<random>.png
```

## Autonomous Usage Guidelines

When autonomously generating images during development:

### For Website/GUI Development

1. **When creating a new page/component:**
   - Generate UI mockup first to visualize layout
   - Generate necessary icons for navigation and actions
   - Create placeholder images for content areas

2. **When designing a feature:**
   - Create flowchart diagram for user flow
   - Generate UI mockups for each step
   - Design icons for new actions

### For Documentation

1. **Architecture documentation:**
   - Generate architecture diagrams
   - Create sequence diagrams for complex flows
   - Design ER diagrams for database schemas

2. **User guides:**
   - Generate screenshot-like mockups
   - Create step-by-step flowcharts
   - Design icons for key concepts

### Best Practices

1. **Be specific in prompts:**
   - Include colors, dimensions, and style preferences
   - Reference existing design systems when applicable
   - Specify the intended use case

2. **Iterate as needed:**
   - Use `edit_image` to refine generated images
   - Generate multiple variations and select the best
   - Combine multiple generated assets

3. **Consider context:**
   - Match the application's existing design language
   - Use consistent icon styles across the project
   - Maintain appropriate diagram conventions

## Troubleshooting

### Authentication Errors
```bash
# Re-authenticate with ADC
gcloud auth application-default login

# Verify project ID
echo $GCP_PROJECT_ID
```

### API Quota Errors
- Check Vertex AI quotas in GCP Console
- Implement backoff between requests
- Consider using different regions

### Model Errors
```bash
# Default (high quality, uses global endpoint)
export NANOBANANA_MODEL="gemini-3-pro-image-preview"
# or for faster generation (uses regional endpoint)
export NANOBANANA_MODEL="gemini-2.5-flash-image"
```

### Output Directory Issues
```bash
# Ensure directory exists
mkdir -p ~/.claude/nanobanana-output

# Check permissions
ls -la ~/.claude/nanobanana-output
```

## Examples

### Example 1: E-commerce Icon Set

```
/ccg:image icon: Shopping cart with items indicator --style=modern
/ccg:image icon: Heart/favorite button --style=modern
/ccg:image icon: Search magnifying glass --style=modern
/ccg:image icon: User account avatar --style=modern
```

### Example 2: Technical Documentation

```
/ccg:image diagram: Microservices architecture with API gateway, auth service, and database --type=architecture
/ccg:image diagram: User registration sequence showing frontend, API, database interactions --type=sequence
/ccg:image diagram: Product catalog ER diagram with categories, products, and reviews --type=er-diagram
```

### Example 3: Mobile App UI

```
/ccg:image mockup: Mobile onboarding screen with illustrations and progress dots --platform=mobile --style=high-fidelity
/ccg:image mockup: Mobile home feed with cards and bottom navigation --platform=mobile
/ccg:image mockup: Mobile profile settings page with toggle switches --platform=mobile
```

### Example 4: Web Dashboard

```
/ccg:image ui: Admin dashboard with sidebar navigation, analytics cards, and data table --platform=web
/ccg:image ui: Chart widgets showing line graph, bar chart, and pie chart
/ccg:image ui: Data filtering panel with date range picker and category filters
```

### Example 5: Image Editing

```
/ccg:image edit: ./logo.png Change background to transparent
/ccg:image edit: ./banner.png Add text overlay "Welcome to Our App"
/ccg:image edit: ./photo.jpg Apply vintage filter and add vignette
```

## Reference

- [Vertex AI Gemini API](https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/gemini)
- [Nano Banana MCP Server](https://github.com/zhongweili/nanobanana-mcp-server)
- [CCG Skills Repository](https://github.com/masaakikubota/ccg-skills)
