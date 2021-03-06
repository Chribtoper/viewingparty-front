import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import { fetchCurrentUser } from '../actions/User.js'
import { fetchRooms } from '../actions/Rooms.js'

import { Loader, Image } from 'semantic-ui-react'

const WithAuth = (WrappedComponent) => {
  class AuthorizedComponent extends Component {

    componentDidMount() {
      if (localStorage.getItem('jwt') && !this.props.loggedIn) {
        this.props.fetchCurrentUser();
      } else if (localStorage.getItem('jwt') && this.props.loggedIn) {
        this.props.fetchRooms();
      }
    }

    render() {
      if (localStorage.getItem('jwt') && this.props.loggedIn) {
        return <WrappedComponent />
      } else if (localStorage.getItem('jwt') && (this.props.authenticatingUser || !this.props.loggedIn)) {
        return (
          <Loader className='kirbyLoader' size="massive" active inline="centered"/>
        )
      } else {
        return <Redirect to="/login" />
      }
    }
  }

  const mapStateToProps = (reduxStoreState) => {
    return {
      loggedIn: reduxStoreState.UsersReducer.loggedIn,
      authenticatingUser: reduxStoreState.UsersReducer.authenticatingUser
    }
  }

  const mapDispatchToProps = (dispatch) => {
    return {
      fetchCurrentUser: () => dispatch(fetchCurrentUser()),
      fetchRooms: () => dispatch(fetchRooms())
    }
  }
  return connect(mapStateToProps, { fetchCurrentUser, fetchRooms })(AuthorizedComponent)
}

export default WithAuth
