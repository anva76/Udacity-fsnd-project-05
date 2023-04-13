import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import config from "../config"
import CategoryList from "./CategoryList"
import ProductCard from "./ProductCard"

const CatalogView = () => {
  const navigate = useNavigate()
  const { categoryId } = useParams()
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [currentCategory, setCurrentCategory] = useState(categoryId)

  const fetchCategories = () => {
    fetch(config.apiUrl + "/categories/")
      .then((response) => response.json())
      .then((data) => {
        console.log(data.categories)

        if (!data["success"]) {
          alert("Server error. Unable to fetch categories.")
        } else setCategories(data.categories)
      })
      .catch((err) => {
        console.log(err)
        alert("Unable to fetch categories. Please try again later.")
      })
  }

  const fetchProducts = () => {
    const fetchUrl = currentCategory
      ? `/categories/${currentCategory}/products/`
      : "/products/"

    console.log(fetchUrl)
    fetch(config.apiUrl + fetchUrl)
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

  const handleSelect = (catId) => {
    if (catId) navigate(`/catalog/${catId}`)
    else navigate("/catalog")
  }

  useEffect(() => {
    console.log("currentCategory", currentCategory)
    fetchCategories()
    fetchProducts()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [currentCategory])

  useEffect(() => {
    setCurrentCategory(categoryId)
  }, [categoryId])

  return (
    <>
      <div className="container">
        <div className="row">
          <h4 className="text-primary mb-3">Categories</h4>
          <div className="col-md-2 mb-3">
            <CategoryList
              categories={categories}
              currentCategory={currentCategory}
              onSelect={handleSelect}
            />
          </div>
          <div className="col-md-10 d-flex flex-row flex-wrap">
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
      </div>
    </>
  )
}

export default CatalogView
