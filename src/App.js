import React, { Fragment } from 'react';
// import logo from './logo.svg';
import './App.css';
import { Route, Redirect, Switch, withRouter } from 'react-router-dom'
import User from './components/User'
import Login from './components/Login'
import ActionCable from 'actioncable'
import Nav from './components/Nav.js'
import Home from './containers/Home.js'
import Rooms from './components/Rooms.js'

const App = (props) => {
  return (
    <Fragment>
      <Nav />
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/rooms" />} />
          <Route exact path="/user" component={User} />
          <Route exact path="/login" component={Login} />
          <Route component={NotFound} />
        </Switch>
    </Fragment>
  )
}

export default App;
