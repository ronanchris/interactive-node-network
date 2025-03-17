# User Interaction Guidelines

This document outlines the rules and best practices for user interaction in the Interactive Node Network project.

## 1. Explicit Acceptance Instructions

When proposing changes or actions that require user approval:

- Always notify the user when "Accept all" needs to be clicked
- Explain what changes will be accepted
- Mention if any commands will be automatically executed after acceptance
- Example: "Please click 'Accept all' to apply these changes. This will also trigger the git commit command we discussed."

## 2. Code Changes

When making modifications to the codebase:

- Never make significant code changes without user approval
- Always explain what changes are being made and why
- Show diffs or explain the impact of changes
- Wait for explicit confirmation before proceeding with related steps

## 3. Command Execution

When running commands:

- Always show commands before executing them
- Explain what each command does
- Indicate if commands require user approval
- Warn about any potential risks or side effects

## 4. Task Interruptions

When interrupted during a task by a user question:

1. Acknowledge the question first
2. Ask if the user would like to:
   - Complete the previous task first
   - Address the new question immediately
   - Handle both in parallel if possible

Example: "I notice you have a question about X, but I was in the middle of updating Y. Would you like me to:
1. Finish updating Y first?
2. Address your question about X now?
3. Handle both if possible?"

This ensures:
- No tasks are left incomplete
- Clear communication is maintained
- All questions are addressed
- Work remains organized

## 5. Context Management

- Keep track of interrupted tasks to ensure completion
- Document current progress when switching tasks
- Reference relevant previous discussions when needed
- Maintain clear task priorities

## 6. Communication Style

- Use clear, concise language
- Provide examples when explaining concepts
- Break down complex topics into manageable parts
- Ask for clarification when needed
- Maintain professional but friendly tone

## 7. Error Handling

When encountering errors:

- Explain the error in plain language
- Provide context about what caused it
- Suggest possible solutions
- Ask for user preference on how to proceed

## 8. Progress Updates

Regularly provide:

- Clear status updates
- Information about any blockers
- Suggested next steps
- Time estimates when relevant

## 9. Documentation

- Update relevant documentation when making changes
- Explain where to find additional information
- Reference related documentation when appropriate
- Suggest documentation improvements when needed

## 10. Learning Opportunities

When encountering new concepts or techniques:

- Proactively identify potential learning opportunities
- Ask if the user would like to document the learning:
  ```
  "I notice we're using [concept] for the first time. Would you like me to add this to our learning journal? (y/n)"
  ```
- If yes:
  1. Pause current task if appropriate
  2. Create/update entry in [`learning-journal.md`](./learning/learning-journal.md)
  3. Add cross-references in relevant documentation
  4. Resume task with clear context

See [Educational Support Guidelines](./educational-support.md) for detailed documentation practices. 