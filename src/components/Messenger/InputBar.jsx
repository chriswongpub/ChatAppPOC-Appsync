import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'reactstrap';
import { graphql, compose } from 'react-apollo';
import uuid from 'uuid/v4';

import { getConversation } from 'graphql/queries';
import { createMessage } from 'graphql/mutations';

class InputBar extends Component {
  state ={
    message: ''
  };

  onInputChanged = (e) => {
    this.setState({
      message: e.target.value
    });
  }

  onInputSubmit = (e) => {
    console.log('submit');
    e.preventDefault();
    
    const { message } = this.state;
    const { channel, userId, createMessage } = this.props;

    if (message.trim().length === 0) {
      return;
    }
    let variables = {
      input: {
        id: uuid(),
        content: this.state.message,
        createdAt: new Date().toISOString(),
        owner: userId,
        isSent: true,
        messageConversationId: channel.conversation.id,
      }
    };
    createMessage({
      variables,
      optimisticResponse: {
        createMessage: {
          __typename: 'Message',
          ...variables.input,
          owner: userId,
          isSent: false,
          conversation: {
            __typename: 'Conversation',
            id: channel.conversation.id,
            name: 'n/a',
            createdAt: 'n/a'
          },
          createdAt: new Date().toISOString()
        }
      },
      update: (proxy, { data: { createMessage: newMsg } }) => {
        const QUERY = {
          query: getConversation,
          variables: { id: channel.conversation.id }
        };
        const prev = proxy.readQuery(QUERY);
        // console.log('view prev', JSON.stringify(prev, null, 2))
        let index = prev.getConversation.messages.items.findIndex(item => item.id === newMsg.id);
        if ( index !== -1 ) {
          return;
        }
        const data = {
          getConversation: {
            ...prev.getConversation,
            messages: {
              ...prev.getConversation.messages,
              items: [newMsg, ...prev.getConversation.messages.items]
            }
          }
        };
        // console.log('view data', JSON.stringify(data, null, 2))
        proxy.writeQuery({ ...QUERY, data });
        this.setState({
          message: ''
        });
      }
    });
  }

  render() {
    return(
      <div className='inputbar'>
        <Form onSubmit={this.onInputSubmit}>
          <Input
            required
            type='text' 
            placeholder='Type a message...' 
            value={ this.state.message } 
            onChange={ this.onInputChanged }
          />
        </Form>
      </div>
    );
  }
}

InputBar.propTypes = {
  userId: PropTypes.string,
  channel: PropTypes.object,
  createMessage: PropTypes.func.isRequired
};

let graphql_enhancer = compose(
  graphql(createMessage, {
    name: 'createMessage'
  })
);

export default graphql_enhancer(InputBar);