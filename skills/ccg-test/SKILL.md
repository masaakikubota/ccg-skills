# CCG Test - Multi-Model Test Generation

Generate comprehensive tests with model-specific expertise.

## Usage

```
/ccg:test <file or component to test>
```

## Process

1. **Analyze Target**: Read file and determine test type needed

2. **Route to Model**:
   - Backend code → `ask_codex` with role: tester
   - Frontend components → `ask_gemini` with role: tester

3. **Generate Tests**: Create appropriate test cases

4. **Cross-Review**: Use `ask_both` to review test coverage

## Test Types by Model

### Codex (Backend)
- Unit tests for functions/methods
- Integration tests for APIs
- Database query tests
- Authentication/authorization tests
- Edge case and error handling tests

### Gemini (Frontend)
- Component rendering tests
- User interaction tests
- Accessibility tests
- Snapshot tests
- Visual regression tests

## Test Frameworks

| Type | Framework | Model |
|------|-----------|-------|
| Node.js | Jest, Mocha | Codex |
| React | React Testing Library | Gemini |
| E2E | Playwright, Cypress | Both |
| API | Supertest | Codex |

## Example

```
/ccg:test src/services/auth.ts
/ccg:test src/components/LoginForm.tsx
```
