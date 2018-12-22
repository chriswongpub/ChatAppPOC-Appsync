import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ConversationBar extends Component {
  render() {
    let { conversation } = this.props;

    return(
      <div className='topbar'>
        <nav className='navbar navbar-expand-lg navbar-light bg-primary'>
          <span className='navbar-brand'> GraphQL Chat </span>
        </nav>
      </div>
    );
  }
}

ConversationBar.propTypes = {
  conversation: PropTypes.object
};

export default ConversationBar;