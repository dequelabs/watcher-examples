import { defineConfig } from 'cypress'
import { cypressConfig } from '@axe-core/watcher/cypress/config'

const {
  API_KEY = '98d4abfa-c329-4e3b-8ec4-7fce9cbbee8d',
  PROJECT_ID='4a6c8b93-26ed-4046-891d-772c2b570f84',
  SERVER_URL = 'http://localhost:3002',
  BUILD_ID
} = process.env

export default defineConfig(
  cypressConfig({
    axe: {
      apiKey: API_KEY,
      projectId: PROJECT_ID,
      serverURL: SERVER_URL,
      timeout: { analyze: 60000, flush: 60000, network: 60000 },
      ...(BUILD_ID ? { buildID: BUILD_ID } : {})
    },
    defaultCommandTimeout: 120000,
    e2e: {
      baseUrl: 'https://axe-devtools-web-demo.vercel.app',
      specPattern: 'cypress/e2e/**/*.cy.ts',
      supportFile: 'cypress/support/e2e.ts'
    }
  })
)
