import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import config from "../config"
import ItemsTable from "./ItemsTable"
import { emitMessage } from "./FlashMessage"
import { submitOrder, fetchCart } from "../utils/QueryUtils"

const CheckoutView = () => {
  const navigate = useNavigate()
  const [cart, setCart] = useState({})
  const [orderAddress, setOrderAddress] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    street_address_1: "",
    street_address_2: "",
    city: "",
    province: "",
    postal_code: "",
    country: "",
  })

  useEffect(() => {
    fetchCart((data) => setCart(data))
  }, [])

  const handleChange = (e) => {
    setOrderAddress({ ...orderAddress, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(orderAddress)
    submitOrder(orderAddress, () => navigate("/orders"))
  }

  if (cart && Object.keys(cart).length !== 0) {
    return (
      <>
        <div className="container">
          <h4 className="mb-3 text-primary">Checkout</h4>
          <h5 className="mb-3">1) Please verify your order:</h5>

          <ItemsTable obj={cart} />

          <h5 className="mb-3">2) Please provide your delivery address:</h5>
          <form className="row" onSubmit={handleSubmit}>
            <div className="col-md-6">
              <div className="mb-3 row">
                <div className="col-md-6">
                  <label className="form-label text-secondary">
                    First name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    onChange={handleChange}
                    name="first_name"
                    value={orderAddress.first_name}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-secondary">Last name</label>
                  <input
                    type="text"
                    className="form-control"
                    onChange={handleChange}
                    name="last_name"
                    value={orderAddress.last_name}
                  />
                </div>
              </div>
              <div className="mb-3 row">
                <div className="col-md-6">
                  <label className="form-label text-secondary">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    onChange={handleChange}
                    name="email"
                    value={orderAddress.email}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-secondary">Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    onChange={handleChange}
                    name="phone"
                    value={orderAddress.phone}
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label text-secondary">
                  Street address
                </label>
                <input
                  type="text"
                  className="form-control"
                  onChange={handleChange}
                  name="street_address_1"
                  value={orderAddress.street_address_1}
                />
              </div>
              <div className="mb-3">
                <label className="form-label text-secondary">
                  Street address 2 (optional)
                </label>
                <input
                  type="text"
                  className="form-control"
                  onChange={handleChange}
                  name="street_address_2"
                  value={orderAddress.street_address_2}
                />
              </div>
              <div className="mb-3 row">
                <div className="col-md-6">
                  <label className="form-label text-secondary">City</label>
                  <input
                    type="text"
                    className="form-control"
                    onChange={handleChange}
                    name="city"
                    value={orderAddress.city}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-secondary">Province</label>
                  <input
                    type="text"
                    className="form-control"
                    onChange={handleChange}
                    name="province"
                    value={orderAddress.province}
                  />
                </div>
              </div>
              <div className="mb-3 row">
                <div className="col-md-6">
                  <label className="form-label text-secondary">
                    Postal code
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    onChange={handleChange}
                    name="postal_code"
                    value={orderAddress.postal_code}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-secondary">Country</label>
                  <input
                    type="text"
                    className="form-control"
                    onChange={handleChange}
                    name="country"
                    value={orderAddress.country}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6 d-flex flex-row align-items-start justify-content-end">
              <button
                className="btn btn-secondary btn-lg me-2"
                onClick={() => {
                  navigate("/cart")
                }}
              >
                Back to cart
              </button>
              <button type="submit" className="btn btn-info btn-lg ">
                Submit order
              </button>
            </div>
          </form>
        </div>
      </>
    )
  } else {
    return (
      <>
        <div className="container">
          <h4 className="text-primary">No items in the cart</h4>
        </div>
      </>
    )
  }
}

export default CheckoutView
