import { React, useEffect, useState } from "react"
import ProductCardt from "./ProductCard"
import { useSearchParams } from "react-router-dom"
import { searchProducts } from "../utils/queryUtils"
import ProductCard from "./ProductCard"
import { fetchProducts } from "../utils/queryUtils"

const SearchView = () => {
  const [products, setProducts] = useState([])
  const [searchParams, setSearchParams] = useSearchParams()

  const processSearchQuery = () => {
    if (!searchParams || !searchParams.get("query")) return
    //console.log(searchParams)
    const query = String(searchParams.get("query")).trim()

    if (query.length !== 0) searchProducts(query, (data) => setProducts(data))
  }

  useEffect(() => {
    processSearchQuery()
  }, [])

  useEffect(() => {
    processSearchQuery()
  }, [searchParams])

  return (
    <>
      <div className="container">
        <h4 className="text-primary mb-2">
          Search results for '{searchParams.get("query")}':
        </h4>
        <div className="d-flex flex-row">
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
}

export default SearchView
