import React from "react"

const PageLoader = () => {
  return (
    <div
      className="spinner-grow text-info load-spinner position-fixed"
      role="status"
    >
      <span className="visually-hidden">Loading...</span>
    </div>
  )
}

export default PageLoader
