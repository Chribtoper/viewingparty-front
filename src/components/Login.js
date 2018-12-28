import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter, Redirect } from 'react-router'
import { loginUser } from '../actions/user.js'
import { fetchRooms } from '../actions/rooms.js'
import { Grid, Divider, Button, Form, Segment, Message } from 'semantic-ui-react'

class Login extends Component {

  state = { username: '', password: '' }

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

      <Segment placeholder>
        <Grid columns={2} relaxed='very' stackable>
          <Grid.Column>
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
              label="username"
              placeholder="username"
              name="username"
              onChange={this.handleChange}
              value={this.state.username}
            />
            <Form.Input
              icon='lock'
              iconPosition='left'
              type="password"
              label="password"
              placeholder="password"
              name="password"
              onChange={this.handleChange}
              value={this.state.password}
            />
            <Button type="submit" content='Login' primary />
          </Form>
          </Grid.Column>

          <Grid.Column verticalAlign='middle'>
            <Button content='Sign up' icon='signup' size='massive' />
          </Grid.Column>
        </Grid>

        <Divider vertical>Or</Divider>
      </Segment>
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

export default withRouter(connect(mapStateToProps, { loginUser, fetchRooms })(Login))
