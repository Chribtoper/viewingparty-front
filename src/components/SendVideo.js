import React from 'react';
import { Input, Button, Form } from 'semantic-ui-react'

const SendVideo = (props) => {
  return (
    <Form onSubmit={(e)=>props.handleYoutubeFetch(e)}>
      <Form.Input
        action='Submit'
        icon='caret square right outline'
        iconPosition='left'
        label="Send URL"
        placeholder="Paste a youtube url here..."
        name="youtubeInput"
        onChange={(e)=>props.youtubeInputUrl(e)}
        value={props.youtubeInput}
      />
    </Form>
  )
}

export default SendVideo;
