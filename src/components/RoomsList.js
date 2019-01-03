import React, { Component, Fragment } from 'react';
import Room from './Room.js';
import { Item, Header, Sidebar, Menu, Icon, Button, Container, Card, Input, Grid, Image, Segment, Divider } from 'semantic-ui-react'
import CreateRoom from './CreateRoom.js'
import withAuth from '../hocs/withAuth'
import { fetchRooms } from '../actions/rooms.js'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, NavLink, Redirect, Link, Switch, withRouter } from 'react-router-dom'

class RoomsList extends Component {

  state = {
    roomName: '',
    redirected: false,
    roomId: null
  }

  setRoomName = (e) => {
    const input = e.target.value
    this.setState({roomName: input})
  }

  createNewRoom = (e) => {
    e.preventDefault()
    fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/v1/rooms`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: this.state.roomName
      })
    })
    .then(r=>{
      console.log(this.props.usersReducer.rooms)
      this.props.fetchRooms()
      .then(()=>{
        const rooms = this.props.usersReducer.rooms
        const roomId = rooms[Object.keys(rooms)[Object.keys(rooms).length - 1]].id
        this.setState({
          redirected: true,
          roomId: roomId
        })
      })
    })
  }

  renderRooms = () => {
    if (this.props.usersReducer.rooms) {
      const rooms = this.props.usersReducer.rooms
      return rooms.map(room => {
        return (
          <Card raised href={`/rooms/${room.id}`} color='yellow'>
            <Image src={room.url}/>
            <Card.Content>
              <Card.Header>{room.name}</Card.Header>
            </Card.Content>
          </Card>
        )
      })
    }
  }

  render() {
    return (
    <Sidebar.Pushable fluid style={{ background: '#201c2b', height: '100vh' }} as={Segment}>
      <Sidebar style={{ background: '#17111e', width: '25vw' }} as={Menu} animation='overlay' direction='right' icon='labeled' inverted vertical visible width='very wide'>
        <Menu.Item style={{height: window.innerHeight/4 }}>
          <CreateRoom
            roomName={this.state.roomName}
            setRoomName={this.setRoomName}
            createNewRoom={this.createNewRoom}
            />
        </Menu.Item>
        <Menu.Item icon='home' size='massive' style={{height: window.innerHeight/4 }} as={NavLink} to="/profile" name="Profile" active={this.props.location.pathname === '/profile'}>
          <Image centered src='http://www.entypo.com/images/user.svg' style={{height: window.innerHeight/7 }} />
        </Menu.Item>
        <Menu.Item style={{height: window.innerHeight/4 }} as={NavLink} to="/rooms" name="Rooms" active={this.props.location.pathname === '/rooms'}>
          <Image centered src='http://www.entypo.com/images/home.svg' style={{height: window.innerHeight/7 }} />
        </Menu.Item>
        <Menu.Item style={{height: window.innerHeight/4 }} to="/logout" name="Logout" onClick={()=>this.props.logOut()}>
          <Image centered src='http://www.entypo.com/images/log-out.svg' style={{height: window.innerHeight/7 }} />
        </Menu.Item>
      </Sidebar>

        <Sidebar.Pusher>
          <Segment basic>
            { this.state.redirected ?
              <Redirect to={`/rooms/${this.state.roomId}`} render={window.location.reload()} />
                :
                <Grid celled='internally'>
                  <Grid.Column style={{overflow: 'auto', width: '65vw', maxHeight: window.innerHeight }}>
                    <Card.Group itemsPerRow={2}>
                      {this.renderRooms()}
                    </Card.Group>

                  </Grid.Column>
                  <Grid.Column width={4}>

                  </Grid.Column>
                </Grid>
            }
          </Segment>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    )
  }
}

const mapStateToProps = (reduxStoreState) => {
  return reduxStoreState
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchRooms: () => dispatch(fetchRooms()),
    logOut: () => dispatch({ type: 'LOG_OUT' }, localStorage.clear())
  }
}

export default withAuth(connect(mapStateToProps, mapDispatchToProps)(withRouter(RoomsList)))
