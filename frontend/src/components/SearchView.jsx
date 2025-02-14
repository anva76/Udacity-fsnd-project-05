import { React, useEffect, useState } from "react"
import ProductCardt from "./ProductCard"
import { useSearchParams, useNavigate } from "react-router-dom"
import { searchProducts } from "../utils/queryUtils"
import ProductCard from "./ProductCard"
import PageLoader from "./PageLoader"

const SearchView = () => {
  const navigate = useNavigate()
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
        <div className="container-xxl">
          <button
            className="btn btn-outline-secondary btn mb-3"
            onClick={() => navigate("/catalog")}
          >
            Back to catalog
          </button>
          <div className="row">
            <h4 className="text-secondary mb-4 text-center">
              Search results for '{searchParams.get("query")}':
            </h4>
          </div>
          {products && products.length == 0 && (
            <h5 className="text-center">Nothing found</h5>
          )}
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
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
