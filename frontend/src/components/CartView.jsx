import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import config from "../config"
import ItemsTable from "./ItemsTable"
import { fetchCart, patchCartItem, deleteCartItem } from "../utils/QueryUtils"

const CartView = () => {
  const navigate = useNavigate()

  const [cart, setCart] = useState(null)

  useEffect(() => {
    fetchCart((data) => setCart(data))
  }, [])

  const incCartItem = (cartItemId, quantity) => {
    quantity += 1
    patchCartItem(cartItemId, quantity, () => {
      fetchCart((data) => setCart(data))
    })
  }

  const decCartItem = (cartItemId, quantity) => {
    quantity -= 1
    if (quantity > 0)
      patchCartItem(cartItemId, quantity, () => {
        fetchCart((data) => setCart(data))
      })
    else
      deleteCartItem(cartItemId, () => {
        fetchCart((data) => setCart(data))
      })
  }

  const handleDelCartItem = (id) => {
    deleteCartItem(id, () => {
      fetchCart((data) => setCart(data))
    })
  }

  if (cart && Object.keys(cart).length !== 0)
    return (
      <>
        <div className="container">
          <h4 className="mb-3 text-primary">Cart</h4>
          <ItemsTable
            obj={cart}
            withButtons={true}
            onItemIncrease={incCartItem}
            onItemDecrease={decCartItem}
            onItemDelete={handleDelCartItem}
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

  if (cart && Object.keys(cart).length === 0)
    return (
      <>
        <div className="container">
          <h4 className="text-primary">No items in the cart</h4>
        </div>
      </>
    )
}

export default CartView
