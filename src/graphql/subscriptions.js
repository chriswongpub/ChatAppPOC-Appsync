// eslint-disable
// this is an auto generated file. This will be overwritten
import gql from 'graphql-tag';

export const onCreateMessage = gql`
  subscription OnCreateMessage($messageConversationId: ID!) {
    onCreateMessage(messageConversationId: $messageConversationId) {
      id
      content
      createdAt
      owner
      isSent
      messageConversationId,
      conversation {
        id
        name
        createdAt
        messages {
          nextToken
        }
        channels {
          nextToken
        }
      }
    }
  }
`;

export const onCreateChannel = gql`
  subscription onCreateChannel($channelUserId: ID!) {
    onCreateChannel(channelUserId: $channelUserId) {
      id
      name
      conversation {
        id
        name
        type
        createdAt
        channels {
          items {
            user {
              id
              username
            }
          }
        }
      }
    }
  }
`;
