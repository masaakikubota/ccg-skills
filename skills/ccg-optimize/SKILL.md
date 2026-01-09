# CCG Optimize - Multi-Model Performance Optimization

Performance optimization with specialized model expertise.

## Usage

```
/ccg:optimize <target file or area>
```

## Process

1. **Profile**: Identify performance bottlenecks

2. **Route by Type**:
   - Backend performance → `ask_codex` with role: optimizer
   - Frontend performance → `ask_gemini` with role: optimizer

3. **Parallel Analysis**: Use `ask_both` for comprehensive review

4. **Apply Optimizations**: Implement suggested improvements

## Optimization Areas

### Codex (Backend)
- Database query optimization
- Caching strategies
- Algorithm complexity reduction
- Memory management
- Async/parallel processing
- API response time

### Gemini (Frontend)
- Bundle size reduction
- Render performance
- Lazy loading
- Image optimization
- Code splitting
- Virtual scrolling

## Metrics to Improve

| Area | Metrics | Model |
|------|---------|-------|
| API | Response time, throughput | Codex |
| Database | Query time, connections | Codex |
| Render | FCP, LCP, CLS | Gemini |
| Bundle | Size, tree shaking | Gemini |

## Example

```
/ccg:optimize src/api/users.ts
/ccg:optimize The dashboard loads slowly
```
