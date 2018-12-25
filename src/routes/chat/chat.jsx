import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Auth } from 'aws-amplify';
import { graphql, compose } from 'react-apollo';
import uuid from 'uuid/v4';

import { UserBar, SideBar, Messenger, PrivateChannelModal } from 'components';

import './chat.css';

import { getUser } from 'graphql/queries';
import { createConversation, createChannel } from 'graphql/mutations';

const conversationList = {};

class ChatPage extends Component {
  state = {
    channel: null,
    modal: false,
    selectedUsers: []
  };

  componentDidMount(prevProps, prevState, snapshot) {
    console.log(this.props);
  }

  signout = e => {
    e.preventDefault();
    Auth.signOut()
      .then(data => this.props.history.push('/login'))
      .catch(err => console.log(err));
  }

  openNewChannelModal = (e) => {
    this.setState({
      selectedUsers: []
    });
    this.toggleModal();
  }

  channelSelected = (channel) => {
    this.setState({
      channel
    }); 
  }

  createConversation = (e) => {
    e.preventDefault();

    let { data: { getUser: user = null } = {} } = this.props;
    let conversationName = user.username + ',';
    conversationName += this.state.selectedUsers.map(user => user.username).join(',');

    this.props.createConversation({
      variables: {
        input: {
          id: uuid(),
          name: conversationName,
          createdAt: new Date().toISOString,
          type: 'private'
        }
      },
      optimisticResponse: {
        createConversation: {
          __typename: 'Conversation',
          id: '-1',
          name: conversationName,
          createdAt: '',
          type: 'private',
          channesl: {
            __typename: 'ModelChannelConnection',
            items: []
          },
          messages: {
            __typename: 'ModelMessageConnection',
            items: []
          }
        }
      },
      update: async (proxy, { data: { createConversation } }) => {
        console.log('update, ', createConversation);
        if (createConversation.id === '-1' || conversationList[`${createConversation.id}`]) {
          return;
        }
        conversationList[`${createConversation.id}`] = true;
        
        let channelTasks = [];
        const me = this.props.data.getUser;
        channelTasks.push(this.createChannel(createConversation.id, me.id));
        this.state.selectedUsers.map(user => {
          channelTasks.push(this.createChannel(createConversation.id, user.id));
          return user;
        });
        const channels = await Promise.all(channelTasks);
        console.log('next steps', channels);

        const QUERY = {
          query: getUser,
          variables: { id: me.id }
        };
        const prev = proxy.readQuery(QUERY);
        // console.log('view prev', JSON.stringify(prev, null, 2))
        let index = prev.getUser.channels.items.findIndex(item => item.id === channels[0].id);
        if ( index !== -1 ) {
          return;
        }
        const data = {
          getUser: {
            ...prev.getUser,
            channels: {
              ...prev.getUser.channels,
              items: [channels[0], ...prev.getUser.channels.items]
            }
          }
        };
        // console.log('view data', JSON.stringify(data, null, 2));
        proxy.writeQuery({ ...QUERY, data });

        this.toggleModal();
      }
    });
  }

  createChannel = async ( conversationId, userId ) => {
    let channelName = 'You,';
    let { data: { getUser: user = null } = {} } = this.props;
    if (userId === user.id) {
      channelName += this.state.selectedUsers.map(user => user.username).join(',');
    } else {
      let other_usernames = [];
      other_usernames.push(user.username);
      this.state.selectedUsers.map(item => {
        if ( item.id !== userId ) {
          other_usernames.push(item.username);
        }
        return item;
      });
      channelName += other_usernames.join(',');
    }
    console.log('channel name: ', channelName);

    let resolveFn;
    const promise = new Promise((resolve, reject) => {
      resolveFn = resolve;
    });

    this.props.createChannel({
      variables: {
        input: {
          id: uuid(),
          name: channelName,
          channelUserId: userId,
          channelConversationId: conversationId
        }
      },
      optimisticResponse: {
        createChannel: {
          __typename: 'Channel',
          id: '-1',
          name: channelName,
          conversation: {
            __typename: 'Conversation',
            id: conversationId,
            name: '',
            createdAt: '',
            channels: {
              __typename: 'ModelChannelConnection',
              items: []
            }
          }
        }
      },
      update: async (proxy, { data: { createChannel } }) => {
        if (createChannel.id === '-1') {
          return;
        }
        resolveFn(createChannel);
      }
    });
    return promise;
  }

  selectUser = ({id, username, team}) => (e) => {
    e.preventDefault();
    
    let { selectedUsers } = this.state;
    let index = selectedUsers.findIndex(item => item.id === id);

    if ( index === -1 ) {
      selectedUsers.push({id, username, team});
    } else {
      selectedUsers.splice(index, 1);
    }
    this.setState({ selectedUsers });
  }

  toggleModal = () => {
    this.setState({
      modal: !this.state.modal
    });
  }

  render() {
    let { data: { loading, subscribeToMore, getUser: user = null } = {} } = this.props;
    user = user || null;
    
    if ( loading || !user) return <div/>;
    return(
      <div className='bg-secondary row no-gutters align-items-stretch w-100 h-100 position-absolute'>
        <div className='col-4 drawer bg-white'>
          <div className='border-right border-secondary h-100'>
            <UserBar
              name={user.username}
              team={user.team}
              signout={this.signout}
            />
            <SideBar
              {...{
                subscribeToMore,
                userId: user.id,
                channels: user.channels,
                onSelect: this.channelSelected,
                openNewChannelModal: this.openNewChannelModal
              }}
            />
          </div>
        </div>
        <div className='col-8 messenger-view'>
          <Messenger
            channel={this.state.channel}
            userId={this.props.id ? this.props.id : this.props.location.state.id}
          />
        </div>
        <PrivateChannelModal 
          userId={this.props.id ? this.props.id : this.props.location.state.id}
          visible={this.state.modal}
          toggleModal={this.toggleModal}
          selectedUsers={this.state.selectedUsers}
          select={this.selectUser}
          done={this.createConversation}
        />
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