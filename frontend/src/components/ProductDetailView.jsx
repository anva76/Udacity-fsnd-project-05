import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import "../stylesheets/ProductDetailView.css"
import { emitMessage } from "./FlashMessage"
import EditModal from "./EditModal"
import { useAuth0 } from "@auth0/auth0-react"
import {
  fetchOneProduct,
  addProductToCart,
  deleteProduct,
  patchProduct,
} from "../utils/queryUtils"
import { useGlobalState } from "../utils/state"

const ProductDetailView = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [editModalVisible, setEditModalVisibility] = useState(false)
  const [permissions] = useGlobalState("permissions")

  const { getAccessTokenSilently, isAuthenticated, loginWithRedirect } = useAuth0()

  const editMap = {
    name: { control: "text", label: "Name" },
    price: { control: "number", label: "Price" },
    discounted_price: { control: "number", label: "Discounted Price" },
    image_link: { control: "text", label: "Image Link" },
    notes: { control: "textarea", label: "Notes" },
  }


  useEffect(() => {
    fetchOneProduct(id, (data) => setProduct(data))
  }, [])

  async function handleProductDelete() {
    const token = await getAccessTokenSilently()
    if (window.confirm("Delete this product?"))
      deleteProduct(token, product.id, () => {
        navigate(-1)
      })
  }

  async function handleAddToCart() {
    const token = await getAccessTokenSilently()
    if (product) addProductToCart(token, product.id, 1)
  }

  async function handleProductEditSubmit(editObject) {
    const token = await getAccessTokenSilently()
    delete editObject.id
    patchProduct(token, product.id, editObject, () => {
      setEditModalVisibility(false)
      fetchOneProduct(id, (data) => setProduct(data))
    })
  }

  return (
    product && (
      <>
        {editModalVisible && (
          <EditModal
            obj={product}
            editMap={editMap}
            onClose={() => setEditModalVisibility(false)}
            onSubmit={handleProductEditSubmit}
            title="Edit Product"
          />
        )}
        <div className="container">
          <div className="d-flex d-row">
            <h4 className="mb-3 text-primary">{product.name}</h4>
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
                className="btn btn-light btn-sm ms-2 mb-3"
                title="Delete Product"
                onClick={handleProductDelete}
              >
                <img src="/trash-can.svg" width="25" alt="cart" />
              </button>
            )}
          </div>

          <div className="row">
            <div className="col-md-6 mb-5">
              <img
                src={product.image_link}
                className="product-image"
                alt={product.name}
              />
            </div>
            <div className="col-md-6 mb-5">
              <h5>${product.price.toFixed(2)}</h5>
              <button
                className={
                  "btn btn-info btn-lg me-2 " +
                  (!permissions.includes("view:update:cart") ? "disabled" : "")
                }
                onClick={handleAddToCart}
              >
                Add to cart
              </button>
              {permissions.includes("view:update:cart") && (
                <button
                  className="btn btn-secondary btn-lg"
                  onClick={() => navigate("/cart")}
                >
                  Go to cart
                </button>
              )}
              {!isAuthenticated && (
                <button
                  className="btn btn-warning btn-lg"
                  onClick={() =>
                    loginWithRedirect({
                      appState: {
                        returnTo: window.location.pathname,
                      },
                    })
                  }
                >
                  Sign in
                </button>
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <h5>Description</h5>
              <p>{product.notes}</p>
            </div>
          </div>
        </div>
      </>
    )
  )
}

export default ProductDetailView
