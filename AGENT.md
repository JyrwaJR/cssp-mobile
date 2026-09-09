## General Rules

Follow all instructions, conventions, patterns, and workflows defined by the global `AGENTS.md`.

The instructions in this file are **project-specific additions** to the global instructions. Do not ignore or replace global rules unless this file explicitly overrides them.

## Testing Requirements

Testing is a required part of every implementation task.

### When an existing page is updated

If any existing page, screen, route, or user-facing flow is modified:

1. Update the corresponding test screen.
2. Add or modify the relevant test cases to cover the changed behavior.
3. Run the test and verify that the updated behavior works as expected.
4. Fix any failures before considering the task complete.

### When a new page is added

If a new page, screen, route, or user-facing flow is created:

1. Add the page to the test screen.
2. Add the necessary test cases for its expected behavior.
3. Run the test.
4. Verify that the new page works as expected.
5. Fix any failures before considering the task complete.

### When a new feature is added

For every new feature:

1. Implement the feature.
2. Add or update the appropriate test coverage.
3. Test the complete user flow affected by the feature.
4. Verify both the expected behavior and important edge cases.
5. Fix any issues discovered during testing.
6. Re-run the relevant tests after fixes.
7. Only consider the task complete once the feature has been verified to work as expected.

## Definition of Done

A task is **not complete** when the implementation merely compiles or the code has been written.

A task is complete only when:

- The requested implementation is finished.
- Existing functionality remains working.
- New or changed pages are represented in the test screen.
- New or changed features have appropriate test coverage.
- Relevant tests have been executed.
- Test failures have been investigated and fixed.
- The final implementation has been verified to behave as expected.

**Never skip testing simply because the change appears small or straightforward.**

## Test Screen

Treat the test screen as the project's executable representation of important user flows.

Whenever application behavior changes, keep the test screen synchronized with the application.

Do not leave newly implemented pages or features untested.

## Implementation Workflow

For each task, follow this general workflow:

1. Understand the existing implementation and project patterns.
2. Implement the requested change following the existing architecture and conventions.
3. Update the test screen and tests affected by the change.
4. Run the relevant tests.
5. Investigate and fix failures.
6. Re-run the tests after fixes.
7. Verify the final behavior.
8. Consider the task complete only after successful verification.
