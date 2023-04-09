import React, { useEffect, useState } from "react"
import config from "../config"
import { useParams } from "react-router-dom"
import "../stylesheets/ProductDetailView.css"
import Alert from "../components/Alert"

const ProductDetailView = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [alertMessage, setAlertMessage] = useState(null)

  useEffect(() => {
    fetch(config.apiUrl + `/products/${id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data.product)
        setProduct(data.product)
      })
      .catch((err) => console.log(err))
  }, [])

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
        setAlertMessage("Product was added to the cart.")
      })
      .catch((err) => console.log(err))
  }

  const handleClick = () => {
    if (product) addProductToCart(product.id, 1)
  }

  return (
    product && (
      <>
        {alertMessage && (
          <Alert
            onClose={() => {
              setAlertMessage(null)
            }}
            message={alertMessage}
          />
        )}
        <div className="container">
          <h4 className="mb-3 text-primary">{product.name}</h4>
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
