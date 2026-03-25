/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onMessageCreated = /* GraphQL */ `
  subscription OnMessageCreated($conversationId: ID!) {
    onMessageCreated(conversationId: $conversationId) {
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
export const onConversationUpdated = /* GraphQL */ `
  subscription OnConversationUpdated($userId: ID!) {
    onConversationUpdated(userId: $userId) {
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
export const onMessagesRead = /* GraphQL */ `
  subscription OnMessagesRead($conversationId: ID!) {
    onMessagesRead(conversationId: $conversationId) {
      conversationId
      readBy
      readByUsername
      readAt
      __typename
    }
  }
`;
export const onGroupUpdated = /* GraphQL */ `
  subscription OnGroupUpdated($conversationId: ID!) {
    onGroupUpdated(conversationId: $conversationId) {
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
export const onMessageDeleted = /* GraphQL */ `
  subscription OnMessageDeleted($conversationId: ID!) {
    onMessageDeleted(conversationId: $conversationId) {
      messageId
      conversationId
      deletedForEveryone
      deletedBy
      __typename
    }
  }
`;
