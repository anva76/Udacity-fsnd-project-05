import React, { useEffect, useState } from "react"
import config from "../config"
import ProductCard from "../components/ProductCard"

function HomeView() {
  const [productList, setProductList] = useState([])

  useEffect(() => {
    fetch(config.apiUrl + "/products")
      .then((response) => response.json())
      .then((data) => {
        console.log(data.products)
        setProductList(data.products)
      })
      .catch((err) => console.log(err))
  }, [])

  return (
    <>
      <div className="container">
        <h4 className="mb-3 text-primary">Latest products</h4>
        <div className="d-flex flex-row flex-wrap">
          {productList &&
            productList.map((p) => (
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

export default HomeView
