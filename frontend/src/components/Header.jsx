import React from "react"
import { useNavigate, NavLink } from "react-router-dom"

const Header = () => {
  const navigate = useNavigate()
  return (
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
              <NavLink to="" className="nav-link">
                Catalog
              </NavLink>
            </li>
          </ul>
          <form className="d-flex me-auto mb-2 mb-lg-0">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
            />
            <button className="btn btn-info btn-sm" type="submit">
              <img src="/search.svg" width="25" alt="cart" />
            </button>
          </form>
          <button
            className="btn btn-info btn-sm mb-1 mb-lg-0 me-2"
            title="Orders"
            onClick={() => {
              navigate("/orders")
            }}
          >
            <img src="/orders-icon.svg" width="25" alt="cart" />
          </button>
          <button
            className="btn btn-info btn-sm  mb-1 mb-lg-0"
            title="Shopping cart"
            onClick={() => {
              navigate("/cart")
            }}
          >
            <img src="/cart.svg" width="25" alt="cart" />
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Header
