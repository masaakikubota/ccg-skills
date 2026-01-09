# CCG Workflow - Multi-Model Development Workflow

Multi-model collaborative development workflow using Codex and Gemini.

## Usage

```
/ccg:workflow <task description>
```

## Workflow Steps

Execute the following phases in order:

### Phase 1: Research & Analysis
Use `ask_both` MCP tool to analyze the task from both perspectives:
- Codex: Backend/logic analysis
- Gemini: Frontend/UI analysis

### Phase 2: Planning
Based on analysis results, create an implementation plan using smart routing:
- Use `smart_route` to determine primary model
- Break down into actionable tasks

### Phase 3: Implementation
Execute implementation with appropriate model:
- Backend tasks → `ask_codex` with role: architect
- Frontend tasks → `ask_gemini` with role: frontend

### Phase 4: Review & Optimization
Cross-validate with both models:
- Use `ask_both` for code review
- Apply suggestions from both perspectives

## Model Selection

| Task Type | Model | Role |
|-----------|-------|------|
| API/Database | Codex | architect, debugger |
| UI/Components | Gemini | frontend |
| Logic/Algorithm | Codex | optimizer |
| Styling/UX | Gemini | frontend |
| Review | Both | reviewer |

## Example

```
/ccg:workflow Implement user authentication with JWT
```

This will:
1. Analyze auth requirements (both models)
2. Plan implementation strategy
3. Implement backend (Codex) and frontend (Gemini)
4. Cross-review the implementation
