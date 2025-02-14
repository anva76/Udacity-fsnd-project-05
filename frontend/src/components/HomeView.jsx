import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import ProductCard from "./ProductCard"
import { fetchLatestProducts } from "../utils/queryUtils"
import PageLoader from "./PageLoader"

function HomeView() {
  const { state } = useLocation()
  const [products, setProducts] = useState(null)

  useEffect(() => {
    fetchLatestProducts((data) => setProducts(data))
  }, [])

  if (!products)
    return (
      <>
        <PageLoader />
      </>
    )

  return (
    products.length !== 0 && (
      <>
        <div className="container-xxl">
          <h4 className="mb-3 text-secondary">Latest products</h4>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
            {products &&
              products.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  image_link={p.image_link}
                  price={p.price}
                  discountedPrice={p.discounted_price}
                />
              ))}
          </div>
        </div>
      </>
    )
  )
}

export default HomeView
