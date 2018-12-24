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
    channel: null
  };

  // UNSAFE_componentWillReceiveProps(nextProps) {
  //   console.log(nextProps);
  // }

  componentDidMount(prevProps, prevState, snapshot) {
    console.log(this.props);
  }

  signout = e => {
    e.preventDefault();
    Auth.signOut()
      .then(data => this.props.history.push('/login'))
      .catch(err => console.log(err));
  }

  channelSelected = (channel) => {
    this.setState({
      channel
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
                channels: user.channels,
                onSelect: this.channelSelected
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