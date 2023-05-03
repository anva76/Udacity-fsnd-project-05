import React from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { updatePermissionsFromToken, useGlobalState } from "../utils/state"
import "../stylesheets/UserLoginButton.css"

const UserLoginButton = () => {
  const { user, loginWithRedirect, logout, isAuthenticated, isLoading } =
    useAuth0()
  const [permissions, setPermissions] = useGlobalState("permissions")

  if (!isAuthenticated)
    return (
      <button
        className="btn btn-secondary btn-sm rounded"
        onClick={() =>
          loginWithRedirect({
            appState: {
              returnTo: window.location.pathname,
            },
          })
        }
      >
        <img src="/user.svg" width="25" alt="user" className="me-2" />
        Sign in
      </button>
    )

  return (
    <div className="navbar-item dropdown dropdown-center">
      <a
        className="nav-link dropdown-toggle rounded p-1 user-button"
        href="#"
        id="navbarDropdown"
        role="button"
        data-bs-toggle="dropdown"
        title={user?.name}
      >
        {user?.picture && (
          <img
            src={user.picture}
            width="25"
            alt=""
            className="rounded me-2 profile-image"
          />
        )}
        {user?.name}
        <span className="text-danger fw-bold">
          {permissions.includes("role:admin") ? " [admin]" : ""}
        </span>
      </a>
      <ul className="dropdown-menu dropdown-menu-end shadow">
        <li className="text-center">
          <button
            style={{ width: "90%" }}
            className="btn btn-sm btn-outline-secondary"
            onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
            }
            type="button"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  )
}

export default UserLoginButton
