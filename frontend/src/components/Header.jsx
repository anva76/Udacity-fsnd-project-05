import React, { useEffect, useState } from "react"
import { useNavigate, NavLink, createSearchParams } from "react-router-dom"
import UserLoginButton from "./UserLoginButton"
import { useAuth0 } from "@auth0/auth0-react"
import { updatePermissionsFromToken, useGlobalState } from "../utils/state"

const Header = () => {
  const navigate = useNavigate()
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()
  const [permissions] = useGlobalState("permissions")
  const [searchQuery, setSearchQuery] = useState("")

  // Get permissions from a token and store it
  // in the global state available to other components
  async function updatePermissionsFromAuth0() {
    try {
      const token = await getAccessTokenSilently()
      //console.log(token)
      updatePermissionsFromToken(token)
    } catch (e) {
      console.log(e.message)
    }
  }

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (!searchQuery || String(searchQuery).trim() == 0) return

    const query = String(searchQuery).trim()
    const params = createSearchParams({ query })
    navigate({ pathname: "/search", search: `?${params}` })
  }

  useEffect(() => {
    updatePermissionsFromAuth0()
  }, [])

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-3">
        <div className="container-fluid">
          <a
            className="navbar-brand text-info"
            href="#"
            onClick={() => navigate("/home")}
          >
            E-Commerce Kiosk
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav me-auto mb-1 mb-lg-0">
              <li className="nav-item">
                <NavLink to="/catalog" className="nav-link">
                  Categories
                </NavLink>
              </li>
              {permissions.includes("role:consumer") && <li className="nav-item">
                <NavLink
                  to="/orders"
                  className="nav-link"
                >
                  My Orders
                </NavLink>
              </li>}
              {permissions.includes("role:admin") && <li className="nav-item">
                <NavLink
                  to="/orders"
                  className="nav-link text-danger"
                >
                  Admin Dashboard
                </NavLink>
              </li>}
            </ul>
            <form
              className="d-flex me-auto mb-2 mb-lg-0"
              onSubmit={handleSearchSubmit}
            >
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search Products"
                onChange={handleSearchInputChange}
                value={searchQuery}
              />
              <button className="btn btn-info btn-sm" type="submit">
                <img src="/search.svg" width="25" alt="cart" />
              </button>
            </form>
            <div className="btn-group">
              {!permissions.includes("role:admin") &&
                < button
                  className={
                    "btn btn-info btn-sm rounded mb-1 mb-lg-0 me-2 " +
                    (permissions.includes("role:consumer") ? "" : "disabled")
                  }
                  title="Shopping cart"
                  onClick={() => {
                    navigate("/cart")
                  }}
                >
                  <img src="/cart.svg" width="25" alt="cart" />
                </button>
              }
              <UserLoginButton />
            </div>
          </div>
        </div>
      </nav >
    </>
  )
}

export default Header
