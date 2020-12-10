import React, { useState } from 'react'
import LocalStream from './components/LocalStream'
import RemoteStream from './components/RemoteStream'

import { usePeer, useWebRTC } from 'webrtc-hook'

function App() {
  const { peer, peerId, remoteStreamsListener } = usePeer()

  const {
    mediaStream,
    screenStream,
    remoteStreams,
    startMediaStream,
    stopMediaStream,
    shareScreenStream,
    stopShareScreenStream,
    callPeer
  } = useWebRTC()

  const [remotePeerId, setRemotePeerId] = useState('')

  return (
    <div className='App'>
      <div>{'Peer ID: ' + peerId}</div>
      <LocalStream userMedia={screenStream || mediaStream} />
      <RemoteStream
        remoteStreams={[...remoteStreams, ...remoteStreamsListener]}
      />
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
    </div>
  )
}

export default App
