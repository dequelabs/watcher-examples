import { defineConfig } from 'cypress'
import { cypressConfig } from '@axe-core/watcher'

const {
  API_KEY = '4771ba7b-3333-4f7b-9c98-07248f4be95f',
  SERVER_URL = 'https://axe.dequelabs.com'
} = process.env

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
