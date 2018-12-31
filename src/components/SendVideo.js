import React from 'react';
import { Input, Button, Form } from 'semantic-ui-react'

const SendVideo = (props) => {
  return (
    <Form icon='conversation' onSubmit={(e)=>props.handleYoutubeFetch(e)}>
        <label>
          Send Url:
          <input type="text" value={props.youtubeInput} onChange={(e)=>props.youtubeInputUrl(e)} />
        </label>
      <input type="submit" value="Submit" />
    </Form>
  )
}

export default SendVideo;
