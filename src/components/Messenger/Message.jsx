import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

class Message extends Component {
  render() {
    let { username, message, createdAt, isUser } = this.props;
    let date = moment(createdAt).format('h:m a YYYY-MM-DD');
    return(
      <div className={ isUser ? 'message-inline' : 'message-inline-other' }>
        <div className={`message-container shadow-sm rounded m-2 pt-2 pb-2 px-2 ${isUser ? 'bg-primary' : 'bg-ember'} text-white`}>
          <strong>
            {isUser ? 'You' : username}
          </strong>
          <div className='message-content'>
            {message}
          </div>
          <div className='small d-block text-right'>
            {date}
          </div>
        </div>
      </div>
    );
  }
}

Message.propTypes = {
  username: PropTypes.string,
  message: PropTypes.string,
  createdAt: PropTypes.string,
  isUser: PropTypes.bool
};

export default Message;