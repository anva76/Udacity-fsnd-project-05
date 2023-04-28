import React, { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { fetchOrders } from "../utils/queryUtils"
import { useAuth0 } from "@auth0/auth0-react"
import { useGlobalState } from "../utils/state"
import PageLoader from "./PageLoader"

const OrderView = () => {
  const { state } = useLocation()
  const [orders, setOrders] = useState(null)
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()
  const [permissions] = useGlobalState("permissions")

  async function getOrders() {
    const token = await getAccessTokenSilently()
    fetchOrders(token, (data) => setOrders(data))
  }

  useEffect(() => {
    getOrders()
  }, [])

  if (!orders)
    return (
      <>
        <PageLoader />
      </>
    )

  if (orders.length == 0)
    return (
      <>
        <div className="container">
          <h4 className="text-secondary">No orders so far</h4>
        </div>
      </>
    )

  return (
    orders && (
      <>
        <div className="container">
          {permissions.includes("role:admin") ? (
            <h4 className="mb-3 text-secondary">Orders Dashboard</h4>
          ) : (
            <h4 className="mb-3 text-secondary">My Orders</h4>
          )}
          <table className="table mb-3">
            <thead className="table-secondary">
              <tr>
                <th>#</th>
                <th>Order Number</th>
                <th>Addressee Name</th>
                <th>Country</th>
                <th>Status</th>
                <th className="text-center">Items Count</th>
                <th className="text-center">Total Amount</th>
                <th>Updated</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>
                    <Link to={"/orders/" + item.id}>{item.order_number}</Link>
                  </td>
                  <td>{item.recipient_name}</td>
                  <td>{item.country}</td>
                  <td>{item.status}</td>
                  <td className="text-center">{item.items_count}</td>
                  <td className="text-center">
                    ${item.total_amount.toFixed(2)}
                  </td>
                  <td>{item.updated_at}</td>
                  <td>{item.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    )
  )
}

export default OrderView
