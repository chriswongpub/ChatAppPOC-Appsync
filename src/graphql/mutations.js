// eslint-disable
// this is an auto generated file. This will be overwritten
import gql from 'graphql-tag';

export const registerUser = gql`
  mutation RegisterUser($input: CreateUserInput!) {
    registerUser(input: $input) {
      id
      username
      team
      channels {
        items {
          id
          name
          conversation {
            id
            name
            createdAt
          }
        }
        nextToken
      }
    }
  }
`;

export const createChannel = gql`
  mutation CreateChannel($input: CreateChannelInput!) {
    createChannel(input: $input) {
      id
      name
      channelUserId
      conversation {
        id
        name
        type
        createdAt
        channels {
          items {
            channelUserId
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

export const updateChannel = gql`
  mutation UpdateChannel($input: UpdateChannelInput!) {
    updateChannel(input: $input) {
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
        type
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

export const createConversation = gql`
  mutation CreateConversation($input: CreateConversationInput!) {
    createConversation(input: $input) {
      id
      name
      type
      createdAt
      messages {
        items {
          id
          content
          createdAt
          owner
          isSent
        }
        nextToken
      }
      channels {
        items {
          id
          name
          user {
            id
            username
          }
        }
        nextToken
      }
    }
  }
`;

export const createMessage = gql`
  mutation CreateMessage($input: CreateMessageInput!) {
    createMessage(input: $input) {
      id
      content
      createdAt
      owner
      isSent
      messageConversationId
      conversation {
        id
        name
        type
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
