# CCG Backend - Backend Development Workflow

Backend-focused development using Codex as primary model.

## Usage

```
/ccg:backend <task description>
```

## Process

1. **Primary**: Use `ask_codex` with appropriate role for all backend tasks

2. **Validation**: Use `ask_gemini` to review API design for frontend consumption

3. **Iteration**: Refine based on feedback

## Codex Expertise

- API design (REST, GraphQL)
- Database schema design
- Authentication/Authorization
- Business logic implementation
- Performance optimization
- Security best practices
- Error handling

## Role Selection

| Task | Role |
|------|------|
| Architecture | architect |
| API design | architect |
| Bug fixing | debugger |
| Performance | optimizer |
| Code review | reviewer |
| Test writing | tester |

## Common Tasks

| Task | Approach |
|------|----------|
| New API | `ask_codex` role: architect |
| Database | `ask_codex` role: architect |
| Auth | `ask_codex` role: architect |
| Debug | `ask_codex` role: debugger |
| Optimize | `ask_codex` role: optimizer |

## Frontend Integration

When backend affects frontend:
1. Design API with `ask_codex`
2. Get frontend perspective with `ask_gemini`
3. Adjust API based on frontend needs

## Example

```
/ccg:backend Create REST API for user management with CRUD operations
/ccg:backend Implement rate limiting middleware
```
