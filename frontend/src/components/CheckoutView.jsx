import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import config from "../config"
import ItemsTable from "./ItemsTable"

const CheckoutView = () => {
  const navigate = useNavigate()
  const [cart, setCart] = useState({})
  const [orderAddress, setOrderAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    streetAddress1: "",
    streetAddress2: "",
    city: "",
    province: "",
    postalCode: "",
    country: "",
  })

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = () => {
    fetch(config.apiUrl + "/cart/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${config.testToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.cart)
        setCart(data.cart)
      })
      .catch((err) => console.log(err))
  }

  const submitOrder = () => {
    fetch(config.apiUrl + "/orders/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.testToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: orderAddress.firstName,
        last_name: orderAddress.lastName,
        email: orderAddress.email,
        phone: orderAddress.phone,
        street_address_1: orderAddress.streetAddress1,
        street_address_2: orderAddress.streetAddress2,
        province: orderAddress.province,
        city: orderAddress.city,
        postal_code: orderAddress.postalCode,
        country: orderAddress.country,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        if (!data["success"]) {
          alert(
            "Unable to submit the order. Please check the form fields and try again."
          )
        } else navigate("/orders")
      })
      .catch((err) => {
        console.log(err)
        alert("Unable to submit the order. Please try again later.")
      })
  }

  const handleChange = (e) => {
    setOrderAddress({ ...orderAddress, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(orderAddress)
    submitOrder()
  }

  if (cart && Object.keys(cart).length !== 0) {
    return (
      <>
        <div className="container">
          <h4 className="mb-3 text-primary">Checkout</h4>
          <h5 className="mb-3">1) Please verify your order:</h5>

          <ItemsTable entity={cart} />

          <h5 className="mb-3">2) Please provide your delivery address:</h5>
          <form className="row" onSubmit={handleSubmit}>
            <div className="col-md-6">
              <div className="mb-3 row">
                <div className="col-md-6">
                  <label className="form-label">First name</label>
                  <input
                    type="text"
                    className="form-control"
                    onChange={handleChange}
                    name="firstName"
                    value={orderAddress.firstName}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Last name</label>
                  <input
                    type="text"
                    className="form-control"
                    onChange={handleChange}
                    name="lastName"
                    value={orderAddress.lastName}
                  />
                </div>
              </div>
              <div className="mb-3 row">
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    onChange={handleChange}
                    name="email"
                    value={orderAddress.email}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Phone</label>
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
                <label className="form-label">Street address</label>
                <input
                  type="text"
                  className="form-control"
                  onChange={handleChange}
                  name="streetAddress1"
                  value={orderAddress.streetAddress1}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">
                  Street address 2 (optional)
                </label>
                <input
                  type="text"
                  className="form-control"
                  onChange={handleChange}
                  name="streetAddress2"
                  value={orderAddress.streetAddress2}
                />
              </div>
              <div className="mb-3 row">
                <div className="col-md-6">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    className="form-control"
                    onChange={handleChange}
                    name="city"
                    value={orderAddress.city}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Province</label>
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
                  <label className="form-label">Postal code</label>
                  <input
                    type="text"
                    className="form-control"
                    onChange={handleChange}
                    name="postalCode"
                    value={orderAddress.postalCode}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Country</label>
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
