import { React, useEffect, useState } from "react"
import ProductCardt from "./ProductCard"
import { useSearchParams } from "react-router-dom"
import { searchProducts } from "../utils/queryUtils"
import ProductCard from "./ProductCard"
import PageLoader from "./PageLoader"

const SearchView = () => {
  const [products, setProducts] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()

  function processSearchQuery() {
    if (!searchParams || !searchParams.get("query")) {
      setProducts([])
      return
    }
    //console.log(searchParams)
    const query = String(searchParams.get("query"))
    searchProducts(query, (data) => setProducts(data))
  }

  useEffect(() => {
    processSearchQuery()
  }, [])

  useEffect(() => {
    processSearchQuery()
  }, [searchParams])

  if (!products)
    return (
      <>
        <PageLoader />
      </>
    )

  return (
    products && (
      <>
        <div className="container">
          <h4 className="text-secondary mb-3">
            Search results for '{searchParams.get("query")}':
          </h4>
          <div className="d-flex flex-row flex-wrap">
            {products && products.length == 0 && <h5>Nothing found</h5>}
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

export default SearchView
