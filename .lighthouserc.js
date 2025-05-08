
module.exports = {
  ci: {
    collect: {
      // Replace this URL with your staging URL when ready
      url: ['https://staging-url-of-your-app.example.com'],
      // Use Lighthouse CI's default settings for collecting metrics
      staticDistDir: './dist',
      // If the site requires authentication, you can add cookies here
      // cookies: { /* Add your cookies here */ },
    },
    upload: {
      // Upload the results to a temporary storage
      target: 'filesystem',
      outputDir: './.lighthouseci',
      reportFilenamePattern: 'lighthouse-report-%%DATETIME%%.json',
    },
    assert: {
      // Set the thresholds for the metrics
      // Values are between 0 and 1 (representing 0-100%)
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['warning', { minScore: 0.9 }],
      },
    },
    server: {
      // Serve the HTML report locally if needed
      port: 9000,
    },
  },
};
