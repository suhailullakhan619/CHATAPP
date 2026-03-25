function formatMessageDate(dateString) {

  const date = new Date(dateString)
  const today = new Date()
  const yesterday = new Date()

  yesterday.setDate(today.getDate() - 1)

  if (date.toDateString() === today.toDateString()) {
    return "Today"
  }

  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday"
  }

  return date.toLocaleDateString([], {
    day: "numeric",
    month: "short",
    year: "numeric"
  })

}
export default formatMessageDate;