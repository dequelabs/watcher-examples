import { spawnSync } from 'child_process'

export const getChromeBinaryPath = (version = null) => {
  if (process.env.CHROME_BIN) {
    return process.env.CHROME_BIN
  }
  return spawnSync('npx', ['@puppeteer/browsers', 'install', `chrome@${version || 'stable'}`])
    .stdout.toString()
    .trim()
    .split(' ')
    .slice(1)
    .join(' ')
}

export const getChromedriverBinaryPath = (version = null) => {
  if (process.env.CHROMEDRIVER_BIN) {
    return process.env.CHROMEDRIVER_BIN
  }
  return spawnSync('npx', [
    '@puppeteer/browsers',
    'install',
    `chromedriver@${version || 'stable'}`
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
