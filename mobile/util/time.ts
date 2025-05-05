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
