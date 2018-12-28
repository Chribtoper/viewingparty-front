import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { NavLink, withRouter } from 'react-router-dom'
import { Button, Header, Icon, Image, Menu, Segment, Sidebar } from 'semantic-ui-react'
import { Route, Redirect } from 'react-router'

const Nav = (props) => {

  return (
    <Menu pointing secondary>
      {props.user.loggedIn ? (
        <Fragment>
          <Menu.Menu position="right">
          <Menu.Item as={NavLink} to="/profile" name="Profile" active={props.location.pathname === '/profile'} />
          <Menu.Item as={NavLink} to="/rooms" name="Rooms" active={props.location.pathname === '/rooms'} />
          <Menu.Item to="/logout" name="Logout" onClick={()=>props.logOut()} />
          </Menu.Menu>
        </Fragment>
      ) : (
        null
      )}
    </Menu>
  )
}

const mapStateToProps = ({ usersReducer: user }) => ({ user })

const mapDispatchToProps = dispatch => {
  return {
    logOut: () => dispatch({ type: 'LOG_OUT' }, localStorage.clear())
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Nav))
