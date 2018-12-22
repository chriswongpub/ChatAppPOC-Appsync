import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Messenger.css';

import ConversationBar from './ConversationBar';
import MessagePane from './MessagePane';
import InputBar from './InputBar';
import Message from './Message';

class Messenger extends Component {
  render() {
    const {
      conversation,
      userId,
      data: {
        subscribeToMore,
        fetchMore,
        getConvo: { messages: { items: messages = [], nextToken } = {} } = {}
      } = {}
    } = this.props;

    return(
      <div className='messenger'>
        <ConversationBar 
          conversation={conversation}
        />
        <MessagePane 
          conversation={conversation}
          userId={userId}
          {...{ messages, subscribeToMore, fetchMore, nextToken }}
        />
        <InputBar 
          conversation={conversation}
          userId={userId}
        />
      </div>
    );
  }
}

Messenger.propTypes = {

};

export default Messenger;