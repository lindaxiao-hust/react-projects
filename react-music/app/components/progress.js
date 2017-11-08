import React, {Component} from 'react'
import PropTypes from 'prop-types';
import './progress.less'

export default class Progress extends Component {
  // static报错请查看http://www.jianshu.com/p/29a025128990
  static defaultProps = {
    barColor: '#2f9842',    
    progress: 0,
  };

  static propTypes = {
    barColor: PropTypes.string,
    onProgressChange: PropTypes.func,
  };

  constructor(props) {
    super(props)
    this.changeProgress = this.changeProgress.bind(this)
  }

  changeProgress(e) {
    const progressBar = this.refs.progressBar
    let progress = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.clientWidth
    console.log(`progress:${progress}`)
    this.props.onProgressChange && this.props.onProgressChange(progress)
  }

  render() {
    return (
      <div className="components-progress" ref="progressBar" onClick={this.changeProgress}>
        <div className="progress" style={{width: `${this.props.progress}%`, background: this.props.barColor}}></div>
      </div>
    )
  }
}