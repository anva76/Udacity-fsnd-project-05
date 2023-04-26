import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import CategoryList from "./CategoryList"
import ProductCard from "./ProductCard"
import EditModal from "./EditModal"
import { useAuth0 } from "@auth0/auth0-react"
import {
  fetchCategories,
  fetchProducts,
  fetchProductsByCategory,
  deleteCategory,
  patchCategory,
} from "../utils/queryUtils"

const CatalogView = () => {
  const navigate = useNavigate()
  const { categoryId } = useParams()
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [editModalVisible, setEditModalVisibility] = useState(false)
  const [changedCategory, setChangedCategory] = useState({})
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()

  const editMap = {
    name: { control: "text", label: "Name" },
  }

  const getCategoryFromStateById = (catId) => {
    if (categories) {
      const catIndex = categories.findIndex((item) => {
        return item.id == catId
      })
      if (catIndex != -1) return categories[catIndex]
      else return null
    }

    return null
  }

  const handleCategorySelect = (catId) => {
    if (catId) navigate(`/catalog/${catId}`)
    else navigate("/catalog")
  }

  async function handleCategoryDelete(catId) {
    const token = await getAccessTokenSilently()
    const category = getCategoryFromStateById(catId)
    if (!category) return

    if (window.confirm(`Delete the '${category.name}' category?`)) {
      deleteCategory(token, catId, () => {
        navigate("/catalog")
        fetchCategories((data) => setCategories(data))
      })
    }
  }

  async function handleCategoryEditSubmit(editObject) {
    const token = await getAccessTokenSilently()
    const catId = editObject.id
    delete editObject.id
    patchCategory(token, catId, editObject, () => {
      setEditModalVisibility(false)
      fetchCategories((data) => setCategories(data))
    })
  }

  const handleCategoryEdit = (catId) => {
    const category = getCategoryFromStateById(catId)
    if (!category) return

    setChangedCategory(category)
    setEditModalVisibility(true)
  }

  useEffect(() => {
    fetchCategories((data) => setCategories(data))
  }, [])

  useEffect(() => {
    if (categoryId)
      fetchProductsByCategory(categoryId, (data) => setProducts(data))
    else fetchProducts((data) => setProducts(data))
  }, [categoryId])

  return (
    categories && (
      <>
        {editModalVisible && (
          <EditModal
            obj={changedCategory}
            editMap={editMap}
            onClose={() => setEditModalVisibility(false)}
            onSubmit={handleCategoryEditSubmit}
            title="Edit Category"
          />
        )}
        <div className="container">
          <div className="row">
            <h4 className="text-primary mb-3">Categories</h4>
            <div className="col-md-3 mb-3">
              <CategoryList
                categories={categories}
                currentCategory={categoryId}
                onSelect={handleCategorySelect}
                onEdit={handleCategoryEdit}
                onDelete={handleCategoryDelete}
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
