import React, { Component } from 'react'
import withAuth from '../hocs/withAuth'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'

class Room extends Component {

  constructor(props) {
    super(props)
      this.state = {
        rooms: [],
        currentRoomId: null,
        roomSubscription: null,
        message: '',
        roomName: '',
        messages: [],
        videos: [],
        currentVideo: null,
        currentTime: {},
        randToken: null
      };
        this.messageInput = this.messageInput.bind(this)
        this.handleMessage = this.handleMessage.bind(this)
  }

  componentDidMount() {
    fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/v1/rooms`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        "Content-Type": "application/json"
      }
    })
      .then(r => r.json())
      .then(rooms => this.setState({ rooms }));
  }

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
