import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ConversationBar extends Component {
  render() {
    let { channel } = this.props;
    
    return(
      <div className='topbar'>
        <nav className='navbar navbar-expand-lg navbar-light bg-primary'>
          <span className='navbar-brand'> {channel ? channel.name : 'Appsync Chat POC'} </span>
        </nav>
      </div>
    );
  }
}

ConversationBar.propTypes = {
  channel: PropTypes.object
};

export default ConversationBar;