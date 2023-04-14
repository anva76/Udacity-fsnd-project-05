import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import config from "../config"
import ProductCard from "./ProductCard"
import { fetchProducts } from "../utils/QueryUtils"

function HomeView() {
  const { state } = useLocation()
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetchProducts((data) => setProducts(data))
  }, [])

  return (
    products.length !== 0 && (
      <>
        <div className="container">
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
