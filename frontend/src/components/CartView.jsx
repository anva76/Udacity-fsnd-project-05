import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import config from "../config"
import ItemsTable from "./ItemsTable"

const CartView = () => {
  const navigate = useNavigate()

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
          <ItemsTable
            entity={cart}
            withButtons={true}
            onItemIncrease={incCartItem}
            onItemDecrease={decCartItem}
            onItemDelete={deleteCartItem}
          />
          <div className="d-flex flex-row align-items-start justify-content-end">
            <button
              type="submit"
              className="btn btn-info btn-lg "
              onClick={() => navigate("/checkout")}
            >
              Checkout
            </button>
          </div>
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

export default CartView
