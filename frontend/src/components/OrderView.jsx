import React, { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import config from "../config"
import Alert from "./Alert"

const OrderView = () => {
  const { state } = useLocation()
  const [orders, setOrders] = useState([])
  const [alertMessage, setAlertMessage] = useState(state ? state.message : null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = () => {
    fetch(config.apiUrl + "/orders/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${config.testToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.orders)
        setOrders(data.orders)
      })
      .catch((err) => console.log(err))
  }

  return (
    orders.length !== 0 && (
      <>
        <div className="container">
          {alertMessage && (
            <Alert
              onClose={() => {
                setAlertMessage(null)
              }}
              message={alertMessage}
            />
          )}
          <h4 className="mb-3 text-primary">My Orders</h4>
          <table className="table mb-3">
            <thead className="table-primary">
              <tr>
                <th>#</th>
                <th>Order Number</th>
                <th>Recipient Name</th>
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
                  <td className="text-center">${item.total_amount}</td>
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
