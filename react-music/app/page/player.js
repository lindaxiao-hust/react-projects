import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Progress from '../components/progress'
import './player.less'
import {Link} from 'react-router-dom'
import Pubsub from 'pubsub-js'

export default class Player extends Component {
  constructor(props) {
    super(props)
    this.state = {
      progress: 0,
      volume: 0,
      isPlay: true,
      leftTime: '',
    }
    this.duration = 0 // 歌曲时长
    this.progressChangeHandler = this.progressChangeHandler.bind(this)
    this.changeVolumeHandle = this.changeVolumeHandle.bind(this)
    this.play = this.play.bind(this)
  }

  componentDidMount() {
    $('#player').bind($.jPlayer.event.timeupdate, (e) => {
      this.duration = e.jPlayer.status.duration
      this.setState({
        volume: e.jPlayer.options.volume * 100,
        progress: e.jPlayer.status.currentPercentAbsolute,
        leftTime: this.formatTime(this.duration * (1 - e.jPlayer.status.currentPercentAbsolute / 100)),
      })
    })
  }

  componentWillUnmount() {
    $('#player').unbind($.jPlayer.event.timeupdate)
  }

  formatTime(time) {
    time = Math.floor(time)
    const mins = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${mins}:${seconds < 10 ? `0${seconds}` : seconds}`
  }

  progressChangeHandler(progress) {
    $('#player').jPlayer('play', this.duration * progress)
    this.setState({
      isPlay: true,
    })
  }

  changeVolumeHandle(progress) {
    $('#player').jPlayer('volume', progress)
    this.setState({
      volume: progress * 100,
    })
  }

  play() {
    if(this.state.isPlay) {
      $('#player').jPlayer('pause')
    } else {
      $('#player').jPlayer('play')
    }
    this.setState({
      isPlay: !this.state.isPlay,
    })
  }

  playPrev() {
    Pubsub.publish('PLAY_PREV')
  }

  playNext() {
    Pubsub.publish('PLAY_NEXT')
  }

  render() {
    return (
      <div className="player-page">
        <h1 className="caption">
          <Link to="/list">我的私人音乐坊 &gt;</Link>
        </h1>
        <div className="mt20 row">
          <div className="controll-wrapper">
            <h2 className="music-title">{this.props.currentMusicItem.title}</h2>
            <h3 className="music-artist mt10">{this.props.currentMusicItem.artist}</h3>
            <div className="row mt20">
              <div className="left-time -col-auto">-{this.state.leftTime}</div>
              <div className="volume-container">
                <i className="icon-volume rt" style={{top: 5, left: -5}}></i>
                <div className="volume-wrapper">
                  <Progress
                    progress={this.state.volume}
                    onProgressChange={this.changeVolumeHandle}
                    barColor="#aaa"
                  >
                  </Progress>
                </div>
              </div>
            </div>
            <div style={{height: 10, lineHeight: '10px', marginTop: 10}}>
              <Progress
                progress={this.state.progress}
                onProgressChange={this.progressChangeHandler}
              >
              </Progress>
            </div>
            <div className="mt35 row">
              <div>
                <i className="icon prev" onClick={this.playPrev}></i>
                <i className={`icon ml20 ${this.state.isPlay ? 'pause' : 'play'}`} onClick={this.play}></i>
                <i className="icon next ml20" onClick={this.playNext}></i>
              </div>
              <div className="-col-auto">
                <i className="icon repeat-cycle"></i>
              </div>
            </div>
          </div>
          <div className="-col-auto cover">
            <img src={this.props.currentMusicItem.cover} alt={this.props.currentMusicItem.title}/>
          </div>
        </div>
      </div>
      
    )
  }

}