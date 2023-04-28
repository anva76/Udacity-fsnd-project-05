import { React, useEffect, useState } from "react"
import "../stylesheets/FlashMessage.css"
import EventEmitter from "events"

// The basic concept of a flash message component was taken (and developed further) from here:
// https://medium.com/@jaouad_45834/building-a-flash-message-component-with-react-js-6288da386d53

const msgWire = new EventEmitter()

const emitMessage = (message, type = "warning") => {
  msgWire.emit("flash-message", { message, type })
}

const FlashMessage = () => {
  const [visible, setVisibility] = useState(false)
  const [message, setMessage] = useState("")
  const [type, setType] = useState("")
  const [timeoutId, setTimeoutId] = useState(null)

  useEffect(() => {
    msgWire.on("flash-message", ({ message, type }) => {
      setVisibility(true)
      setMessage(message)
      setType(type)

      if (timeoutId) clearTimeout(timeoutId)
      const tmpId = setTimeout(() => {
        setVisibility(false)
        setTimeoutId(null)
      }, 4000)

      setTimeoutId(tmpId)
    })
  }, [])

  return (
    visible && (
      <>
        <div
          className={`border border-${type} shadow-lg position-fixed alert-window alert alert-dismissible alert-${type}`}
        >
          <p>{message}</p>
          <button
            type="button"
            className="btn-close"
            onClick={() => {
              setVisibility(false)
            }}
          ></button>
        </div>
      </>
    )
  )
}

export { FlashMessage, emitMessage }
