import React, { useEffect, useState } from "react"
import config from "../config"
import { useParams } from "react-router-dom"
import "../stylesheets/OrderDetailView.css"
import ItemsTable from "./ItemsTable"

const OrderDetailView = () => {
  const { id } = useParams()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    fetch(config.apiUrl + `/orders/${id}/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${config.testToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.order)
        setOrder(data.order)
      })
      .catch((err) => console.log(err))
  }, [])

  return (
    order && (
      <>
        <div className="container">
          <h4 className="mb-3 text-primary">{"Order " + order.order_number}</h4>
          <div className="mb-3 row">
            <div className="col-md-4">
              <label className="form-label">Order status</label>
              <p className="bg-light p-2 border rounded-2 display-field">
                {order.status}
              </p>
            </div>
            <div className="col-md-4">
              <label className="form-label">Updated</label>
              <p className="bg-light p-2 border rounded-2 display-field">
                {order.updated_at}
              </p>
            </div>
            <div className="col-md-4">
              <label className="form-label">Created</label>
              <p className="bg-light p-2 border rounded-2 display-field">
                {order.created_at}
              </p>
            </div>
          </div>

          <h5 className="mb-3">Order items:</h5>
          <ItemsTable entity={order} />

          <h5 className="mb-3">Delivery address:</h5>
          <div className="col-md-6">
            <div className="mb-3 row">
              <div className="col-md-6">
                <label className="form-label">First name</label>
                <p className="bg-light p-2 border rounded-2 display-field">
                  {order.first_name}
                </p>
              </div>
              <div className="col-md-6">
                <label className="form-label">Last name</label>
                <p className="bg-light p-2 border rounded-2 display-field">
                  {order.last_name}
                </p>
              </div>
            </div>
            <div className="mb-3 row">
              <div className="col-md-6">
                <label className="form-label">Email</label>
                <p className="bg-light p-2 border rounded-2 display-field">
                  {order.email}
                </p>
              </div>
              <div className="col-md-6">
                <label className="form-label">Phone</label>
                <p className="bg-light p-2 border rounded-2 display-field">
                  {order.phone}
                </p>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Street address</label>
              <p className="bg-light p-2 border rounded-2 display-field">
                {order.street_address_1}
              </p>
            </div>
            <div className="mb-3">
              <label className="form-label">Street address 2 (optional)</label>
              <p className="bg-light p-2 border rounded-2 display-field">
                {order.street_address_2}
              </p>
            </div>
            <div className="mb-3 row">
              <div className="col-md-6">
                <label className="form-label">City</label>
                <p className="bg-light p-2 border rounded-2 display-field">
                  {order.city}
                </p>
              </div>
              <div className="col-md-6">
                <label className="form-label">Province</label>
                <p className="bg-light p-2 border rounded-2 display-field">
                  {order.province}
                </p>
              </div>
            </div>
            <div className="mb-3 row">
              <div className="col-md-6">
                <label className="form-label">Postal code</label>
                <p className="bg-light p-2 border rounded-2 display-field">
                  {order.postalCode}
                </p>
              </div>
              <div className="col-md-6">
                <label className="form-label">Country</label>
                <p className="bg-light p-2 border rounded-2 display-field">
                  {order.country}
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  )
}

export default OrderDetailView
