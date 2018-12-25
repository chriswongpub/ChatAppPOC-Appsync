import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import _cloneDeep from 'lodash.clonedeep';

import './SideBar.css';

import { onCreateChannel } from 'graphql/subscriptions';

class SideBar extends Component {
  state = {
    curId: 0
  };

  componentDidMount() {
    console.log('SideBar - componentDidMount');
    if (this.props.userId) {
      console.log('SideBar - componentDidMount - subscribe');
      this.unsubscribe = this.createSubForChannels();
    }
  }

  componentWillUnmount() {
    console.log('SideBar - componentWillUnmount');
    if (this.unsubscribe) {
      console.log('SideBar - componentDidUpdate - unsubscribe');
      this.unsubscribe();
    }
  }

  channelSelected = (channel) => (e) => {
    e.preventDefault();
    
    this.setState({
      curId: channel.id
    });
    this.props.onSelect(channel);
  }

  createSubForChannels = () => { 
    const {
      subscribeToMore,
      userId
    } = this.props;

    return subscribeToMore({
      document: onCreateChannel,
      variables: { channelUserId: userId },
      updateQuery: (
        prev,
        {
          subscriptionData: {
            data: { onCreateChannel: newChannel }
          }
        }
      ) => {
        console.log('updateQuery on channel subscription', prev, newChannel);
        const current = _cloneDeep(prev);

        let index = current.getUser.channels.items.findIndex(item => item.id === newChannel.id);
        if ( index !== -1 ) {
          return;
        }
        
        current.getUser.channels.items.unshift(newChannel);
        return current;
      }
    });
  }

  render() {
    let { channels, openNewChannelModal } = this.props;
    let publicChannels = channels.items.filter(channel => channel.conversation.type === 'public').sort((a, b) => a.conversation.createdAt > b.conversation.createdAt ? 1: -1);
    let privateChannels = channels.items.filter(channel => channel.conversation.type === 'private').sort((a, b) => a.conversation.createdAt > b.conversation.createdAt ? 1 : -1);

    return(
      <div className='sidelist text-center'>
        <div className='p-4 text-muted h4 text-center'>
          Public Channels
        </div>
        {
          publicChannels.length > 0 ? (
            publicChannels.map(channel => {
              return(
                <button
                  type='button'
                  key={channel.id}
                  className={
                    'list-group-item list-group-item-action text-left' +
                    (this.state.curId === channel.id ? ' active' : '')
                  }
                  onClick={this.channelSelected(channel)}
                >
                  {channel.name}
                </button>
              );
            })
          ) : (
            <div className='p-4 text-muted h4 text-center'>
              You have no public channels.
            </div>
          )
        }
        { privateChannels.length > 0 ?
          <div className='p-4 text-muted h4 text-center'>
            Private Channels
          </div>
          :
          <div className='p-4 text-muted h4 text-center'>
            You have no private channels.
          </div>
        }
        { privateChannels.length > 0 && (
          privateChannels.map(channel => {
            return(
              <button
                type='button'
                key={channel.id}
                className={
                  'list-group-item list-group-item-action text-left' +
                  (this.state.curId === channel.id ? ' active' : '')
                }
                onClick={this.channelSelected(channel)}
              >
                {channel.name}
              </button>
            );
          })
        ) }
        <Button className='sidebar-create-btn' color='primary' onClick={openNewChannelModal}>
          Create a private channel
        </Button>
      </div>
    );
  }
}

SideBar.propTypes = {
  channels: PropTypes.object,
  onSelect: PropTypes.func.isRequired,
  openNewChannelModal: PropTypes.func.isRequired,
  
  subscribeToMore: PropTypes.func,
  userId: PropTypes.string
};

export default SideBar;