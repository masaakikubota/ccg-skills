# CCG Analyze - Multi-Model Technical Analysis

Parallel technical analysis using both Codex and Gemini for cross-validation.

## Usage

```
/ccg:analyze <target or question>
```

## Process

1. **Parallel Execution**: Use `ask_both` MCP tool to get analysis from both models simultaneously

2. **Synthesis**: Compare and synthesize insights from:
   - Codex: Backend architecture, performance, security
   - Gemini: Frontend patterns, UX implications, accessibility

3. **Report**: Present unified analysis with:
   - Common findings (high confidence)
   - Unique insights from each model
   - Conflicting opinions (needs human decision)

## Analysis Types

| Type | Codex Focus | Gemini Focus |
|------|-------------|--------------|
| Code Review | Logic, security | Readability, patterns |
| Architecture | Scalability, data flow | Component structure |
| Performance | Backend bottlenecks | Render optimization |
| Bug Analysis | Root cause | User impact |

## Example

```
/ccg:analyze Why is the API response slow?
```

Output includes perspectives from both models with cross-validated conclusions.
