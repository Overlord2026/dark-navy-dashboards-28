# E2E Testing Scripts

Since package.json is read-only, please add these scripts manually:

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui", 
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:report": "playwright show-report"
  }
}
```

## CI Integration

The GitHub Actions workflow has been updated to include E2E tests that:
- Run on all PRs and main branch pushes
- Install Playwright browsers
- Run tests with traces/videos on failure
- Upload artifacts for debugging

## Running Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run with UI (interactive mode)
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed

# Debug specific test
npm run test:e2e:debug -- persona-selection.spec.ts
```