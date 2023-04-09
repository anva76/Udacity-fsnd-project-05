import React from "react"
import "../stylesheets/Alert.css"

const Alert = ({ children, onClose, type = "info", message = null }) => {
  return (
    <>
      <div className={"alert-window alert alert-dismissible alert-" + type}>
        {message && <p>{message}</p>}
        {children}
        <button type="button" className="btn-close" onClick={onClose}></button>
      </div>
    </>
  )
}

export default Alert
