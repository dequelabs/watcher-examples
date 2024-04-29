import { defineConfig } from 'cypress'
import { cypressConfig } from '@axe-core/watcher'

const { API_KEY, SERVER_URL = 'https://axe.deque.com' } = process.env

export default defineConfig(
  cypressConfig({
    axe: {
      apiKey: API_KEY,
      serverURL: SERVER_URL
    },
    env: {
      USERNAME: 'tomsmith',
      PASSWORD: 'SuperSecretPassword!'
    },
    defaultCommandTimeout: 10000
  })
)
