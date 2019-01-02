




            <Grid style={{ height: window.innerHeight, width: window.innerWidth }}>
              <Grid.Row style={{ maxHeight: window.innerHeight/1.22, maxWidth: window.innerWidth/1.23 }}>
                <Grid.Column style={{ maxHeight: window.innerHeight/4, maxWidth: window.innerWidth/4 }}>
                  <Segment padded='very' compact>
                    {this.state.loaded&&this.state.videos ? this.renderYoutube() : null}
                  </Segment>
                </Grid.Column>
                <Grid.Column style={{overflow: 'auto', maxHeight: window.innerHeight, marginLeft: 800 }} floated='left' stretched width={5}>
                <Segment padded='very' compact>
                  {this.renderMessages()}
                </Segment>
                </Grid.Column>
                <Grid.Column style={{overflow: 'auto', maxHeight: window.innerHeight }} floated='right' width={3}>
                  <Segment padded='very' compact>
                    {this.renderUsers()}
                  </Segment>
                  <SendVideo
                    youtubeInput={this.state.youtubeInput}
                    youtubeInputUrl={this.youtubeInputUrl}
                    handleYoutubeFetch={this.handleYoutubeFetch}
                  />
                  <Image.Group style={{ whiteSpace: 'nowrap', height: 130, overflowY: 'hidden', overflowX: 'auto' }} size='small'>
                    {this.renderVideos()}
                  </Image.Group>
                  <SendMessage
                    message={this.state.message}
                    handleMessage={this.handleMessage}
                    messageInput={this.messageInput}
                  />
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column style={{overflow: 'auto', maxHeight: 480 }} floated='left' stretched width={8}>
                  <SendVideo
                    youtubeInput={this.state.youtubeInput}
                    youtubeInputUrl={this.youtubeInputUrl}
                    handleYoutubeFetch={this.handleYoutubeFetch}
                  />
                    <Image.Group style={{ whiteSpace: 'nowrap', height: 130, overflowY: 'hidden', overflowX: 'auto' }} size='small'>
                      {this.renderVideos()}
                    </Image.Group>
                </Grid.Column>
                <Grid.Column width={8}>
                  <SendMessage
                    message={this.state.message}
                    handleMessage={this.handleMessage}
                    messageInput={this.messageInput}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
