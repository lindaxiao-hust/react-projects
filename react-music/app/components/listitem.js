import React, { Component } from 'react'
import './listitem.less'
import Pubsub from 'pubsub-js'

export default class ListItem extends Component {
  constructor(props) {
    super(props)
  }

  playMusic(musicItem) {
    Pubsub.publish('PLAY_MUSIC', musicItem)
  }

  delMusic(id, e) {
    e.stopPropagation()
    Pubsub.publish('DEL_MUSIC', id)
  }

  render() {
    const {id, title, artist} = this.props.musicItem
    return (
      <li onClick={this.playMusic.bind(this, this.props.musicItem)} className={`row components-listitem ${this.props.focus && 'focus'}`}>
        <p><strong>{title}</strong> - {artist}</p>
        <p onClick={this.delMusic.bind(this, id)} className="-col-auto delete"></p>
      </li>
    )
  }
}