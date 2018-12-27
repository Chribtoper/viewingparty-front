import React, { Component } from 'react'
import withAuth from '../hocs/withAuth'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'

class Room extends Component {

  

  render(){
    return (
      <h1>This is a room</h1>
    )
  }
}

const mapStateToProps = ({ usersReducer: { user: { avatar, username, id } } }) => ({
  avatar,
  username,
  id
})

export default withAuth(connect(mapStateToProps)(Room))
