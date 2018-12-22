import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'reactstrap';

import Message from './Message';

class MessagePane extends Component {
  render() {
    let { conversation } = this.props;

    return(
      <Form className='message-pane'>
        
      </Form>
    );
  }
}

MessagePane.propTypes = {
  conversation: PropTypes.object
};

export default MessagePane;