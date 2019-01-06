import React from 'react';
import { Label, Input, Button, Form } from 'semantic-ui-react'

const SendMessage = (props) => {
  return (
    <Form onSubmit={(e)=>props.handleMessage(e)}>
    <Label color='white'>Send Message</Label>
      <Form.Input
        action='Send'
        icon='conversation'
        iconPosition='left'
        placeholder='Type a message here...'
        name='message'
        onChange={(e)=>props.messageInput(e)}
        value={props.message}
      />
    </Form>
  )
}

export default SendMessage;
