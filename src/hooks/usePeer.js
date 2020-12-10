import { useState, useEffect } from 'react'
import Peer from 'peerjs'
import useRemoteStreams from './useRemoteStream'

function getRandomId() {
  let min = Math.ceil(10000000)
  let max = Math.floor(99999999)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

let streamAnswer = null

export default function usePeer() {
  const [myPeer, setPeer] = useState(null)
  const [myPeerID, setMyPeerID] = useState(null)

  const [
    remoteStreamsListener,
    addRemoteStream,
    removeRemoteStream
  ] = useRemoteStreams()

  const cleanUp = () => {
    if (myPeer) {
      myPeer.disconnect()
      myPeer.destroy()
    }
    setPeer(null)
    setMyPeerID(null)
  }

  const toggleMuteVideo = () => {
    if (streamAnswer) {
      streamAnswer.getVideoTracks()[0].enabled = !streamAnswer.getVideoTracks()[0]
        .enabled
    }
  }

  const toggleMuteAudio = () => {
    if (streamAnswer) {
      streamAnswer.getAudioTracks()[0].enabled = !streamAnswer.getAudioTracks()[0]
        .enabled
    }
  }

  useEffect(() => {
    const peer = new Peer(getRandomId())

    peer.on('open', () => {
      setPeer(peer)
      setMyPeerID(peer.id)
    })

    peer.on('call', (call) => {
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: true })
        .then((stream) => {
          // Answer the call with an A/V stream.
          call.answer(stream)
          streamAnswer = stream

          // Play the remote stream
          call.on('stream', (remoteStream) => {
            addRemoteStream(remoteStream, call.peer)
          })

          call.on('close', () => {
            removeRemoteStream(call.peer)
          })

          call.on('error', (error) => {
            removeRemoteStream(call.peer)
          })
        })
        .catch((error) => {})
    })

    peer.on('disconnected', () => {
      cleanUp()
    })

    peer.on('close', () => {
      cleanUp()
    })

    peer.on('error', (error) => {
      cleanUp()
    })

    return () => {
      cleanUp()
    }
  }, [])

  return {
    peer: myPeer,
    peerId: myPeerID,
    remoteStreamsListener,
    answerToggleMuteVideo: toggleMuteVideo,
    answerToggleMuteAudio: toggleMuteAudio
  }
}
