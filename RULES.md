# Project Rules and Best Practices

## Educational Support

### 1. Knowledge Introduction
- When encountering technical concepts, tools, or patterns for the first time, automatically offer explanations
- Use a simple y/n choice system for user to request explanations
- Break down complex topics into digestible options (e.g., y1, y2, y3 for different levels or aspects)
- Wait for user response before proceeding with technical details
- Example: "I see we're using TypeScript for the first time. Would you like me to explain what it is and why we're using it? (y/n)"

### 2. Knowledge Documentation
- Maintain learning-journal.md as our primary learning documentation
- Structure entries with:
  * Date first encountered
  * Brief description
  * Real example from our project
  * Why it's useful
- Categories include:
  * Languages and Frameworks
  * Tools and Libraries
  * Best Practices
  * Design Patterns
- Cross-reference related concepts
- Update existing entries when building on previous knowledge

### 3. Documentation Integration
- Suggest updates to existing .md files when relevant
- Create new specialized .md files for complex topics
- Maintain cross-references between related concepts
- Keep documentation DRY (Don't Repeat Yourself)

## User Interaction Rules

### 1. Explicit Acceptance Instructions
- Always notify the user when "Accept all" needs to be clicked
- Explain what changes will be accepted
- Mention if any commands will be automatically executed after acceptance
- Example: "Please click 'Accept all' to apply these changes. This will also trigger the git commit command we discussed."

### 2. Code Changes
- Never make significant code changes without user approval
- Always explain what changes are being made and why
- Show diffs or explain the impact of changes
- Wait for explicit confirmation before proceeding with related steps

### 3. Command Execution
- Always show commands before executing them
- Explain what each command does
- Indicate if commands require user approval
- Warn about any potential risks or side effects

## Development Workflow

### 1. Version Control
- Commit messages should be clear and descriptive
- Group related changes into single commits
- Push changes only after user confirmation
- Keep the main branch stable

### 2. Error Handling
- Address TypeScript/linter errors promptly
- Explain the cause of errors in plain language
- Propose clear solutions with pros and cons
- Document any workarounds used (e.g., @ts-nocheck)

### 3. Documentation
- Update NOTES.md for architectural decisions
- Document workarounds and technical debt
- Keep README.md current with setup instructions
- Add comments for complex code sections

## Project Standards

### 1. Code Quality
- Follow TypeScript best practices
- Maintain consistent code style
- Use meaningful variable and function names
- Add appropriate type annotations

### 2. Testing
- Write tests for new features
- Update tests when modifying code
- Ensure tests pass before deployment
- Document testing procedures

### 3. Performance
- Monitor canvas performance
- Optimize resource usage
- Consider mobile performance
- Document performance bottlenecks

## Deployment

### 1. Pre-deployment Checklist
- All TypeScript errors resolved
- Linter warnings addressed
- Tests passing
- Documentation updated

### 2. GitHub Actions
- Verify workflow files before pushing
- Check deployment status after push
- Monitor build logs for errors
- Document deployment process

## Communication

### 1. Status Updates
- Provide clear progress updates
- Explain any blockers or issues
- Suggest next steps
- Ask for clarification when needed

### 2. Technical Discussions
- Use clear, non-technical language when possible
- Provide examples when explaining concepts
- Break down complex topics into manageable parts
- Document important decisions

## Maintenance

### 1. Code Cleanup
- Remove unused code
- Clean up console logs
- Address TODO comments
- Update dependencies regularly

### 2. Documentation Updates
- Keep RULES.md current with new learnings
- Update NOTES.md with new architectural decisions
- Maintain clear commit history
- Document breaking changes

## Meta Rules

### 1. Continuous Improvement
- Identify opportunities to improve processes during interactions
- Proactively suggest additions to RULES.md when patterns emerge
- Ask user if observed best practices should be added to rules
- Example: "I notice we've developed a helpful pattern for handling TypeScript errors. Would you like me to add this approach to the RULES.md file?"

### 2. Learning Capture
- Document successful problem-solving approaches
- Note recurring issues and their solutions
- Identify patterns that could become standard practice
- Flag potential process improvements

## Session Management

### 1. Chat Window Management
- Starting a new chat creates a fresh context
- Previous chats remain accessible in history
- Consider starting new chats for:
  * Different major features or topics
  * After completing significant milestones
  * When switching between distinct tasks
  * When chat history becomes very long
- Example: "Let's start a fresh chat for the new feature implementation"

### 2. Memory Management
- Start new chat sessions periodically to prevent memory issues
- AI will proactively remind user when to start fresh sessions:
  * After extended chat duration (1-2 hours)
  * When complex operations are complete
  * Before starting new major features
  * When memory usage may impact performance

- Recommended breakpoints for new sessions:
  * After completing major features
  * When chat history exceeds 1-2 hours of work
  * Before starting complex new tasks
  * When switching context to different parts of the project

- Session Closure Protocol:
  * AI will offer to generate session summary
  * Save summary to SESSIONS.md in the following format:

```markdown
## Session Summary - [Date] - [Main Topic/Feature]

### Duration
- Start: [Time]
- End: [Time]
- Total: [Duration]

### Key Accomplishments
- [Major change/feature implemented]
- [Important decision made]
- [Problem solved]

### Current Status
- [What's working]
- [What's pending]
- [Known issues]

### Environment State
- Branch: [current git branch]
- Last Commit: [commit hash or message]
- Environment Variables Changed: [Yes/No]
- Services Running: [list of active services]

### Technical Debt / Workarounds
- [List of temporary solutions]
- [Areas needing refactoring]
- [Performance concerns]

### Next Steps
- [Immediate next actions]
- [Pending decisions]
- [Future considerations]

### Resources
- [Links to relevant documentation]
- [Related PRs or issues]
- [External references used]
```

- Benefits of regular session breaks:
  * Improved performance
  * Clearer context separation
  * Better organization of work
  * Reduced risk of memory-related issues
- Example: "I notice our chat has been running for over an hour. Would you like me to generate a session summary before we start a fresh chat?"

### 3. Documentation Organization
- Store session summaries in SESSIONS.md
- Keep file sizes manageable:
  * RULES.md should stay under 100KB
  * SESSIONS.md can grow larger but should be split by month if exceeding 1MB
  * Consider archiving old sessions to SESSIONS_ARCHIVE/YYYY-MM.md
- Maintain clear section breaks between sessions
- Use consistent formatting and templates
- Include links to relevant commits and PRs

### 4. Chat History Navigation
- Access previous chats through Cursor's history feature
- Use descriptive commit messages as session markers
- Reference specific chat sessions by date or milestone
- Keep related work in the same chat when practical
- Example: "Let's check our TypeScript error discussion in the previous chat session"

### 5. Session Transitions
- Document current status before ending session
- List any pending tasks or known issues
- Note any environment-specific settings
- Record any temporary workarounds in place
- Example: "Current status: GitHub Actions deployment pending, temporary TypeScript bypass in place"

### 6. Session Resume
- Review recent changes from last session
- Verify working directory and branch status
- Check if previously pending operations completed
- Confirm environment variables and configurations
- Example: "Let's check if the GitHub Actions workflow completed from our last session"

### 7. Context Preservation
- Summarize key decisions made in previous sessions
- Keep track of attempted solutions
- Document any failed approaches to avoid repetition
- Note any external resources or references used
- Example: "In our last session, we decided to use @ts-nocheck instead of fixing individual TypeScript errors"

### 8. Common Scenarios
- Handling interrupted deployments
  * Check GitHub Actions status
  * Verify last successful commit
  * Review error logs if available
- Resuming development work
  * Check git status and branch
  * Review pending changes
  * Verify development server status
- Managing multiple fixes
  * Track which fixes were applied
  * Note which fixes are pending
  * Document any dependencies between fixes 