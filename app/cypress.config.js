// cypress.config.js
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    // your app under test must already be running on this port
    baseUrl: `http://localhost:${process.env.PORT || 5001}`,
    defaultCommandTimeout: 60000,
    pageLoadTimeout: 60000,
    requestTimeout: 1500,
    responseTimeout: 15000,
    specPattern: 'cypress/e2e/**/*.spec.js',
    supportFile: false,
    setupNodeEvents(on, config) {
      // here you could hook into events, but we don’t need anything special
      return config;
    }
  },
});
