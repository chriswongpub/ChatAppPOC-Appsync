import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';

import './Messenger.css';

import ConversationBar from './ConversationBar';
import MessagePane from './MessagePane';
import InputBar from './InputBar';
import Message from './Message';

import { getConversation } from 'graphql/queries';

class Messenger extends Component {
  getUserMap = () => {
    if ( this.props.channel) {
      const {
        channel: { conversation: { channels: { items = [] } = {} } = {} } = {}
      } = this.props;
      const users = items.reduce((acc, curr) => {
        acc[curr.user.id] = curr.user.username;
        return acc;
      }, {});
      return users;
    }
  }

  render() {
    const {
      channel,
      userId,
      data: {
        subscribeToMore,
        fetchMore,
        getConversation: { messages: { items: messages = [], nextToken } = {} } = {}
      } = {}
    } = this.props;

    return(
      <div className='messenger'>
        <ConversationBar 
          channel={channel}
        />
        <MessagePane 
          channel={channel}
          userId={userId}
          userMap={this.getUserMap()}
          {...{ messages, subscribeToMore, fetchMore, nextToken }}
        />
        <InputBar 
          channel={channel}
          userId={userId}
        />
      </div>
    );
  }
}

Messenger.propTypes = {
  channel: PropTypes.object
};

let graphql_enhancer = compose(
  graphql(getConversation, {
    skip: props => !props.channel,
    options: props => ({
      variables: { id: props.channel.conversation.id },
      fetchPolicy: 'cache-and-network'
    })
  })
);

export default graphql_enhancer(Messenger);