import useUserMedia from './useUserMedia'
import useUserShareScreen from './useUserShareScreen'
import useRemoteStreams from './useRemoteStream'
import { useEffect, useState } from 'react'

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
    try {
      if (call.peerConnection && call.peerConnection.getSenders()) {
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
    } catch (error) {
      console.log(error)
    }
  }

  const toggleMuteAudio = () => {
    if (mediaStream) {
      mediaStream.getAudioTracks()[0].enabled = !mediaStream.getAudioTracks()[0]
        .enabled
    }
  }

  const toggleMuteVideo = () => {
    if (mediaStream) {
      mediaStream.getVideoTracks()[0].enabled = !mediaStream.getVideoTracks()[0]
        .enabled
    }

    if (screenStream) {
      screenStream.getVideoTracks()[0].enabled = !screenStream.getVideoTracks()[0]
        .enabled
    }
  }

  return {
    localStream: mediaStream || screenStream,
    remoteStreams,
    startMediaStream,
    stopMediaStream,
    shareScreenStream,
    stopShareScreenStream,
    toggleMuteAudio,
    toggleMuteVideo,
    callPeer
  }
}
