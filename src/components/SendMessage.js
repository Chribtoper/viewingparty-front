import React from 'react';
import { Input, Button, Form } from 'semantic-ui-react'

const SendMessage = (props) => {
  return (
    <Form icon='conversation' onSubmit={(e)=>props.handleMessage(e)}>
        <label>
          Send Message:
          <input type="text" value={props.message} onChange={(e)=>props.messageInput(e)} />
        </label>
      <input type="submit" value="Submit" />
    </Form>
  )
}

export default SendMessage;
