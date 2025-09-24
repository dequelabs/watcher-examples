import { spawnSync } from 'child_process'

export const getChromeBinaryPath = () => {
  if (process.env.CHROME_BIN) {
    return process.env.CHROME_BIN
  }

  const result = spawnSync('npx', [
    '@puppeteer/browsers',
    'install',
    'chrome@stable'
  ])
  if (result.error || result.status !== 0 || !result.stdout) {
    throw new Error(
      `Failed to install Chrome: ${result.error ? result.error.message : 'Unknown error'}`
    )
  }
  return result.stdout.toString().trim().split(' ').slice(1).join(' ')
}

export const getChromedriverBinaryPath = () => {
  if (process.env.CHROMEDRIVER_BIN) {
    return process.env.CHROMEDRIVER_BIN
  }
  const result = spawnSync('npx', [
    '@puppeteer/browsers',
    'install',
    'chromedriver@stable'
  ])
  if (result.error || result.status !== 0 || !result.stdout) {
    throw new Error(
      `Failed to install Chromedriver: ${result.error ? result.error.message : 'Unknown error'}`
    )
  }
  return result.stdout.toString().trim().split(' ').slice(1).join(' ')
}
