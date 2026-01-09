# CCG Feat - Feature Development Workflow

Comprehensive feature development using multi-model collaboration.

## Usage

```
/ccg:feat <feature description>
```

## Process

### Phase 1: Analysis
Use `ask_both` to analyze feature requirements:
- Technical feasibility
- Implementation approach
- Potential challenges

### Phase 2: Planning
1. Break down into tasks
2. Identify backend vs frontend work
3. Determine model assignments

### Phase 3: Implementation
Route tasks to appropriate models:
- `ask_codex`: API, database, business logic
- `ask_gemini`: Components, styling, UX

### Phase 4: Integration
- Connect frontend to backend
- Test integration points
- Handle error cases

### Phase 5: Review
Use `ask_both` with reviewer role for final review

## Task Distribution

| Component | Model | Deliverables |
|-----------|-------|--------------|
| Database schema | Codex | Migrations, models |
| API endpoints | Codex | Routes, controllers |
| Business logic | Codex | Services, utils |
| UI components | Gemini | React/Vue components |
| Styling | Gemini | CSS, animations |
| State management | Gemini | Store, hooks |

## Example

```
/ccg:feat Add user profile page with avatar upload
```

This creates:
- Backend: Upload API, image processing, user update endpoint
- Frontend: Profile component, avatar uploader, form handling
