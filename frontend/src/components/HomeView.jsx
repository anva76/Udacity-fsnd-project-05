import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import config from "../config"
import ProductCard from "../components/ProductCard"
import Alert from "./Alert"

function HomeView() {
  const { state } = useLocation()
  const [products, setProducts] = useState([])
  const [alertMessage, setAlertMessage] = useState(state ? state.message : null)

  const fetchProducts = () => {
    fetch(config.apiUrl + "/products/")
      .then((response) => response.json())
      .then((data) => {
        console.log(data.products)

        if (!data["success"]) {
          alert("Server error. Unable to fetch products.")
        } else setProducts(data.products)
      })
      .catch((err) => {
        console.log(err)
        alert("Unable to fetch products. Please try again later.")
      })
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    products.length !== 0 && (
      <>
        <div className="container">
          {alertMessage && (
            <Alert
              onClose={() => {
                setAlertMessage(null)
              }}
              message={alertMessage}
            />
          )}
          <h4 className="mb-3 text-primary">Latest products</h4>
          <div className="d-flex flex-row flex-wrap">
            {products &&
              products.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  image_link={p.image_link}
                  price={p.price}
                />
              ))}
          </div>
        </div>
      </>
    )
  )
}

export default HomeView
