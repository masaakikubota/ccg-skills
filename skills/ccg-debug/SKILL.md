# CCG Debug - Multi-Model Debugging

Systematic debugging with Codex for backend and Gemini for frontend issues.

## Usage

```
/ccg:debug <error description or symptoms>
```

## Process

1. **Classify Error**: Determine if backend or frontend issue using `smart_route`

2. **Primary Analysis**:
   - Backend errors → `ask_codex` with role: debugger
   - Frontend errors → `ask_gemini` with role: debugger

3. **Cross-Validation**: Use `ask_both` to verify diagnosis

4. **Fix Implementation**: Apply fix with appropriate model

## Error Classification

| Symptom | Model | Examples |
|---------|-------|----------|
| API errors | Codex | 500, timeout, auth failures |
| Database issues | Codex | Query errors, connection issues |
| Render errors | Gemini | White screen, layout broken |
| State bugs | Gemini | UI not updating, race conditions |
| Logic errors | Codex | Wrong calculations, data corruption |

## Debug Steps

1. Reproduce the issue
2. Identify error type (backend/frontend)
3. Get diagnosis from appropriate model
4. Cross-validate with other model
5. Implement and verify fix

## Example

```
/ccg:debug TypeError: Cannot read property 'map' of undefined
/ccg:debug API returns 401 after login
```
