# Project Rules and Guidelines

This document outlines the core rules and standards for the Interactive Node Network project.

## Development Process

### Code Standards
- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Write unit tests for new features
- Maintain test coverage above 80%

### Git Workflow
1. Create feature branches from `main`
2. Use conventional commit messages
3. Require code review before merging
4. Keep commits focused and atomic

### Documentation
- Update docs with code changes
- Follow documentation standards
- Keep README.md current
- Document breaking changes

### Review Process
1. Self-review code before submission
2. Address all linter warnings
3. Verify tests pass locally
4. Check documentation updates

## Performance Standards

### Response Time
- Page load: < 2 seconds
- API response: < 200ms
- Animation FPS: > 30

### Resource Usage
- Bundle size: < 500KB
- Memory usage: < 100MB
- CPU usage: < 50%

### Optimization Guidelines
1. Lazy load components
2. Minimize re-renders
3. Use proper caching
4. Optimize images and assets

### Monitoring
- Track core metrics
- Set up alerts
- Regular performance reviews
- Document optimizations

For more details on implementation, see the [Technical Documentation](./technical/README.md). 