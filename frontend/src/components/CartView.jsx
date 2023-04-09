import React, { useEffect, useState } from "react"
import config from "../config"
import "../stylesheets/CartView.css"

const CartView = () => {
  const [cart, setCart] = useState({})

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

  const patchCartItem = (cartItemId, quantity) => {
    fetch(config.apiUrl + `/cart/${cartItemId}/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${config.testToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        fetchCart()
      })
      .catch((err) => console.log(err))
  }

  const incCartItem = (cartItemId, quantity) => {
    quantity += 1
    patchCartItem(cartItemId, quantity)
  }

  const decCartItem = (cartItemId, quantity) => {
    quantity -= 1
    if (quantity > 0) patchCartItem(cartItemId, quantity)
    else deleteCartItem(cartItemId)
  }

  const deleteCartItem = (cartItemId) => {
    fetch(config.apiUrl + `/cart/${cartItemId}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${config.testToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        fetchCart()
      })
      .catch((err) => console.log(err))
  }

  if (cart && Object.keys(cart).length !== 0) {
    return (
      <>
        <div className="container">
          <h4 className="mb-3 text-primary">Cart</h4>
          <table className="table table">
            <thead className="table-primary">
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Price</th>
                <th className="text-center">Quantity</th>
                <th colSpan="2">Sub total</th>
              </tr>
            </thead>
            <tbody>
              {cart.cart_items &&
                cart.cart_items.map((item, index) => (
                  <tr key={item.id}>
                    <td className="align-middle">{index + 1}</td>
                    <td className="align-middle">
                      <img
                        src={item.product.image_link}
                        className="cart-item-image me-2"
                        alt={item.product.name}
                      />
                      {item.product.name}
                    </td>
                    <td className="align-middle">${item.product.price}</td>
                    <td className="text-center align-middle">
                      <div className="d-flex justify-content-center">
                        <button
                          className="btn btn-info btn-sm me-2"
                          onClick={() => {
                            incCartItem(item.id, item.quantity)
                          }}
                        >
                          <img src="plus-circle.svg" width="25" alt="add one" />
                        </button>
                        {item.quantity}
                        <button
                          className="btn btn-info btn-sm ms-2"
                          onClick={() => {
                            decCartItem(item.id, item.quantity)
                          }}
                        >
                          <img
                            src="dash-circle.svg"
                            width="25"
                            alt="remove one"
                          />
                        </button>
                      </div>
                    </td>
                    <td className="align-middle">${item.sub_total}</td>
                    <td className="align-middle">
                      <button
                        className="btn btn-info btn-sm"
                        onClick={() => {
                          deleteCartItem(item.id)
                        }}
                      >
                        <img src="trash-can.svg" width="25" alt="delete" />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
            <tfoot className="table-primary">
              <tr>
                <th colSpan="3">Total</th>
                <th className="text-center">{cart.items_count}</th>
                <th colSpan="2">${cart.total}</th>
              </tr>
            </tfoot>
          </table>
        </div>
      </>
    )
  } else {
    return (
      <>
        <div className="container">
          <h4 className="text-primary">Cart is empty</h4>
        </div>
      </>
    )
  }
}

export default CartView
