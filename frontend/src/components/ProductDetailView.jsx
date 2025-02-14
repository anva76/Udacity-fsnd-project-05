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
import PageLoader from "./PageLoader"

const ProductDetailView = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [editModalVisible, setEditModalVisibility] = useState(false)
  const [permissions] = useGlobalState("permissions")

  const { getAccessTokenSilently, isAuthenticated, loginWithRedirect } =
    useAuth0()

  const editMap = {
    name: { control: "text", label: "Name" },
    price: { control: "number", type: "float", label: "Price" },
    discounted_price: {
      control: "number",
      type: "float",
      label: "Discounted Price",
    },
    image_link: { control: "text", label: "Image Link" },
    notes: { control: "textarea", label: "Notes" },
  }

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

  function renderPrice() {
    if (product.discounted_price)
      return (
        <div className="d-flex flex-row align-items-center col-md-3 mb-3">
          <h5 className="p-2 rounded rounded-4 price-badge-discount">
            ⌑{product.discounted_price.toFixed(2)}
          </h5>
          <h6 className="text-secondary price-badge text-decoration-line-through p-1 ms-2 rounded rounded-4">
            ⌑{product.price.toFixed(2)}
          </h6>
        </div>
      )
    else
      return (
        <div className="d-flex flex-row align-items-center col-md-2 mb-3">
          <h5 className="p-2 rounded rounded-4 price-badge">
            ⌑{product.price.toFixed(2)}
          </h5>
        </div>
      )
  }

  useEffect(() => {
    fetchOneProduct(id, (data) => setProduct(data))
  }, [])

  if (!product)
    return (
      <>
        <PageLoader />
      </>
    )

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
        <div className="container-xl">
          <div className="d-flex d-row mb-3 align-items-center">
            <button
              className="btn btn-outline-secondary btn"
              onClick={() => navigate("/catalog")}
            >
              Back to catalog
            </button>

            {permissions.includes("role:admin") && (
              <button
                className="btn btn-light btn-sm ms-2"
                title="Edit Product"
                onClick={() => setEditModalVisibility(true)}
              >
                <img
                  src="/edit-red.svg"
                  width="25"
                  alt="Edit"
                />
              </button>
            )}
            {permissions.includes("delete:products") && (
              <button
                className="btn btn-light btn-sm ms-2"
                title="Delete Product"
                onClick={handleProductDelete}
              >
                <img
                  src="/trash-can-red.svg"
                  width="25"
                  alt="Delete"
                />
              </button>
            )}
          </div>

          <div className="row justify-content-center">
            <h3 className="mb-4 text-secondary text-center">{product.name}</h3>
            <div className="col-md mb-5 ">
              <img
                src={
                  product.image_link
                    ? product.image_link
                    : "/img-placeholder.png"
                }
                className="product-image rounded"
                alt="Product image"
              />
            </div>
            <div className="col-md mb-5">
              <p>{product.notes}</p>
              {renderPrice()}
              {permissions.includes("view:update:cart") && (
                <button
                  className={"btn btn-warning btn me-2 "}
                  onClick={handleAddToCart}
                >
                  Add to cart
                </button>
              )}
              {permissions.includes("view:update:cart") && (
                <button
                  className="btn btn-outline-secondary btn"
                  onClick={() => navigate("/cart")}
                >
                  Go to cart
                </button>
              )}
              {!isAuthenticated && (
                <button
                  className="btn btn-outline-secondary btn-lg"
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
        </div>
      </>
    )
  )
}

export default ProductDetailView
