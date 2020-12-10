# webrtc-hook

> Made with create-react-library

[![NPM](https://img.shields.io/npm/v/webrtc-hook.svg)](https://www.npmjs.com/package/webrtc-hook) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save webrtc-hook
```

## Usage

```jsx
import React, { useState } from 'react'
import LocalStream from './components/LocalStream'
import RemoteStream from './components/RemoteStream'

import { usePeer, useWebRTC } from 'webrtc-hook'

function App() {
  const {
    peer,
    peerId,
    remoteStreamsListener,
    answerToggleMuteVideo,
    answerToggleMuteAudio
  } = usePeer()

  const {
    localStream,
    remoteStreams,
    startMediaStream,
    stopMediaStream,
    shareScreenStream,
    stopShareScreenStream,
    toggleMuteAudio,
    toggleMuteVideo,
    callPeer
  } = useWebRTC()

  const [remotePeerId, setRemotePeerId] = useState('')

  return (
    <div className='App'>
      <div>{'Peer ID: ' + peerId}</div>
      <>
        <LocalStream userMedia={localStream} />
        <RemoteStream
          remoteStreams={[...remoteStreams, ...remoteStreamsListener]}
        />
      </>
      <input
        value={remotePeerId}
        onChange={(event) => setRemotePeerId(event.target.value)}
      />
      <button
        variant='contained'
        color='primary'
        onClick={() => callPeer(peer, remotePeerId)}
      >
        CALL
      </button>
      <button
        variant='contained'
        color='primary'
        onClick={() => {
          shareScreenStream(() => {
            stopMediaStream()
          })
        }}
      >
        share screen
      </button>
      <button
        variant='contained'
        color='primary'
        onClick={() => {
          startMediaStream(() => {
            stopShareScreenStream()
          })
        }}
      >
        video
      </button>
      <button
        variant='contained'
        color='primary'
        onClick={() => {
          toggleMuteAudio()
          answerToggleMuteAudio()
        }}
      >
        Mute audio
      </button>
    </div>
  )
}

export default App
```

## License

MIT © [CucCuc](https://github.com/CucCuc)
