import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'reactstrap';

class InputBar extends Component {
  state ={
    message: ''
  };

  onInputChanged = (e) => {
    this.setState({
      message: e.target.value
    });
  }

  onInputSubmit = (e) => {
    e.preventDefault();
    console.log(this.state.message);
  }

  render() {
    let { conversation } = this.props;

    return(
      <div className='inputbar'>
        <Form onSubmit={this.onInputSubmit}>
          <Input
            required
            type='text' 
            placeholder='Type a message...' 
            value={ this.state.message } 
            onChange={ this.onInputChanged }
          />
        </Form>
      </div>
    );
  }
}

InputBar.propTypes = {
  conversation: PropTypes.object
};

export default InputBar;