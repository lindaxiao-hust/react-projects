import React, { Component } from 'react';
import Header from './components/header'
import Player from './page/player'
import MusicList from './page/musiclist'
import { MUSIC_LIST } from './config/musiclist'
import { Router, Link, Route, HashRouter, Switch } from 'react-router-dom'
import Pubsub from 'pubsub-js'

export default class Root extends Component {
  constructor(props) {
    super(props)
    this.state = {
      musicList: MUSIC_LIST,
      currentMusicItem: MUSIC_LIST[1],
    }
  }

  componentDidMount() {
    $('#player').jPlayer({
      supplied: 'mp3',
      wmode: 'window'
    })
    this.playMusic(this.state.currentMusicItem)
    $('#player').bind($.jPlayer.event.ended, e => this.playNext())

    Pubsub.subscribe('DEL_MUSIC', (msg, id) => {
      this.setState({
        musicList: this.state.musicList.filter(item => item.id !== id),
      })
    })

    Pubsub.subscribe('PLAY_MUSIC', (msg, musicItem) => {
      this.playMusic(musicItem)
    })

    Pubsub.subscribe('PLAY_PREV', (msg) => {
      this.playNext('prev')
    })

    Pubsub.subscribe('PLAY_NEXT', (msg) => {
      this.playNext('next')
    })
  }

  componentWillUnmount() {
    Pubsub.unsubscribe('DEL_MUSIC')
    Pubsub.unsubscribe('PLAY_MUSIC')
    $('#player').unbind($.jPlayer.event.ended)
    Pubsub.unsubscribe('PLAY_MUSIC')
  }

  playMusic(musicItem) {
    $('#player').jPlayer('setMedia', {
      mp3: musicItem.file,
    }).jPlayer('play')

    this.setState({
      currentMusicItem: musicItem,
    })
  }

  findMusicIdx(musicItem) {
    return this.state.musicList.indexOf(musicItem)
  }

  playNext(type = 'next') {
    let idx = this.findMusicIdx(this.state.currentMusicItem)
    const len = this.state.musicList.length
    if(type === 'next') {
      idx = (idx + 1) % len
    } else {
      idx = (idx - 1 + len) % len 
    }
    this.playMusic(this.state.musicList[idx])
  }

  render() {
    return (
      <HashRouter>
        <div>
          <Header />
          <Switch>
            <Route exact path="/" render={(props) => (
              <Player currentMusicItem={this.state.currentMusicItem} />
            )} />
            <Route path="/list" render={(props) => (
              <MusicList {...props} musicList={this.state.musicList} currentMusicItem={this.state.currentMusicItem} />
            )} />
          </Switch>
        </div>
      </HashRouter>
    )
  }
}