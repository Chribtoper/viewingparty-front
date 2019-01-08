import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { NavLink, withRouter } from 'react-router-dom'
import { Button, Header, Icon, Image, Menu, Segment, Sidebar } from 'semantic-ui-react'
import { Route, Redirect } from 'react-router'
import App from '../App.js'

const Nav = (props) => {

  return (
    <Fragment>
    {props.user.loggedIn ? (
      <Sidebar.Pushable as={Segment}>
        <Sidebar as={Menu} animation='overlay' icon='labeled' inverted vertical visible width='thin'>
          <Menu.Item as={NavLink} to="/profile" name="Profile" active={props.location.pathname === '/profile'}>
            <Icon name='home' />
            Profile
          </Menu.Item>
          <Menu.Item as={NavLink} to="/rooms" name="Rooms" active={props.location.pathname === '/rooms'}>
            <Icon name='gamepad' />
            Rooms
          </Menu.Item>
          <Menu.Item to="/logout" name="Logout" onClick={()=>props.logOut()}>
            <Icon name='camera' />
            Logout
          </Menu.Item>
        </Sidebar>

        <Sidebar.Pusher>
          <Segment basic>
            <Header as='h3'>Application Content</Header>
            
          </Segment>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    ) : (
      null
    )}
    </Fragment>
  )
}

const mapStateToProps = ({ UsersReducer: user }) => ({ user })

const mapDispatchToProps = dispatch => {
  return {
    logOut: () => dispatch({ type: 'LOG_OUT' }, localStorage.clear())
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Nav))
