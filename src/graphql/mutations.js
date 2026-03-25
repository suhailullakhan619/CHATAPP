/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = /* GraphQL */ `
  mutation CreateUser($input: createUserInput) {
    createUser(input: $input)
  }
`;
export const sendMessage = /* GraphQL */ `
  mutation SendMessage($input: sendMessageInput) {
    sendMessage(input: $input) {
      message_id
      conversation_id
      sender_id
      sender_username
      content
      attachment_key
      attachment_name
      is_read
      created_on
      timestamp
      __typename
    }
  }
`;
export const startConversation = /* GraphQL */ `
  mutation StartConversation($input: startConversationInput) {
    startConversation(input: $input) {
      conversation_id
      participantAId
      participantAUsername
      participantAAvatar
      participantBId
      participantBUsername
      participantBAvatar
      last_message
      last_message_at
      unreadCountA
      unreadCountB
      created_on
      __typename
    }
  }
`;
export const markConversationRead = /* GraphQL */ `
  mutation MarkConversationRead($input: markConversationReadInput) {
    markConversationRead(input: $input) {
      conversationId
      readBy
      readByUsername
      readAt
      __typename
    }
  }
`;
export const createGroup = /* GraphQL */ `
  mutation CreateGroup($input: createGroupInput) {
    createGroup(input: $input) {
      conversation_id
      is_group
      group_name
      group_avatar
      creator_id
      member_count
      last_message
      last_message_at
      created_on
      __typename
    }
  }
`;
export const addGroupMembers = /* GraphQL */ `
  mutation AddGroupMembers($input: addGroupMembersInput) {
    addGroupMembers(input: $input) {
      conversation_id
      is_group
      group_name
      group_avatar
      creator_id
      member_count
      last_message
      last_message_at
      created_on
      __typename
    }
  }
`;
export const removeGroupMember = /* GraphQL */ `
  mutation RemoveGroupMember($input: removeGroupMemberInput) {
    removeGroupMember(input: $input) {
      conversation_id
      is_group
      group_name
      group_avatar
      creator_id
      member_count
      last_message
      last_message_at
      created_on
      __typename
    }
  }
`;
export const leaveGroup = /* GraphQL */ `
  mutation LeaveGroup($input: leaveGroupInput) {
    leaveGroup(input: $input)
  }
`;
export const updateGroup = /* GraphQL */ `
  mutation UpdateGroup($input: updateGroupInput) {
    updateGroup(input: $input) {
      conversation_id
      is_group
      group_name
      group_avatar
      creator_id
      member_count
      last_message
      last_message_at
      created_on
      __typename
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser($input: updateUserInput) {
    updateUser(input: $input)
  }
`;
export const deleteMessage = /* GraphQL */ `
  mutation DeleteMessage($input: deleteMessageInput) {
    deleteMessage(input: $input) {
      messageId
      conversationId
      deletedForEveryone
      deletedBy
      __typename
    }
  }
`;
export const markNotificationRead = /* GraphQL */ `
  mutation MarkNotificationRead($input: markNotificationReadInput) {
    markNotificationRead(input: $input)
  }
`;
