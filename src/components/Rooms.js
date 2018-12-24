import React, { Component } from 'react';
import ActionCable from 'actioncable';
import SendMessage from './SendMessage.js'
import CreateRoom from './CreateRoom.js'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import withAuth from '../hocs/withAuth'
import { connect } from 'react-redux'
import { Button, Container, Card, Input, Grid, Image, Segment, Divider } from 'semantic-ui-react'
import YouTube from 'react-youtube'

class Rooms extends Component {

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
      .then(r=>r.json())
      .then(r=>{
        this.joinRoom(r.id)
      })
  }

  handleYoutubeVid = (e) => {
    e.preventDefault()
    this.state.roomSubscription.send(
      this.state.currentVideo.target.pauseVideo()
    )
  }

  handleMessage = (e) => {
    e.preventDefault()
    console.log(this.state.message)
    const roomId = this.state.currentRoomId
    const message = this.state.message
    const userId = this.props.id
    fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/v1/rooms/${roomId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        body: message,
        user_id: userId,
        room_id: roomId
      })
    })
    .then(r=>r.json())
    .then(response => {
      console.log(`Sent a message: ${response}`)
      this.setState({message: ''})
    })
  } // deals with sending messages to a room

  messageInput = (e) => {
    const input = e.target.value
    this.setState({message: input})
  } // deals with the message input on change

  setRoomName = (e) => {
    const input = e.target.value
    this.setState({roomName: input})
  }

  generateRandToken = (length) => {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for(var i = 0; i < length; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
  }

  joinRoom = (currentRoomId) => {
    this.setState({currentRoomId: currentRoomId, randToken: this.generateRandToken(8)}, () => {
      this.cable = ActionCable.createConsumer("ws://localhost:3000/cable");
      const roomSubscription = this.cable.subscriptions.create(
        {
          channel: "RoomsChannel",
          room_id: this.state.currentRoomId
        },
        { received: data => {
          console.log("The data is:", data)
          if (data.title) {
            this.setState({messages: [...this.state.messages, data.body]})
          }
          if (data.body === 'pause') {
            console.log(this.state)
            this.state.currentVideo.target.pauseVideo()
          }
          if (data.body === 'play') {
            console.log(this.state)
            this.state.currentVideo.target.playVideo()
          }
          if (data.body === 'current_time') {
            console.log(this.state)
            this.setState({currentTime: data.time})
          }
        }}
      );
      this.setState({ roomSubscription }, () => {
        fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/v1/rooms/${currentRoomId}/messages`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
            "Content-Type": "application/json"
          }
        })
        .then(r=>r.json())
        .then(messages=>{
          this.setState({messages})
        })
      })
    })
  }

  checkCurrentTimes = () => {
    if (Object.keys(this.state.currentTime).length === 0) {
      return false
    } else {
      return true
    }
  }

  _onReady = (e) => {
    this.setState({currentVideo: e})

    if (e.target.getCurrentTime() === 0 && this.checkCurrentTimes()) {
      e.target.seekTo(this.state.currentTime[Object.keys(this.state.currentTime)[0]], true)
    }

    const token = this.state.randToken
    setInterval( () => {
      let currentTime = Object.assign({...this.state.currentTime}, {[token]: this.state.currentVideo.target.getCurrentTime()})
      this.state.roomSubscription.send({body: 'current_time', time: currentTime})
    }, 1000)

  }

  _onPause = (e) => {
    console.log(this.state.roomSubscription)
    this.state.roomSubscription.send({body: 'pause'})
  }

  _onPlay = (e) => {
    this.state.roomSubscription.send({body: 'play'})
  }

  _onStateChange = (e) => {
    // if (e.target.getCurrentTime() !== this.state.currentTime[Object.keys(this.state.currentTime)[0]]) {
    //   e.target.seekTo(this.state.currentTime[Object.keys(this.state.currentTime)[0]], true)
    // } SPAGHETTI CODEEEEEEE
  }

  // _onStateChange = (e) => {
  //   this.state.roomSubscription.send({body: 'current_time', time: e.target.getCurrentTime()})
  //   console.log(this.state.currentTime)
  // }


  roomSelection() {
    return (
        <Card.Group itemsPerRow={2}>
          {this.state.rooms.map(room => (
            <Card
              image='https://i.ytimg.com/vi/Bd7MvHt3ui4/maxresdefault.jpg'
              color='blue'
              header={room.name}
              onClick={() => this.joinRoom(room.id)}
              key={room.id}
            >
            </Card>
          ))
          }
        </Card.Group>
    )
  }

  leaveRoom() {
    // fetch(ROOMS)
    // .then(r=>r.json())
    // .then(rooms=>this.setState({rooms})) REFACTOR THIS SO IT DOESNT LOOP THROUGH FETCHES
    return (
      <div>
        <Button negative
          onClick={() => {
            this.cable.subscriptions.remove(this.state.roomSubscription);
            this.setState(
              { currentRoomId: null, roomSubscription: null, messages: []},
              () => {
                console.log("Succesfully cleared subscription")
              }
            )
          }}
          >
            LeaveRoom
        </Button>
      </div>
    )
  }

  render(){
    const opts = {
      height: '390',
      width: '640',
      playerVars: {
        autoplay: 1
      }
    }
    return (
      <Container>
        <Grid>
          <Grid.Column width={11}>
            {!this.state.currentRoomId ? this.roomSelection() : this.leaveRoom()}
            {this.state.roomSubscription
              ?
              <YouTube
                videoId={'l38RaOLn8ec'}
                opts={opts}
                onReady={this._onReady}
                onPause={this._onPause}
                onPlay={this._onPlay}
                onStateChange={this._onStateChange}
              />
              :
              null
            }
            {this.state.roomSubscription ? this.state.messages.map((msg) => {
              return <li key={msg.id}>{msg.body}</li>
            })
               : null
             }
          </Grid.Column>
          <Grid.Column width={4}>
            {!this.state.currentRoomId
              ?
              <div>
                <CreateRoom
                  roomName={this.state.roomName}
                  setRoomName={this.setRoomName}
                  createNewRoom={this.createNewRoom}
                />
              </div>
              :
              <div>
                <SendMessage
                  message={this.state.message}
                  handleMessage={this.handleMessage}
                  messageInput={this.messageInput}
                />
              </div>
            }
          </Grid.Column>
        </Grid>
      </Container>
    )
  }

}

const mapStateToProps = ({ usersReducer: { user: { avatar, username, id } } }) => ({
  avatar,
  username,
  id
})

export default withAuth(connect(mapStateToProps)(Rooms))
