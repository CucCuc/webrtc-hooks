import React, { useEffect, useRef } from 'react'

export default function RemoteStream({ remoteStreams }) {
  const refsArray = useRef([])

  useEffect(() => {
    remoteStreams.map(
      (streamData) =>
        (refsArray.current[streamData.peerId].srcObject = streamData.stream)
    )
  }, [remoteStreams])

  return (
    <div>
      {remoteStreams.map((dataStream, i, arr) => (
        <div key={dataStream.peerId}>
          <video
            style={{ width: 400, height: 400 }}
            onContextMenu={(event) => event.preventDefault()}
            ref={(ref) => (refsArray.current[dataStream.peerId] = ref)}
            autoPlay
            playsInline
          />
        </div>
      ))}
    </div>
  )
}
