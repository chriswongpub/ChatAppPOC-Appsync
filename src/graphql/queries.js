// eslint-disable
// this is an auto generated file. This will be overwritten
import gql from 'graphql-tag';

export const getUser = gql`
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      username
      team
      channels {
        items {
          id
          name
        }
        nextToken
      }
    }
  }
`;

export const getConversation = gql`
  query GetConversation($id: ID!) {
    getConversation(id: $id) {
      id
      name
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
        }
        nextToken
      }
    }
  }
`;

export const searchUsers = gql`
  query SearchUsers(
    $filter: SearchableUserFilterInput
    $sort: SearchableUserSortInput
    $limit: Int
    $nextToken: Int
  ) {
    searchUsers(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        username
        team
        channels {
          nextToken
        }
      }
      nextToken
    }
  }
`;

export const searchChannels = gql`
  query SearchChannels(
    $filter: SearchableChannelFilterInput
    $sort: SearchableChannelSortInput
    $limit: Int
    $nextToken: Int
  ) {
    searchChannels(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        user {
          id
          username
          team
        }
        conversation {
          id
          name
          createdAt
        }
      }
      nextToken
    }
  }
`;

export const searchMessages = gql`
  query SearchMessages(
    $filter: SearchableMessageFilterInput
    $sort: SearchableMessageSortInput
    $limit: Int
    $nextToken: Int
  ) {
    searchMessages(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        content
        createdAt
        owner
        isSent
        conversation {
          id
          name
          createdAt
        }
      }
      nextToken
    }
  }
`;
