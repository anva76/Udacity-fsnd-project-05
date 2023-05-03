import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import ItemsTable from "./ItemsTable"
import { submitOrder, fetchCart } from "../utils/queryUtils"
import { useAuth0 } from "@auth0/auth0-react"
import { useGlobalState } from "../utils/state"
import PageLoader from "./PageLoader"

const CheckoutView = () => {
  const navigate = useNavigate()
  const [cart, setCart] = useState(null)
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
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()
  const [permissions] = useGlobalState("permissions")

  async function getCart() {
    const token = await getAccessTokenSilently()
    fetchCart(token, (data) => setCart(data))
  }

  const handleChange = (e) => {
    setOrderAddress({ ...orderAddress, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    const token = await getAccessTokenSilently()
    e.preventDefault()
    console.log(orderAddress)
    submitOrder(token, orderAddress, () => navigate("/orders"))
  }

  useEffect(() => {
    //console.log(permissions)
    if (permissions.includes("view:update:cart")) getCart()
  }, [])

  useEffect(() => {
    //console.log(permissions)
    if (permissions.includes("view:update:cart")) getCart()
  }, [permissions])

  if (permissions.length === 0)
    return (
      <>
        <PageLoader />
      </>
    )

  if (!permissions.includes("view:update:cart"))
    return (
      <>
        <div className="container">
          <h4 className="text-secondary">
            Checkout is only available to end users
          </h4>
        </div>
      </>
    )

  if (!cart)
    return (
      <>
        <PageLoader />
      </>
    )

  if (cart && Object.keys(cart).length === 0)
    return (
      <>
        <div className="container">
          <h4 className="text-secondary">No items in the cart</h4>
        </div>
      </>
    )

  return (
    <>
      <div className="container">
        <h4 className="mb-3 text-secondary">Checkout</h4>
        <h5 className="mb-3">1) Please verify your order:</h5>

        <ItemsTable obj={cart} />

        <h5 className="mb-3">2) Please provide your delivery address:</h5>
        <form className="row" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <div className="mb-3 row">
              <div className="col-md-6">
                <label className="form-label text-secondary">First name</label>
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
                  placeholder="email@example.com"
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
                  placeholder="+99.999.999.9999"
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
                <label className="form-label text-secondary">Postal code</label>
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
              className="btn btn-outline-secondary btn-lg me-2"
              onClick={() => {
                navigate("/cart")
              }}
            >
              Back to cart
            </button>
            <button type="submit" className="btn btn-warning btn-lg ">
              Submit order
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default CheckoutView
