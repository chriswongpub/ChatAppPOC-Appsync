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

export const onUpdateChannel = gql`
  subscription OnUpdateChannel($channelUserId: ID, $status: String) {
    onUpdateChannel(channelUserId: $channelUserId, status: $status) {
      id
      name
      user {
        id
        username
        team
        channels {
          nextToken
        }
      }
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
