# CCG Frontend - Frontend Development Workflow

Frontend-focused development using Gemini as primary model.

## Usage

```
/ccg:frontend <task description>
```

## Process

1. **Primary**: Use `ask_gemini` with role: frontend for all frontend tasks

2. **Validation**: Use `ask_codex` to review API integration points

3. **Iteration**: Refine based on feedback

## Gemini Expertise

- React/Vue/Angular components
- CSS/SCSS/Tailwind styling
- Responsive design
- Animation and transitions
- Accessibility (a11y)
- State management
- Performance optimization

## Common Tasks

| Task | Approach |
|------|----------|
| New component | `ask_gemini` with component specs |
| Styling | `ask_gemini` with design requirements |
| Responsive | `ask_gemini` with breakpoint needs |
| Animation | `ask_gemini` with animation specs |
| Refactor | `ask_gemini` for component restructuring |

## Integration with Backend

When frontend needs backend support:
1. Define API contract with `ask_gemini`
2. Validate with `ask_codex`
3. Implement frontend assuming API exists

## Example

```
/ccg:frontend Create a responsive navigation component with mobile menu
/ccg:frontend Add dark mode toggle with smooth transition
```
