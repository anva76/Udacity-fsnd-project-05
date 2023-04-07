import React from 'react'

const Header = () => {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-2">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">E-Commerce</a>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link" href="#">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">By Category</a>
            </li>
          </ul>
          <form className="d-flex" role="search">
            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
            <button className="btn btn-outline-primary" type="submit">Search</button>
          </form>
        </div>
      </nav >
    </>
  )
}

export default Header