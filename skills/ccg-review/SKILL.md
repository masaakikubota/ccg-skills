# CCG Review - Multi-Model Code Review

Dual-model code review for comprehensive coverage.

## Usage

```
/ccg:review [file or git diff]
```

Without arguments, reviews current `git diff`.

## Process

1. **Get Changes**: Run `git diff` to get current changes (or read specified file)

2. **Parallel Review**: Use `ask_both` MCP tool with reviewer role:
   - Codex: Logic correctness, security vulnerabilities, performance issues
   - Gemini: Code style, readability, frontend best practices

3. **Consolidate**: Merge feedback into categories:
   - Critical (must fix)
   - Suggestions (should consider)
   - Nitpicks (optional improvements)

## Review Checklist

### Codex Reviews
- [ ] Security vulnerabilities
- [ ] SQL injection risks
- [ ] Authentication/authorization issues
- [ ] Performance bottlenecks
- [ ] Error handling
- [ ] Edge cases

### Gemini Reviews
- [ ] Component structure
- [ ] Accessibility (a11y)
- [ ] Responsive design
- [ ] State management
- [ ] User experience
- [ ] Code readability

## Example

```
/ccg:review
/ccg:review src/components/Auth.tsx
```
