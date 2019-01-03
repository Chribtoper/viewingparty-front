import React from 'react';
import { Label, Input, Button, Form } from 'semantic-ui-react'

const SendVideo = (props) => {
  return (
    <Form onSubmit={(e)=>props.handleYoutubeFetch(e)}>
      <Label color='white'>Send youtube URL</Label>
      <Form.Input
        style={{ width: '35vw', fontColor: 'white'}}
        action='Submit'
        icon='caret square right outline'
        iconPosition='left'
        placeholder="Paste a youtube url here..."
        name="youtubeInput"
        onChange={(e)=>props.youtubeInputUrl(e)}
        value={props.youtubeInput}
      />
    </Form>
  )
}

export default SendVideo;
