export default function formatChatListTime(timestamp) {
  if (!timestamp) return ""

  const messageDate = new Date(timestamp)
  const now = new Date()

  const isToday =
    messageDate.toDateString() === now.toDateString()

  const yesterday = new Date()
  yesterday.setDate(now.getDate() - 1)

  const isYesterday =
    messageDate.toDateString() === yesterday.toDateString()

  if (isToday) {
    return messageDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isYesterday) {
    return "Yesterday"
  }

  const day = String(messageDate.getDate()).padStart(2, "0")
  const month = String(messageDate.getMonth() + 1).padStart(2, "0")
  const year = messageDate.getFullYear()

  return `${day}/${month}/${year}`
}