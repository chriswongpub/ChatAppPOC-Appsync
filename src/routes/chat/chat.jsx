import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Auth } from 'aws-amplify';
import { graphql, compose } from 'react-apollo';

import { UserBar, SideBar, Messenger } from 'components';

import './chat.css';

import { getUser } from 'graphql/queries';
import { createConversation, createChannel } from 'graphql/mutations';


class ChatPage extends Component {
  state = {
    conversation: null
  };

  componentDidMount() {
    console.log(this.props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log('receipt props: ', nextProps);
  }

  signout = e => {
    e.preventDefault();
    Auth.signOut()
      .then(data => window.location.reload())
      .catch(err => console.log(err));
  }

  initConversation = converation => (e) => {
    e.preventDefault();
    // switch (selection.__typename) {
    // case 'User':
    //   return this.startConvoWithUser({ user: selection });
    // case 'ConvoLink':
    //   return this.gotoConversation({ convoLink: selection });
    // case 'Message':
    //   return this.startConvoAtMessage({ message: selection });
    // default:
    //   break;
    // }

    this.props.createConversation({
      variables: {
        input: {
          id: 'test',
          name: 'test name'
        }
      },
      update: async (proxy, { data: { createConversation } }) => {
        console.log('update, ', createConversation);
        this.props.createChannel({
          variables: {
            input: {
              id: 'test',
              name: 'test',
              channelUserId: this.props.data.getUser.id,
              channelConversationId: 'test'
            }
          }
        });
      }
    });
  }

  render() {
    let { data: { loading, subscribeToMore, getUser: user = null } = {} } = this.props;
    user = user || null;
    console.log(user);

    if ( loading || !user) return <div/>;
    return(
      <div className='bg-secondary row no-gutters align-items-stretch w-100 h-100 position-absolute'>
        <div className='col-4 drawer bg-white'>
          <div className='border-right border-secondary h-100'>
            <UserBar
              name={user.username}
              registered={user.registered}
              signout={this.signout}
            />
            <SideBar
              {...{
                subscribeToMore,
                channels: user.channels,
                onSelect: this.initConversation
              }}
            />
          </div>
        </div>
        <div className='col-8 messenger-view'>
          <Messenger
            conversation={this.state.conversation}
            userId={this.props.id ? this.props.id : this.props.location.state.id}
          />
        </div>
      </div>
    );
  }
}

ChatPage.propTypes = {
  history: PropTypes.object,
  createConversation: PropTypes.func.isRequired,
  createChannel: PropTypes.func.isRequired
};

let graphql_enhancer = compose(
  graphql(getUser, {
    skip: props => !props.id && !props.location.state.id,
    options: props => ({
      variables: { id: props.id ? props.id : props.location.state.id },
      fetchPolicy: 'cache-and-network'
    })
  }),
  graphql(createConversation, {
    name: 'createConversation'
  }),
  graphql(createChannel, {
    name: 'createChannel'
  })
);

export default graphql_enhancer(ChatPage);