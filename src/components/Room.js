import React, { Component, Fragment } from 'react'
import withAuth from '../hocs/withAuth'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Redirect, Switch, withRouter } from 'react-router-dom'
import ActionCable from 'actioncable';
import { Label, Feed, TextArea, Message, Button, Container, Card, Input, Grid, Image, Segment, Divider } from 'semantic-ui-react'
import YouTube from 'react-youtube'
import SendMessage from './SendMessage.js'

class Room extends Component {

  constructor(props) {
    super(props)
      this.state = {
        currentRoomId: null,
        roomSubscription: null,
        message: '',
        messages: [],
        videos: [],
        currentVideo: null,
        currentTime: null,
        randToken: null,
        currentRoom: null,
        users: [],
        userRoomId: null,
        loaded: false,
        host: false,
        redirect: false
      };
        this.messageInput = this.messageInput.bind(this)
        this.handleMessage = this.handleMessage.bind(this)
  }

  componentDidMount() {
    const currentRoomId = this.props.match.params.roomId
    this.setState({
      randToken: this.generateRandToken(8),
      currentRoomId: currentRoomId,
    })
    // this.findRoom(currentRoomId)
    this.socketConnect(currentRoomId)

  }

  componentWillUnmount() {
    // this.removeUserRoom(this.state.userRoomId)
    // let currentTime = Object.assign({...this.state.currentTime}, {[token]: this.state.currentVideo.target.getCurrentTime()})
    // this.state.roomSubscription.send({body: 'current_time', time: currentTime})
    // const currentTime = this.state.currentTime
    // const newTime = Object.keys(currentTime).reduce((object, key) => {
    //   if (key !== this.state.randToken) {
    //     object[key] = [key]
    //   } return object
    // }, {})
    // this.state.roomSubscription.send({body: 'current_time', time: newTime})
    // this.state.roomSubscription.send({title:'host_change', body: this.state.users})
    clearInterval(this.intervalOne)
    clearInterval(this.intervalTwo)
    this.cable.subscriptions.remove(this.state.roomSubscription)
    console.log("Succesfully cleared subscription")
    // this.clearInterval()
    // this.setState({ roomSubscription: null })
  }

