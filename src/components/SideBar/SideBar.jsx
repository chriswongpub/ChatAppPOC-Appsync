import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

// import { onUpdateConvoLink } from 'graphql/subscriptions';

class SideBar extends Component {
  state = {
    curId: 0
  };

  channelSelected = (channel) => (e) => {
    this.setState({
      curId: channel.id
    });
    this.props.onSelect(channel);
  }

  render() {
    let { channels, onSelect } = this.props;
    let publicChannels = channels.items.filter(channel => channel.conversation.type === 'public').sort((a, b) => a.name > b.name ? 1: -1);
    let privateChannels = channels.items.filter(channel => channel.conversation.type === 'private');

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
        {
          privateChannels.length > 0 ? (
            privateChannels.map(channel => {
              return(
                <button
                  type='button'
                  key={channel.id}
                  className={
                    'list-group-item list-group-item-action' +
                    (this.state.curId === channel.id ? ' active' : '')
                  }
                  onClick={onSelect(channel)}
                >
                  {channel.name}
                </button>
              );
            })
          ) : (
            <div className='p-4 text-muted h4 text-center'>
              You have no private channels.
            </div>
          )
        }
        <Button color='primary'>
          Create a private channel
        </Button>
      </div>
    );
  }
}

SideBar.propTypes = {
  channels: PropTypes.object,
  onSelect: PropTypes.func.isRequired
};

export default SideBar;