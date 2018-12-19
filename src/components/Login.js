import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter, Redirect } from 'react-router'
import { loginUser } from '../actions/user'
import { Button, Form, Segment, Message } from 'semantic-ui-react'

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
      <Redirect to="/rooms" />
    ) : (
      <Segment>
        <Form
          onSubmit={this.handleSubmit}
          size="mini"
          key="mini"
          loading={this.props.authenticatingUser}
          error={this.props.failedLogin}
        >
          <Message error header={this.props.failedLogin ? this.props.error : null} />
          <Form.Group widths="equal">
            <Form.Input
              label="Username"
              placeholder="Username"
              name="Username"
              onChange={this.handleChange}
              value={this.state.username}
            />
            <Form.Input
              type="Password"
              label="Password"
              placeholder="Password"
              name="Password"
              onChange={this.handleChange}
              value={this.state.password}
            />
          </Form.Group>
          <Button type="submit">Login</Button>
        </Form>
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

export default withRouter(connect(mapStateToProps, { loginUser })(Login))
