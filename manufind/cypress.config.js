const { defineConfig } = require("cypress");
const codeCoverage = require("@cypress/code-coverage/task");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",

    setupNodeEvents(on, config) {
      codeCoverage(on, config);
      return config;
    },
  },
});
