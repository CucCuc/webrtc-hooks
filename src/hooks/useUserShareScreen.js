import { useState } from 'react'

export default function useUserShareScreen() {
  const [screenStream, setScreenStream] = useState(null)

  const shareScreenStream = async (callback = () => {}) => {
    if (!screenStream) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          audio: true,
          video: true
        })
        setScreenStream(screenStream)
        callback()
      } catch (error) {
        console.log(error)
      }
    }
  }

  const stopShareScreenStream = () => {
    if (screenStream) {
      screenStream.getVideoTracks()[0].stop()
      setScreenStream(null)
    }
  }

  return [screenStream, shareScreenStream, stopShareScreenStream]
}
