function getChatAvatar(chat) {

  if (chat.group_avatar) {
    return chat.group_avatar
  }

  if (chat.participantAId === this.currentUser.user_id) {
    return chat.participantBAvatar
  }

  return chat.participantAAvatar
}

export default getChatAvatar;