import useUserMedia from './useUserMedia'
import useUserShareScreen from './useUserShareScreen'
import useRemoteStreams from './useRemoteStream'
import { useEffect } from 'react'

let call = null

export function useWebRTC() {
  const [mediaStream, startMediaStream, stopMediaStream] = useUserMedia()

  const [
    screenStream,
    shareScreenStream,
    stopShareScreenStream
  ] = useUserShareScreen()

  const [
    remoteStreams,
    addRemoteStream,
    removeRemoteStream
  ] = useRemoteStreams()

  useEffect(() => {
    if (screenStream && call) {
      replaceStream(screenStream)
    }
  }, [screenStream])

  useEffect(() => {
    if (mediaStream && call) {
      replaceStream(mediaStream)
    }
  }, [mediaStream])

  const callPeer = (peer, remoteid) => {
    call = peer.call(remoteid, mediaStream)

    call.on('stream', (remoteStream) => {
      addRemoteStream(remoteStream, call.peer)
    })

    call.on('close', () => {
      removeRemoteStream(call.peer)
      call.close()
    })

    call.on('error', (error) => {
      removeRemoteStream(call.peer)
      call.close()
    })
  }

  const replaceStream = (stream) => {
    if (call.peerConnection.getSenders()) {
      for (const sender of call.peerConnection.getSenders()) {
        // if (sender.track.kind == 'audio') {
        //   if (stream.getAudioTracks().length > 0) {
        //     sender.replaceTrack(stream.getAudioTracks()[0])
        //   }
        // }
        if (sender.track.kind == 'video') {
          if (stream.getVideoTracks().length > 0) {
            sender.replaceTrack(stream.getVideoTracks()[0])
          }
        }
      }
    }
  }

  return {
    mediaStream,
    screenStream,
    remoteStreams,
    startMediaStream,
    stopMediaStream,
    shareScreenStream,
    stopShareScreenStream,
    callPeer
  }
}
