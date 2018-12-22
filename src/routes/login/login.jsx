import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { Auth } from 'aws-amplify';

import './login.css';

class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: ''
    };
  }

  onInputChanged = (name) => (e) => {
    this.setState({
      [name]: e.target.value
    });
  }

  /**
   * log in
   */
  onLogin = async (e) => {
    e.preventDefault();
    let { username, password } = this.state;
    try {
      let user = await Auth.signIn(username, password);
      let { sub } = user.signInUserSession.idToken.payload;

      this.props.history.push('/chat', { id: sub });
    } catch(error) {
      alert(error.message);
    }
  }

  render() {
    return (
      <div className='container text-center'>
        <Form className='login-form' onSubmit={this.onLogin}>
          <legend>Sign in to your account</legend>
          <FormGroup>
            <Label for='username'>Username*</Label>
            <Input type='text' name='username' id='username' placeholder='Enter your username' value={ this.state.username } onChange={ this.onInputChanged('username') } required/>
          </FormGroup>
          <FormGroup>
            <Label for='password'>Password*</Label>
            <Input type='password' name='password' id='password' placeholder='Enter your password' value={ this.state.password } onChange={ this.onInputChanged('password') } required/>
          </FormGroup>
          <FormGroup className='login-form-footer'>
            <div>No account? <a href='./signup'>Create account</a> </div>
            <Button color='primary' size='sm' className='login-btn'>SIGN IN</Button>
          </FormGroup>
        </Form>
      </div>
    );
  }
}

LoginPage.propTypes = {
  history: PropTypes.object
};


export default LoginPage;