import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Amplify, { Auth } from 'aws-amplify';
import awsmobile from './aws-exports';
import AWSAppSyncClient from 'aws-appsync';
import { Rehydrated } from 'aws-appsync-react';

import { ApolloProvider } from 'react-apollo';

import LoginPage from 'routes/login';
import SignupPage from 'routes/signup';
import ChatPage from 'routes/chat';

Amplify.configure(awsmobile);

const client = new AWSAppSyncClient({
  url: awsmobile.aws_appsync_graphqlEndpoint,
  region: awsmobile.aws_appsync_region,
  auth: {
    type: awsmobile.aws_appsync_authenticationType,
    jwtToken: async () =>
      (await Auth.currentSession()).getIdToken().getJwtToken()
  },
  complexObjectsCredentials: () => Auth.currentCredentials()
});


class App extends Component {
  state = { 
    user: null
  };

  async componentDidMount() {
    const session = await Auth.currentSession();
  
    if (session) {
      const payload = session.idToken.payload;
      this.setState({
        user: {
          id: payload['sub'], 
          name: payload['cognito:username'],
          team: payload['custom:team']
        }
      });
    }
  }

  render() {
    return (
      <ApolloProvider client={client}>
        <Rehydrated>
          <Router>
            <Switch>
              <Route path='/login' component={ LoginPage } name='Login' />
              <Route path='/signup' component={ SignupPage } name='Signup' />
              <Route path='/chat' render={(props) => <ChatPage {...props} {...this.state.user}/>} name='Chat' />

              { !this.state.user && <Redirect to='/login' />}

              <Route path='/' render={(props) => <ChatPage {...props} {...this.state.user}/>} name='Chat' />
              
            </Switch> 
          </Router>
        </Rehydrated>
      </ApolloProvider>
    );
  }
}

export default App;
