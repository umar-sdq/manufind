const { defineConfig } = require("cypress");
const codeCoverage = require("@cypress/code-coverage/task");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    viewportWidth: 1280,
    viewportHeight: 800,

    setupNodeEvents(on, config) {
      codeCoverage(on, config);

      on("task", {
        resetDb() {
          return null;
        },
        seedUser(email) {
          return null;
        }
      });

      return config;
    },
  },
});
