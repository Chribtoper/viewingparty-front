import React, { Fragment, Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Redirect, Switch, withRouter } from 'react-router-dom'
import Profile from './components/Profile.js'
import Login from './components/Login.js'
import ActionCable from 'actioncable'
import RoomsPage from './components/RoomsPage.js'
import NotFound from './components/NotFound.js'
import Register from './components/Register.js'

class App extends Component {

  render(){
    document.title = 'Viewing Party'
    return (
      <Fragment>
            <Switch>
              <Route exact path="/" render={() => <Redirect to="/rooms" />} />
              <Route exact path="/profile" component={Profile} />
              <Route path="/rooms" render={routerProps => <RoomsPage {...routerProps} />} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              <Route component={NotFound} />
            </Switch>
      </Fragment>
    )
  }
}

export default withRouter(App);
