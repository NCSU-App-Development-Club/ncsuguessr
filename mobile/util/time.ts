export const formatTime = (ms: number) => {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export const formatOffsetDate = (offsetDays: number): string => {
  const today = new Date()
  today.setDate(today.getDate() - offsetDays)
  const year = today.getFullYear()
  const month = (today.getMonth() + 1).toString().padStart(2, '0')
  const day = today.getDate().toString().padStart(2, '0')
  const dateString = `${year}-${month}-${day}`
  return dateString
}

export const lastNDays = (n: number): Date[] => {
  const dates: Date[] = []

  const today = new Date()
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)

    dates.push(d)
  }

  return dates
}

export const formatSecondsToMMSS = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.round(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
