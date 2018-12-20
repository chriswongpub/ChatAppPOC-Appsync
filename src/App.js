import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import LoginPage from 'routes/login';
import SignupPage from 'routes/signup';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path='/login' component={ LoginPage } name='Login' />
          <Route path='/signup' component={ SignupPage } name='Signup' />
        </Switch> 
      </Router>
    );
  }
}

export default App;
