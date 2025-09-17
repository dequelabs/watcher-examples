import { spawnSync } from 'child_process'

export const getChromeBinaryPath = () => {
  if (process.env.CHROME_BIN) {
    return process.env.CHROME_BIN
  }
  return spawnSync('npx', ['@puppeteer/browsers', 'install', 'chrome@stable'])
    .stdout.toString()
    .trim()
    .split(' ')
    .slice(1)
    .join(' ')
}

export const getChromedriverBinaryPath = () => {
  if (process.env.CHROMEDRIVER_BIN) {
    return process.env.CHROMEDRIVER_BIN
  }
  return spawnSync('npx', [
    '@puppeteer/browsers',
    'install',
    'chromedriver@stable'
  ])
    .stdout.toString()
    .trim()
    .split(' ')
    .slice(1)
    .join(' ')
}

export const logPaths = () => {
  console.log([getChromeBinaryPath(), getChromedriverBinaryPath()])
}
