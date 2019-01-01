import React from 'react';
import { Input, Button, Form } from 'semantic-ui-react'

const SendMessage = (props) => {
  return (
    <Form onSubmit={(e)=>props.handleMessage(e)}>
      <Form.Input
        action='Send'
        icon='conversation'
        iconPosition='left'
        label='Send Message'
        placeholder='Type a message here...'
        name='message'
        onChange={(e)=>props.messageInput(e)}
        value={props.message}
      />
    </Form>
  )
}

export default SendMessage;
