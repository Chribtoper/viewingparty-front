import React, { Fragment } from 'react'
import { Header, Image } from 'semantic-ui-react'

const NotFound = () => (
  <Fragment>
    <Header size="huge" inverted color="red">
      Page does not exist
    </Header>
    <Image src="https://wersm.com/wp-content/uploads/2013/07/404.png" />
  </Fragment>
)

export default NotFound
