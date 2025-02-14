import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import ItemsTable from "./ItemsTable"
import { fetchCart, patchCartItem, deleteCartItem } from "../utils/queryUtils"
import { useAuth0 } from "@auth0/auth0-react"
import { useGlobalState } from "../utils/state"
import PageLoader from "./PageLoader"

const CartView = () => {
  const navigate = useNavigate()
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()
  const [cart, setCart] = useState(null)
  const [permissions] = useGlobalState("permissions")
  const [dataLoading, setDataLoading] = useState(false)

  async function getCart() {
    const token = await getAccessTokenSilently()
    fetchCart(token, (data) => setCart(data))
  }

  async function incCartItem(cartItemId, quantity) {
    setDataLoading(true)
    const token = await getAccessTokenSilently()
    quantity += 1
    patchCartItem(token, cartItemId, quantity, () => {
      getCart()
      setDataLoading(false)
    })
  }

  async function decCartItem(cartItemId, quantity) {
    setDataLoading(true)
    const token = await getAccessTokenSilently()
    quantity -= 1
    if (quantity > 0)
      patchCartItem(token, cartItemId, quantity, () => {
        getCart()
        setDataLoading(false)
      })
    else
      deleteCartItem(token, cartItemId, () => {
        getCart()
        setDataLoading(false)
      })
  }

  async function handleDelCartItem(id) {
    setDataLoading(true)
    const token = await getAccessTokenSilently()
    deleteCartItem(token, id, () => {
      getCart()
      setDataLoading(false)
    })
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
            Cart is only available to end users
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
        <div className="container-lg">
          <div className="row justify-content-center">
            <h4 className="text-secondary text-center mt-5">
              No items in the cart
            </h4>
          </div>
        </div>
      </>
    )

  return (
    <>
      <div className="container-xxl">
        <button
          className="btn btn-outline-secondary btn mb-3"
          onClick={() => navigate("/catalog")}
        >
          Back to catalog
        </button>

        <div className="d-flex flex-row justify-content-center mb-4">
          <h4 className="text-secondary me-2 text-center">Cart</h4>
          {dataLoading && (
            <div
              className="spinner-grow text-danger"
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          )}
        </div>

        <ItemsTable
          obj={cart}
          withButtons={true}
          onItemIncrease={incCartItem}
          onItemDecrease={decCartItem}
          onItemDelete={handleDelCartItem}
        />
        <div className="d-flex flex-row align-items-center justify-content-end mb-3">
          <button
            type="submit"
            className="btn btn-warning btn-lg "
            onClick={() => navigate("/checkout")}
          >
            Checkout
          </button>
        </div>
      </div>
    </>
  )
}

export default CartView
