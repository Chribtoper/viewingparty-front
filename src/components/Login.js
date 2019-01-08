import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux'
import { withRouter, Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import { loginUser, resetRegistered } from '../actions/User.js'
import { fetchRooms } from '../actions/rooms.js'
import { Header, Image, Container, Grid, Divider, Button, Form, Segment, Message } from 'semantic-ui-react'
import video from './particle.mp4'

class Login extends Component {

  state = { username: '', password: '' }

  componentDidMount(){
    this.props.resetRegistered()
  }

  handleChange = (e, semanticInputData) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  //Note: Semantic forms include preventDefault
  handleSubmit = (e) => {
    this.props.loginUser(this.state.username, this.state.password)
    this.setState({ username: '', password: '' })
  }

  render() {
    return this.props.loggedIn ? (
      <Redirect to="/rooms"/>
    ) : (
      <Container style={{ flex: 1, resizeMode: 'cover', height: window.innerHeight, width: window.innerWidth }}>
        <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle' relaxed='very' stackable>
          <Grid.Column style={{ maxWidth: 450 }}>
          <Image centered src='http://bannerfans.com/img/20216570_64c58dce-tt1_0103/19_1546545373.png' style={{height: '20vh', width: '70vh',}} />
          <Segment style={{ background: '#6f5b8c' }} raised padded='very'>
          <Form
            onSubmit={this.handleSubmit}
            size="huge"
            key="huge"
            loading={this.props.authenticatingUser}
            error={this.props.failedLogin}
          >
            <Message error header={this.props.failedLogin ? this.props.error : null} />
            <Form.Input
              icon='user'
              iconPosition='left'
              label="Username"
              placeholder="username"
              name="username"
              onChange={this.handleChange}
              value={this.state.username}
            />
            <Form.Input
              icon='lock'
              iconPosition='left'
              type="password"
              label="Password"
              placeholder="password"
              name="password"
              onChange={this.handleChange}
              value={this.state.password}
            />
            <Button type="submit" content='Login' size='massive' primary />
            <Divider horizontal>Or</Divider>
            <Button as={ Link } to='/register' content='Register' icon='signup' size='massive' />
          </Form>
          </Segment>
          </Grid.Column>
        </Grid>
        <div id='background-video'>
          <video id="background-video_vid" loop autoPlay>
            <source src={video} type="video/mp4" />
            <source src={video} type="video/ogg" />
          </video>
        </div>
      </Container>
    )
  }
}

// Destructuring the state of the reduxStoreState to avoid all the dots
const mapStateToProps = ({ usersReducer: { authenticatingUser, failedLogin, error, loggedIn } }) => ({
  authenticatingUser,
  failedLogin,
  error,
  loggedIn
})

export default withRouter(connect(mapStateToProps, { loginUser, fetchRooms, resetRegistered })(Login))
