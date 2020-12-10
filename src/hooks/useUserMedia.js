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
      mediaStream.getVideoTracks()[0].stop()
      setMediaStream(null)
    }
  }

  const startMediaStream = async (callback = () => {}) => {
    if (!mediaStream) {
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
  }

  return [mediaStream, startMediaStream, stopMediaStream]
}
