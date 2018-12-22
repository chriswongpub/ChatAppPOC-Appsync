import React, { Component } from 'react';
import PropTypes from 'prop-types';

// import { onUpdateConvoLink } from 'graphql/subscriptions';

class SideBar extends Component {
  state = {
    curId: 0
  };

  render() {
    let { channels, onSelect } = this.props;

    return(
      <div className='sidelist'>
        {
          channels.items.length > 0 ? (
            channels.items.map(channel => {
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
              You have no channels.
            </div>
          )
        }
      </div>
    );
  }
}

SideBar.propTypes = {
  channels: PropTypes.object,
  onSelect: PropTypes.func.isRequired
};

export default SideBar;