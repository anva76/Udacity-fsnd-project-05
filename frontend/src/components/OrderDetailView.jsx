import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import "../stylesheets/OrderDetailView.css"
import ItemsTable from "./ItemsTable"
import { fetchOneOrder, deleteOrder, patchOrder } from "../utils/queryUtils"
import { useAuth0 } from "@auth0/auth0-react"
import EditModal from "./EditModal"
import { useGlobalState } from "../utils/state"

const OrderDetailView = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()
  const [editModalVisible, setEditModalVisibility] = useState(false)
  const [permissions] = useGlobalState("permissions")

  const editMap = {
    status: {
      control: "select",
      label: "Status",
      choices: ["submitted",
        "accepted",
        "in_assembly",
        "in_delivery",
        "delivered",
        "cancelled"]
    },
  }

  async function getOrder() {
    const token = await getAccessTokenSilently()
    fetchOneOrder(token, id, (data) => setOrder(data))
  }

  async function handleOrderEditSubmit(editObject) {
    const token = await getAccessTokenSilently()
    const obj = { status: editObject.status }
    console.log(obj)
    patchOrder(token, order.id, obj, () => {
      setEditModalVisibility(false)
      getOrder()
    })
  }

  async function handleOrderDelete() {
    const token = await getAccessTokenSilently()
    if (window.confirm("Delete this order?"))
      deleteOrder(token, order.id, () => {
        navigate(-1)
      })
  }

  useEffect(() => {
    getOrder()
  }, [])

  return (
    order && (
      <>
        {editModalVisible && (
          <EditModal
            obj={order}
            editMap={editMap}
            onClose={() => setEditModalVisibility(false)}
            onSubmit={handleOrderEditSubmit}
            title="Edit Order"
          />
        )}
        <div className="container">
          <div className="d-flex d-row">
            <h4 className="mb-3 text-primary">{"Order " + order.order_number}</h4>
            {permissions.includes("role:admin") && (
              <button
                className="btn btn-light btn-sm ms-2 mb-3"
                title="Edit Product"
                onClick={() => setEditModalVisibility(true)}
              >
                <img src="/edit.svg" width="25" alt="cart" />
              </button>
            )}
            {permissions.includes("delete:products") && (
              <button
                className="btn btn-light btn-sm mb-3"
                title="Delete Order"
                onClick={handleOrderDelete}
              >
                <img src="/trash-can.svg" width="25" alt="cart" />
              </button>
            )}
          </div>
          <div className="mb-3 row">
            <div className="col-md-4">
              <label className="form-label text-secondary">Order status</label>
              <p className="bg-light p-2 border rounded-2 display-field">
                {order.status}
              </p>
            </div>
            <div className="col-md-4">
              <label className="form-label text-secondary">Updated</label>
              <p className="bg-light p-2 border rounded-2 display-field">
                {order.updated_at}
              </p>
            </div>
            <div className="col-md-4">
              <label className="form-label text-secondary">Created</label>
              <p className="bg-light p-2 border rounded-2 display-field">
                {order.created_at}
              </p>
            </div>
          </div>

          <h5 className="mb-3">Order items:</h5>
          <ItemsTable obj={order} />

          <h5 className="mb-3">Delivery address:</h5>
          <div className="col-md-6">
            <div className="mb-3 row">
              <div className="col-md-6">
                <label className="form-label text-secondary">First name</label>
                <p className="bg-light p-2 border rounded-2 display-field">
                  {order.first_name}
                </p>
              </div>
              <div className="col-md-6">
                <label className="form-label text-secondary">Last name</label>
                <p className="bg-light p-2 border rounded-2 display-field">
                  {order.last_name}
                </p>
              </div>
            </div>
            <div className="mb-3 row">
              <div className="col-md-6">
                <label className="form-label text-secondary">Email</label>
                <p className="bg-light p-2 border rounded-2 display-field">
                  {order.email}
                </p>
              </div>
              <div className="col-md-6">
                <label className="form-label text-secondary">Phone</label>
                <p className="bg-light p-2 border rounded-2 display-field">
                  {order.phone}
                </p>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label text-secondary">
                Street address
              </label>
              <p className="bg-light p-2 border rounded-2 display-field">
                {order.street_address_1}
              </p>
            </div>
            <div className="mb-3">
              <label className="form-label text-secondary">
                Street address 2 (optional)
              </label>
              <p className="bg-light p-2 border rounded-2 display-field">
                {order.street_address_2}
              </p>
            </div>
            <div className="mb-3 row">
              <div className="col-md-6">
                <label className="form-label text-secondary">City</label>
                <p className="bg-light p-2 border rounded-2 display-field">
                  {order.city}
                </p>
              </div>
              <div className="col-md-6">
                <label className="form-label text-secondary">Province</label>
                <p className="bg-light p-2 border rounded-2 display-field">
                  {order.province}
                </p>
              </div>
            </div>
            <div className="mb-3 row">
              <div className="col-md-6">
                <label className="form-label text-secondary">Postal code</label>
                <p className="bg-light p-2 border rounded-2 display-field">
                  {order.postal_code}
                </p>
              </div>
              <div className="col-md-6">
                <label className="form-label text-secondary">Country</label>
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
