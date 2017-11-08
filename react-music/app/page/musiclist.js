import React, { Component } from 'react'
import ListItem from '../components/listitem'

export default class MusicList extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <ul>
        {
          (this.props.musicList || []).map((item) => (
            <ListItem
              focus={item.id === this.props.currentMusicItem.id}
              key={item.id}
              musicItem={item}
            >
            </ListItem>
          ))
        }
      </ul>
    )
  }
}