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
  createCategory,
  createProduct,
} from "../utils/queryUtils"
import { useGlobalState } from "../utils/state"
import PageLoader from "./PageLoader"

const CatalogView = () => {
  const navigate = useNavigate()
  const { categoryId } = useParams()
  const [categories, setCategories] = useState(null)
  const [products, setProducts] = useState(null)
  const [categoryModalVisible, setCategoryModalVisibility] = useState(false)
  const [productModalVisible, setProductModalVisibility] = useState(false)
  const [creatingNewCategory, setCreatingNewCategory] = useState(false)
  const [formObject, setFormObject] = useState({})
  const [permissions] = useGlobalState("permissions")
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()

  const [productEditMap, setProductEditMap] = useState({
    category_id: {
      control: "select",
      label: "Category",
      type: "integer",
      choices: [],
    },
    name: { control: "text", label: "Name" },
    price: { control: "number", type: "float", label: "Price" },
    discounted_price: {
      control: "number",
      type: "float",
      label: "Discounted Price",
    },
    image_link: { control: "text", label: "Image Link" },
    notes: { control: "textarea", label: "Notes" },
  })

  const categoryEditMap = {
    name: { control: "text", label: "Name" },
  }

  function getProducts() {
    if (categoryId)
      fetchProductsByCategory(categoryId, (data) => setProducts(data))
    else fetchProducts((data) => setProducts(data))
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

  function handleCategoryEdit(catId) {
    setCreatingNewCategory(false)
    const category = getCategoryFromStateById(catId)
    if (!category) return
    setFormObject(category)
    setCategoryModalVisibility(true)
  }

  function handleCategoryCreate() {
    setCreatingNewCategory(true)
    setFormObject({ name: "" })
    setCategoryModalVisibility(true)
  }

  async function handleCategorySubmit(editObject) {
    const token = await getAccessTokenSilently()
    if (creatingNewCategory) {
      createCategory(token, editObject, () => {
        fetchCategories((data) => setCategories(data))
      })
    } else {
      const catId = editObject.id
      delete editObject.id
      patchCategory(token, catId, editObject, () => {
        fetchCategories((data) => setCategories(data))
      })
    }
    setCategoryModalVisibility(false)
  }

  function handleProductCreate() {
    setFormObject({
      name: "",
      price: "",
      discounted_price: "",
      image_link: "",
      notes: "",
      category_id: categoryId ? parseInt(categoryId) : "",
    })

    // Add the current list of categories to productEditMap
    const updatedChoices = []
    for (let c of categories) {
      updatedChoices.push([c.id, c.name])
    }
    setProductEditMap((current) => ({
      ...current,
      category_id: { ...current.category_id, choices: updatedChoices },
    }))
    setProductModalVisibility(true)
  }

  async function handleProductSubmit(editObject) {
    const token = await getAccessTokenSilently()

    createProduct(token, editObject, (prodId) =>
      navigate(`/products/${prodId}`)
    )
    setProductModalVisibility(false)
  }

  useEffect(() => {
    fetchCategories((data) => setCategories(data))
  }, [])

  useEffect(() => {
    getProducts()
  }, [categoryId])

  if (!categories || !products)
    return (
      <>
        <PageLoader />
      </>
    )

  return (
    categories && (
      <>
        {categoryModalVisible && (
          <EditModal
            obj={formObject}
            editMap={categoryEditMap}
            onClose={() => setCategoryModalVisibility(false)}
            onSubmit={handleCategorySubmit}
            title="Create Category"
          />
        )}
        {productModalVisible && (
          <EditModal
            obj={formObject}
            editMap={productEditMap}
            onClose={() => setProductModalVisibility(false)}
            onSubmit={handleProductSubmit}
            title="Create Product"
          />
        )}

        <div className="container-xxl">
          <div className="row">
            <div className="col-md-3 d-flex flex-column mb-3">
              <div className="d-flex flex-row">
                <h4 className="text-secondary mb-3">Categories</h4>
                {permissions.includes("create:categories") && (
                  <button
                    className="btn btn-light btn-sm mb-3 ms-1"
                    title="New Category"
                    onClick={handleCategoryCreate}
                  >
                    <img
                      src="/plus-circle-red.svg"
                      width="25"
                      alt="New"
                    />
                  </button>
                )}
              </div>
              <CategoryList
                categories={categories}
                currentCategory={categoryId}
                onSelect={handleCategorySelect}
                onEdit={handleCategoryEdit}
                onDelete={handleCategoryDelete}
              />
            </div>
            <div className="col-md-9 d-flex flex-column mb-3">
              <div className="d-flex flex-row">
                <h4 className="text-secondary mb-3">Products</h4>
                {permissions.includes("create:products") && (
                  <button
                    className="btn btn-light btn-sm mb-3 ms-1"
                    title="New Product"
                    onClick={handleProductCreate}
                  >
                    <img
                      src="/plus-circle-red.svg"
                      width="25"
                      alt="New"
                    />
                  </button>
                )}
              </div>
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 g-3">
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
          </div>
        </div>
      </>
    )
  )
}

export default CatalogView
