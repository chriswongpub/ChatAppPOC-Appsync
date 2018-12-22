import React, { Component } from 'react';
import { Row } from 'reactstrap';

class Message extends Component {
  render() {
    return(
      <div className='message-inline'>
        <div className='message-container shadow-sm rounded m-2 pt-2 pb-2 px-2 bg-primary text-white'>
          <strong>
            Nikita
          </strong>
          <div className='message-content'>
            hello, how are you doing?
          </div>
          <div className='small d-block text-right'>
            8:29 PM
          </div>
        </div>
      </div>
    );
  }
}

export default Message;