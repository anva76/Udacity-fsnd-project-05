import React from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { updatePermissionsFromToken, useGlobalState } from "../utils/state"

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
        {isLoading && (
          <div className="spinner-grow spinner-grow-sm text-info" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        )}
        Sign in
      </button>
    )

  return (
    <div className="navbar-item dropdown">
      <a
        className={
          "nav-link dropdown-toggle rounded p-1 bg-light " +
          (permissions.includes("role:admin") && "text-danger")
        }
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
            alt="user"
            className="rounded me-2"
          />
        )}
        {isLoading && (
          <div className="spinner-grow spinner-grow-sm text-info" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        )}
        {user?.name}
      </a>
      <ul className="dropdown-menu dropdown-menu-end shadow">
        <li>
          <a
            className="dropdown-item"
            href="#"
            role="button"
            onClick={() => logout()}
          >
            Logout
          </a>
        </li>
        <li>
          <hr className="dropdown-divider" />
        </li>
        <li></li>
      </ul>
    </div>
  )
}

export default UserLoginButton
