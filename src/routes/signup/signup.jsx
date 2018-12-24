import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { Auth } from 'aws-amplify';
import { graphql, compose } from 'react-apollo';
import uuid from 'uuid/v4';

import './signup.css';

import { registerUser, createChannel } from 'graphql/mutations';

const conversationIDs = {
  'team1': [
    'team1conversation1',
    'team1conversation2',
    'team1conversation3'
  ],
  'team2': [
    'team2conversation1',
    'team2conversation2',
    'team2conversation3'
  ]
};

class SignupPage extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      username: 'nikita',
      password: 'P123w@rd',
      email: 'pro.zootopia106@gmail.com',
      phone_number: '+971551530758',
      team: 'team1',
      code: '',
      isConfirm: false
    };
  }

  onInputChanged = (name) => (e) => {
    this.setState({
      [name]: e.target.value
    });
  }

  /**
   * sign up 
   */
  onSignup = async (e) => {
    e.preventDefault();
    let { username, password, email, phone_number, team } = this.state;
    try {
      let data = await Auth.signUp({
        username,
        password,
        attributes: {
          email,          // optional
          phone_number,   // optional - E.164 number convention
          'custom:team': team
        },
        validationData: []  //optional
      });
      console.log('SIGN UP SUCCESS: ', data);
      this.setState({
        isConfirm: true
      });
    } catch (error) {
      console.log('SIGN UP ERROR: ', error);
      alert(error.message);
    }
  }

  /**
   * sign up confirmation
   */
  onConfirm = async (e) => {
    e.preventDefault();

    let { username, password, code } = this.state;
    try {
      let data = await Auth.confirmSignUp(username, code, {
        forceAliasCreation: true    
      });
      console.log('SIGN UP CONFIRMATION SUCCESS: ', data);

      let user = await Auth.signIn(username, password);
      let { payload } = user.signInUserSession.idToken;
      const params = {
        id: payload['sub'], 
        username: payload['cognito:username'],
        team: payload['custom:team']
      };
      await this.props.registerUser({
        variables: {
          input: params
        }
      });
      // creating 3 public channels for the new user
      await this.createChannels(params);
      this.props.history.push('/chat', { id: params.id });
    } catch(error) {
      console.log('SIGN UP CONFIRMATION ERROR: ', error);
      alert(error.message);
    }
  }

  async createChannels({ id, team }) {
    let channelTasks = [];
    conversationIDs[team].map((conversationId, index) => {
      let channelId = uuid();
      channelTasks.push(
        this.props.createChannel({
          variables: {
            input: {
              id: channelId,
              name: `Channel${index+1}`,
              channelUserId: id,
              channelConversationId: conversationId
            }
          }
        })
      );
    });
    await Promise.all(channelTasks);
  }

  renderConfirmForm() {
    return(
      <Form className='signup-confirm-form' onSubmit={this.onConfirm}>
        <legend>Confirm Sign Up</legend>
        <FormGroup>
          <Label for='username'>Username*</Label>
          <Input type='text' name='username' id='username' placeholder='Enter your username' value={this.state.username} required disabled/>
        </FormGroup>
        <FormGroup>
          <Label for='code'>Confirmation Code*</Label>
          <Input type='code' name='code' id='code' placeholder='Enter your code' value={this.state.code} onChange={this.onInputChanged('code')} required/>
        </FormGroup>
        <FormGroup className='signup-form-footer'>
          <div><a href='./login'>Back to Sign In</a></div>
          <Button color='primary' size='sm' className='confirm-btn' type='submit'>CONFIRM</Button>
        </FormGroup>
      </Form>
    );
  }

  renderSignupForm() {
    return(
      <Form className='signup-form' onSubmit={this.onSignup}>
        <legend>Create a new account</legend>
        <FormGroup>
          <Label for='username'>Username*</Label>
          <Input type='text' name='username' id='username' placeholder='Enter your username' value={this.state.username} onChange={this.onInputChanged('username')} required/>
        </FormGroup>
        <FormGroup>
          <Label for='password'>Password*</Label>
          <Input type='password' name='password' id='password' placeholder='Enter your password' value={this.state.password} onChange={this.onInputChanged('password')} required/>
        </FormGroup>
        <FormGroup>
          <Label for='email'>Email Address*</Label>
          <Input type='email' name='email' id='email' placeholder='janedoe@email.com' value={this.state.email} onChange={this.onInputChanged('email')} required/>
        </FormGroup>
        <FormGroup>
          <Label for='phone'>Phone Number*</Label>
          <Input name='phone_number' id='phone_number' placeholder='+1-555-555-1212' value={this.state.phone_number} onChange={this.onInputChanged('phone_number')} required/>
        </FormGroup>
        <FormGroup>
          <Label>Select your team</Label>
          <FormGroup check>
            <Label check>
              <Input type='radio' name='radio1' defaultChecked onClick={ () => this.setState({ team: 'team1' }) }/>
              Team 1
            </Label>
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input type='radio' name='radio1' onClick={ () => this.setState({ team: 'team2' }) }/>
              Team 2
            </Label>
          </FormGroup>
        </FormGroup>
        <FormGroup className='signup-form-footer'>
          <div>Have an account? <a href='./login'>Sign in</a></div>
          <Button color='primary' size='sm' className='signup-btn' type='submit'>CREATE AN ACCOUNT</Button>
        </FormGroup>
      </Form>
    );
  }

  render() {
    return (
      <div className='container text-center'>
        {
          this.state.isConfirm ? this.renderConfirmForm() : this.renderSignupForm()
        }
      </div>
    );
  }
}

SignupPage.propTypes = {
  history: PropTypes.object,
  registerUser: PropTypes.func.isRequired,
  createChannel: PropTypes.func.isRequired
};

let graphql_enhancer = compose(
  graphql(registerUser, {
    name: 'registerUser'
  }),
  graphql(createChannel, {
    name: 'createChannel'
  })
);

export default graphql_enhancer(SignupPage);