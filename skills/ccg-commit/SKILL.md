# CCG Commit - Smart Commit Message Generation

Generate Conventional Commit messages using model analysis.

## Usage

```
/ccg:commit
```

## Process

1. **Get Changes**: Run `git diff --staged` (or `git diff` if nothing staged)

2. **Analyze**: Use `smart_route` to understand the changes

3. **Generate Message**: Create Conventional Commit format message

## Commit Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting (no code change)
- `refactor`: Code restructuring
- `perf`: Performance improvement
- `test`: Adding tests
- `chore`: Maintenance tasks

## Example Output

```
feat(auth): add JWT token refresh mechanism

- Implement automatic token refresh before expiration
- Add refresh token rotation for security
- Update auth middleware to handle refresh flow

Closes #123
```

## Workflow

1. Stage your changes: `git add .`
2. Run `/ccg:commit`
3. Review generated message
4. Commit with: `git commit -m "<generated message>"`