  findRoom = (currentRoomId) => {
    return new Promise ((resolve, reject) => {
      fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/v1/rooms/${currentRoomId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          "Content-Type": "application/json"
        }
      })
      .then(r=>r.json())
      .then(currentRoom => this.setState({currentRoom}))
      resolve()
    })
  }

  socketConnect = (currentRoomId) => {
    return new Promise ((resolve, reject) => {
      this.cable = ActionCable.createConsumer("ws://localhost:3000/cable");
      const roomSubscription = this.cable.subscriptions.create(
        {
          channel: "RoomsChannel",
          room_id: currentRoomId,
          user_id: this.props.usersReducer.user.id
        },
        { received: data => {
          console.log(data)
            switch (data.title) {
              case "New message":
                // debugger
                this.setState({messages: [...this.state.messages, data.body]})
                break
              case 'User joined':
                console.log(data.body + ' has joined')
                break
              case 'All users':
                console.log(data.body)
                this.setState({users: data.body})
                this.setState({loaded: true})
                break
              case 'pause':
                console.log(this.state)
                this.state.currentVideo.target.pauseVideo()
                break
              case 'play':
                console.log(this.state)
                this.state.currentVideo.target.playVideo()
                break
              case 'current_time':
                this.setState({currentTime: data.time})
                break
              case 'host_change':
                // setTimeout(()=>{
                  // this.setState({users: data.body})
                  if (this.props.usersReducer.user.id === this.state.users[0].id) {
                    clearInterval(this.intervalTwo)
                    this.hostLoop()
                  }
                // }, 1000)
                break
              default: console.log("The data is:", data)
            }
          }
        }
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
          // this.state.roomSubscription.send({title: 'joined_room', body: this.props.usersReducer.user})
        })
      })
      resolve()
    })
  }

  handleMessage = (e) => {
    e.preventDefault()
    console.log(this.state.message)
    const roomId = this.state.currentRoomId
    const message = this.state.message
    const userId = this.props.usersReducer.user.id
    const username = this.props.usersReducer.user.username
    const avatar = this.props.usersReducer.user.avatar
    fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/v1/rooms/${roomId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        body: message,
        user_id: userId,
        room_id: roomId,
        userName: username,
        icon: avatar
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

  generateRandToken = (length) => {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for(var i = 0; i < length; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
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
    // this.setState({currentTime: this.state.currentTime})
    // if (this.props.usersReducer.user.id === this.state.users[0].id) {
    if (this.props.usersReducer.user.id === this.state.users[0].id) {
      this.intervalOne = setInterval( () => {
        this.state.roomSubscription.send({title: 'current_time', time: e.target.getCurrentTime()})
      }, 1000)
    } else {
      e.target.seekTo(this.state.currentTime, true)
      this.intervalTwo = setInterval( () => {
        if (Math.abs(e.target.getCurrentTime() - this.state.currentTime) > 3) {
          e.target.seekTo(this.state.currentTime, true)
        }
      }, 1000)
    }
  }

  _onPause = (e) => {
    console.log(this.state.roomSubscription)
    this.state.roomSubscription.send({title: 'pause'})
  }

  _onPlay = (e) => {
    this.state.roomSubscription.send({title: 'play'})
  }

  _onStateChange = (e) => {
    // if (e.target.getCurrentTime() !== this.state.currentTime[Object.keys(this.state.currentTime)[0]]) {
    //   e.target.seekTo(this.state.currentTime[Object.keys(this.state.currentTime)[0]], true)
    // } SPAGHETTI CODEEEEEEE
  }

  renderMessages = () => {
    return this.state.messages.map(message => {
        return (
          <p key={message.id}>
            <Image src={message.icon} avatar />
            <span>{message.userName}: {message.body}</span>
          </p>
        )
    })
  }

  hostLoop = () => {
    if (this.state.currentVideo) {
      this.intervalOne = setInterval( () => {
        this.state.roomSubscription.send({title: 'current_time', time: this.state.currentVideo.target.getCurrentTime()})
      }, 1000)
    }
  }

  userLoop = () => {
    this.intervalTwo = setInterval( () => {
      if (Math.abs(this.state.currentVideo.target.getCurrentTime() - this.state.currentTime) > 3) {
        this.state.currentVideo.target.seekTo(this.state.currentTime, true)
      }
    }, 1000)
  }

  renderUsers = () => {
    return this.state.users.map(user => {
      if (user.id === this.state.users[0].id){
        return (
          <p key={user.id}>
          <Label color='yellow' image>
            <img src={user.avatar} />
            {user.username}
            <Label.Detail>host</Label.Detail>
          </Label>
          </p>
        )
      } else {
        return (
          <p key={user.id}>
          <Label color='blue' image>
            <img src={user.avatar} />
            {user.username}
            <Label.Detail>user</Label.Detail>
          </Label>
          </p>
        )
      }

    })
  }

  renderYoutube = () => {

      if (this.state.currentTime!==null || (this.props.usersReducer.user.id === this.state.users[0].id)) {
      // if (this.state.currentTime!==null || 1 === 1) {
        const opts = {
          height: '390',
          width: '640',
          playerVars: {
            autoplay: 1
          }
        }
        return (<YouTube
                videoId={'l38RaOLn8ec'}
                opts={opts}
                onReady={this._onReady}
                onPause={this._onPause}
                onPlay={this._onPlay}
                onStateChange={this._onStateChange}
              />)
      } else {
        setTimeout( () => {
          this.renderYoutube()
        }, 1000)
      }
  }


  // leaveRoom() {
  //   // fetch(ROOMS)
  //   // .then(r=>r.json())
  //   // .then(rooms=>this.setState({rooms})) REFACTOR THIS SO IT DOESNT LOOP THROUGH FETCHES
  //   clearInterval()
  //   return (
  //     <div>
  //       <Button negative
  //         onClick={() => {
  //           this.cable.subscriptions.remove(this.state.roomSubscription);
  //           this.setState(
  //             { currentRoomId: null, roomSubscription: null, messages: []},
  //             () => {
  //               console.log("Succesfully cleared subscription")
  //             }
  //           )
  //         }}
  //         >
  //           LeaveRoom
  //       </Button>
  //     </div>
  //   )
  // }

  render(){
    const opts = {
      height: '390',
      width: '640',
      playerVars: {
        autoplay: 1
      }
    }
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={8}>
            <Segment padded='very' compact>
              {this.state.loaded ? this.renderYoutube() : null}
            </Segment>
          </Grid.Column>
          <Grid.Column style={{overflow: 'auto', maxHeight: 480 }} floated='right' stretched width={4}>
            <Segment padded='very' compact>
              {this.renderMessages()}
            </Segment>
          </Grid.Column>
          <Grid.Column style={{overflow: 'auto', maxHeight: 480 }} floated='right' stretched width={4}>
            <Segment padded='very' compact>
              {this.renderUsers()}
            </Segment>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={8}>
            lower left
          </Grid.Column>
          <Grid.Column width={8}>
            <SendMessage
              message={this.state.message}
              handleMessage={this.handleMessage}
              messageInput={this.messageInput}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

const mapStateToProps = (reduxStoreState) => {
  return reduxStoreState
}

export default withAuth(connect(mapStateToProps)(withRouter(Room)))
