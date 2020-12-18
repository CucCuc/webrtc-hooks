import { useState, useEffect } from 'react'

export default function useUserMedia() {
  const [mediaStream, setMediaStream] = useState(null)

  useEffect(() => {
    if (!mediaStream) {
      startMediaStream()
    } else {
      return () => {
        mediaStream.getTracks().forEach((track) => {
          track.stop()
        })
      }
    }
  }, [])

  const stopMediaStream = () => {
    if (mediaStream) {
      try {
        mediaStream.getVideoTracks()[0].enabled = false
        mediaStream.getAudioTracks()[0].enabled = false
        setMediaStream(null)
      } catch (error) {
        console.log(error)
      }
    }
  }

  const startMediaStream = async (callback = () => {}) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
      })
      setMediaStream(stream)
      callback()
    } catch (error) {
      console.log(error)
    }
  }

  return [mediaStream, startMediaStream, stopMediaStream]
}
