/**
 * Commitlint configuration
 *
 * Enforces conventional commit message format:
 * type(scope?): subject
 *
 * Examples:
 * - feat(ui): add new Button component
 * - fix(navbar): resolve mobile menu toggle issue
 * - docs: update README with setup instructions
 * - chore(deps): upgrade React to v18.3.1
 */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature
        'fix', // Bug fix
        'docs', // Documentation changes
        'style', // Code style changes (formatting, etc)
        'refactor', // Code refactoring
        'perf', // Performance improvements
        'test', // Adding or updating tests
        'chore', // Maintenance tasks, dependency updates
        'ci', // CI/CD changes
        'build', // Build system changes
        'revert', // Revert a previous commit
      ],
    ],
    'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
  },
};
