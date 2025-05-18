import path from 'node:path'

export function getShortTime (date: Date) {
  return Intl.DateTimeFormat('en-US', {
    timeStyle: 'medium',
    hour12: false,
  }).format(date)
}

export function getShortDate (date: Date) {
  return Intl.DateTimeFormat('en-US', {
    dateStyle: 'short',
  })
    .format(date)
    .replaceAll('/', '-')
}

export function getLogFilePath (logDir: string, formatString: string) {
  return path.resolve(logDir, formatString.replaceAll('%d', getShortDate(new Date())))
}
