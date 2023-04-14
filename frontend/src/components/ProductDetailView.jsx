import React, { useEffect, useState } from "react"
import config from "../config"
import { useParams, useNavigate } from "react-router-dom"
import "../stylesheets/ProductDetailView.css"
import { emitMessage } from "./FlashMessage"
import EditModal from "./EditModal"
import {
  fetchOneProduct,
  addProductToCart,
  deleteProduct,
  patchProduct,
} from "../utils/QueryUtils"

const ProductDetailView = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [editModalVisible, setEditModalVisibility] = useState(false)

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

  const onProductDelete = () => {
    if (window.confirm("Delete this product?"))
      deleteProduct(product.id, () => {
        navigate(-1)
      })
  }

  const handleAddToCart = () => {
    if (product) addProductToCart(product.id, 1)
  }

  const onProductEditSubmit = (editObject) => {
    delete editObject.id
    patchProduct(product.id, editObject, () => {
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
            onSubmit={onProductEditSubmit}
            title="Edit Product"
          />
        )}
        <div className="container">
          <div className="d-flex d-row">
            <h4 className="mb-3 text-primary">{product.name}</h4>
            <button
              className="btn btn-light btn-sm ms-2 mb-3"
              title="Edit Product"
              onClick={() => setEditModalVisibility(true)}
            >
              <img src="/edit.svg" width="25" alt="cart" />
            </button>
            <button
              className="btn btn-light btn-sm ms-2 mb-3"
              title="Delete Product"
              onClick={onProductDelete}
            >
              <img src="/trash-can.svg" width="25" alt="cart" />
            </button>
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
              <h5>${product.price}</h5>
              <button className="btn btn-info btn-lg" onClick={handleAddToCart}>
                Add to cart
              </button>
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
