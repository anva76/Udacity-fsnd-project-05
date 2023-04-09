import React from "react"
import { BrowserRouter as Router } from "react-router-dom"
import ReactDOM from "react-dom/client"
import App from "./App"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
)
