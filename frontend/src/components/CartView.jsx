import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import ItemsTable from "./ItemsTable"
import { fetchCart, patchCartItem, deleteCartItem } from "../utils/queryUtils"
import { useAuth0 } from "@auth0/auth0-react"

const CartView = () => {
  const navigate = useNavigate()
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()
  const [cart, setCart] = useState(null)

  async function getCart() {
    const token = await getAccessTokenSilently()
    fetchCart(token, (data) => setCart(data))
  }

  async function incCartItem(cartItemId, quantity) {
    const token = await getAccessTokenSilently()
    quantity += 1
    patchCartItem(token, cartItemId, quantity, () => {
      getCart()
    })
  }

  async function decCartItem(cartItemId, quantity) {
    const token = await getAccessTokenSilently()
    quantity -= 1
    if (quantity > 0)
      patchCartItem(token, cartItemId, quantity, () => {
        getCart()
      })
    else
      deleteCartItem(token, cartItemId, () => {
        getCart()
      })
  }

  async function handleDelCartItem(id) {
    const token = await getAccessTokenSilently()
    deleteCartItem(token, id, () => {
      getCart()
    })
  }

  useEffect(() => {
    getCart()
  }, [])

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
