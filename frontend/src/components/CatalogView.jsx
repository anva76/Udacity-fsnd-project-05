import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import config from "../config"
import CategoryList from "./CategoryList"
import ProductCard from "./ProductCard"
import EditModal from "./EditModal"
import {
  fetchCategories,
  fetchProducts,
  fetchProductsByCategory,
  deleteCategory,
  patchCategory,
} from "../utils/QueryUtils"

const CatalogView = () => {
  const navigate = useNavigate()
  const { categoryId } = useParams()
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [currentCategory, setCurrentCategory] = useState(categoryId)
  const [editModalVisible, setEditModalVisibility] = useState(false)
  const [changedCategory, setChangedCategory] = useState({})

  const editMap = {
    name: { control: "text", label: "Name" },
  }

  const onCategorySelect = (catId) => {
    if (catId) navigate(`/catalog/${catId}`)
    else navigate("/catalog")
  }

  const onCategoryDelete = (catId) => {
    if (window.confirm(`Delete the '${categories[catId].name}' category?`)) {
      deleteCategory(catId, () => {
        navigate("/catalog")
        fetchCategories((data) => setCategories(data))
      })
    }
  }

  const onCategoryEditSubmit = (editObject) => {
    const catId = editObject.id
    delete editObject.id
    patchCategory(catId, editObject, () => {
      setEditModalVisibility(false)
      fetchCategories((data) => setCategories(data))
    })
  }

  const onCategoryEdit = (catId) => {
    setChangedCategory(categories[catId])
    setEditModalVisibility(true)
  }

  useEffect(() => {
    fetchCategories((data) => setCategories(data))
  }, [])

  useEffect(() => {
    if (currentCategory)
      fetchProductsByCategory(currentCategory, (data) => setProducts(data))
    else fetchProducts((data) => setProducts(data))
  }, [currentCategory])

  useEffect(() => {
    setCurrentCategory(categoryId)
  }, [categoryId])

  return (
    categories && (
      <>
        {editModalVisible && (
          <EditModal
            obj={changedCategory}
            editMap={editMap}
            onClose={() => setEditModalVisibility(false)}
            onSubmit={onCategoryEditSubmit}
            title="Edit Category"
          />
        )}
        <div className="container">
          <div className="row">
            <h4 className="text-primary mb-3">Categories</h4>
            <div className="col-md-3 mb-3">
              <CategoryList
                categories={categories}
                currentCategory={currentCategory}
                onSelect={onCategorySelect}
                onEdit={onCategoryEdit}
                onDelete={onCategoryDelete}
              />
            </div>
            <div className="col-md-9 d-flex flex-row flex-wrap">
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
  )
}

export default CatalogView
