import { defineConfig } from "cypress";

import vitePreprocessor from "cypress-vite"

export default defineConfig({
  e2e: {
    video: false,
    screenshotOnRunFailure: false,
    setupNodeEvents(on) {
      on('file:preprocessor', vitePreprocessor())
    },
  },
});
