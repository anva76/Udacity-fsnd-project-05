import React, { useEffect, useState } from "react"
import config from "../config"
import { useParams, useNavigate } from "react-router-dom"
import "../stylesheets/ProductDetailView.css"
import Alert from "../components/Alert"
import ProductEditModal from "./ProductEditModal"

const ProductDetailView = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [alertMessage, setAlertMessage] = useState(null)
  const [editModalVisible, setEditModalVisibility] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [])

  const fetchProduct = () => {
    fetch(config.apiUrl + `/products/${id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data.product)
        setProduct(data.product)
      })
      .catch((err) => {
        console.log(err)
        alert("Unable to fetch product data. Please try again later.")
      })
  }

  const addProductToCart = (productId, quantity) => {
    fetch(config.apiUrl + "/cart/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.testToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product_id: productId, quantity }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        if (!data["success"]) {
          alert("Server error. Unable to add the product to the cart.")
        } else setAlertMessage("Product was added to the cart.")
      })
      .catch((err) => {
        console.log(err)
        alert("Unable to add the product to the cart. Please try again later.")
      })
  }

  const deleteProduct = () => {
    if (window.confirm("Delete this product?")) {
      fetch(config.apiUrl + `/products/${product.id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${config.testToken}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data)
          if (!data["success"]) {
            alert("Server error. Unable to delete the product.")
          } else
            navigate("/home", {
              state: {
                message: "Product was successfully deleted.",
              },
            })
        })
        .catch((err) => {
          console.log(err)
          alert("Unable to delete the product. Please try again later.")
        })
    }
  }

  const patchProduct = (obj) => {
    fetch(config.apiUrl + `/products/${product.id}/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${config.testToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...obj }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        if (!data["success"]) {
          alert(
            "Unable to update the product. Please check the form fields and try again."
          )
        } else {
          setEditModalVisibility(false)
          fetchProduct()
          setAlertMessage("Product was successfully updated.")
        }
      })
      .catch((err) => {
        console.log(err)
        alert("Unable to update the product. Please try again later.")
      })
  }

  const handleClick = () => {
    if (product) addProductToCart(product.id, 1)
  }

  return (
    product && (
      <>
        {editModalVisible && (
          <ProductEditModal
            obj={product}
            onClose={() => setEditModalVisibility(false)}
            onSubmit={patchProduct}
          />
        )}
        <div className="container">
          {alertMessage && (
            <Alert
              onClose={() => {
                setAlertMessage(null)
              }}
              message={alertMessage}
            />
          )}
          <div className="d-flex d-row">
            <h4 className="mb-3 text-primary">{product.name}</h4>
            <button
              className="btn btn-warning btn-sm ms-2 mb-3"
              title="Edit Product"
              onClick={() => setEditModalVisibility(true)}
            >
              <img src="/edit.svg" width="25" alt="cart" />
            </button>
            <button
              className="btn btn-danger btn-sm ms-2 mb-3"
              title="Delete Product"
              onClick={() => deleteProduct()}
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
              <button className="btn btn-info btn-lg" onClick={handleClick}>
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
