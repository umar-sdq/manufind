import { defineConfig } from "cypress";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import createEsbuildPlugin from "@badeball/cypress-cucumber-preprocessor/esbuild";

export default defineConfig({
  e2e: {
    specPattern: "**/*.feature",
    stepDefinitions: "cypress/support/step_definitions/**/*.{js,ts}",
    supportFile: "cypress/support/e2e.js",
    baseUrl: "http://localhost:5173",
    env: {
      API_BASE_URL: "http://localhost:3000" // ⬅️ ADAPTE à ton backend
    },

    async setupNodeEvents(on, config) {
      console.log("CONFIG LOADED 💚");

      await addCucumberPreprocessorPlugin(on, config);
      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );

      return config;
    },
  },
});
