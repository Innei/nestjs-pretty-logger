import path from 'path'

export const getShortTime = (date: Date) => {
  return Intl.DateTimeFormat('en-US', {
    timeStyle: 'medium',
    hour12: false,
  }).format(date)
}

export const getShortDate = (date: Date) => {
  return Intl.DateTimeFormat('en-US', {
    dateStyle: 'short',
  })
    .format(date)
    .replace(/\//g, '-')
}
/** 2-12-22, 21:31:42 */
export const getShortDateTime = (date: Date) => {
  return Intl.DateTimeFormat('en-US', {
    dateStyle: 'short',
    timeStyle: 'medium',
    hour12: false,
  })
    .format(date)
    .replace(/\//g, '-')
}

export const getLogFilePath = (logDir: string, formatString: string) =>
  path.resolve(logDir, formatString.replace(/%d/g, getShortDate(new Date())))
