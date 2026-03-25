function  getHardcodedAvatar(chat) {
  const name = this.getChatName(chat) || ""

  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }

  const index = Math.abs(hash) % this.avatarHardCodedAvatar.length

  return this.avatarHardCodedAvatar[index]
}
export default getHardcodedAvatar;