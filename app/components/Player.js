// @flow
import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import styles from './Player.css';
import type { stationStateType } from '../reducers/stations';

type Props = {
  activate: () => void,
  deactivate: () => void,
  playPauseKeyActive: boolean,
  station: stationStateType
};

export default class Player extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.injectScript = this.injectScript.bind(this);
  }

  componentDidMount() {
    const {
      activate
    } = this.props;

    ipcRenderer.on('mediaplaypause', () => {
      activate();
    });
  }

  shouldComponentUpdate() {
    return true;
  }

  componentDidUpdate() {
    if (this.props.playPauseKeyActive) {
      this.injectScript();
      this.props.deactivate();
    }
  }

  injectScript() {
    const { script } = this.props.station;

    if (this.webview.executeJavaScript) {
      this.webview.executeJavaScript(script);
    }
  }

  render() {
    const { url } = this.props.station;
    return (
      <webview
        data-tid="player"
        src={url}
        disablewebsecurity="true"
        className={styles.container}
        ref={(webview) => { this.webview = webview; }}
      />
    );
  }
}
