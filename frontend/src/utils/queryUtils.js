import config from "../reactConfig"
import { emitMessage } from "../components/FlashMessage"
import { useAuth0 } from "@auth0/auth0-react"

// CRUD functions

const defaultHeaders = {
  "Content-Type": "application/json",
}

function formatHeaders(token) {
  if (token)
    return { ...defaultHeaders, Authorization: `Bearer ${token}` }
  else return { ...defaultHeaders }

}

// ---------------------------------------------------------------------
const fetchProducts = (onSuccess) => {
  fetch(config.apiUrl + "/products/")
    .then((response) => response.json())
    .then((data) => {
      console.log(data.products)

      if (!data["success"]) {
        alert("Server error. Unable to fetch products.")
      } else onSuccess(data.products)
    })
    .catch((err) => {
      console.log(err)
      alert("Unable to fetch products. Please try again later.")
    })
}

// --------------------------------------------------------------------
const fetchProductsByCategory = (category, onSuccess) => {
  const fetchUrl = `/categories/${category}/products/`

  fetch(config.apiUrl + fetchUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log(data.products)

      if (!data["success"]) {
        alert("Server error. Unable to fetch products.")
      } else onSuccess(data.products)
    })
    .catch((err) => {
      console.log(err)
      alert("Unable to fetch products. Please try again later.")
    })
}

// ---------------------------------------------------------------------
const fetchOneProduct = (id, onSuccess) => {
  fetch(config.apiUrl + `/products/${id}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data.product)
      if (!data["success"]) {
        alert("Server error. Unable to fetch this product.")
      } else onSuccess(data.product)
    })
    .catch((err) => {
      console.log(err)
      alert("Unable to fetch product data. Please try again later.")
    })
}

// ------------------------------------------------------------------------
const addProductToCart = (token, productId, quantity, onSuccess = null) => {
  fetch(config.apiUrl + "/cart/", {
    method: "POST",
    headers: formatHeaders(token),
    body: JSON.stringify({ product_id: productId, quantity }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      if (!data["success"]) {
        alert("Server error. Unable to add the product to the cart.")
      } else {
        emitMessage("Product was added to the cart.")
        onSuccess && onSuccess()
      }
    })
    .catch((err) => {
      console.log(err)
      alert("Unable to add the product to the cart. Please try again later.")
    })
}

// ---------------------------------------------------------------------------
const deleteProduct = (token, id, onSuccess = null) => {
  fetch(config.apiUrl + `/products/${id}/`, {
    method: "DELETE",
    headers: formatHeaders(token),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      if (!data["success"]) {
        alert("Server error. Unable to delete the product.")
      } else {
        emitMessage("Product was successfully deleted.")
        onSuccess && onSuccess()
      }
    })
    .catch((err) => {
      console.log(err)
      alert("Unable to delete the product. Please try again later.")
    })
}

// -----------------------------------------------------------------------
const patchProduct = (token, id, obj, onSuccess = null) => {
  fetch(config.apiUrl + `/products/${id}/`, {
    method: "PATCH",
    headers: formatHeaders(token),
    body: JSON.stringify({ ...obj }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      if (!data["success"]) {
        alert(
          "Unable to update the product. Please check the form fields and try again."
        )
      } else {
        emitMessage("Product was successfully updated.")
        onSuccess && onSuccess()
      }
    })
    .catch((err) => {
      console.log(err)
      alert("Unable to update the product. Please try again later.")
    })
}

// -----------------------------------------------------------------------------------------
const fetchOrders = (token, onSuccess) => {
  fetch(config.apiUrl + "/orders/", {
    method: "GET",
    headers: formatHeaders(token),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.orders)
      if (!data["success"]) {
        alert("Sever Error. Unable to get order data.")
      } else {
        onSuccess(data.orders)
      }
    })
    .catch((err) => {
      console.log(err)
      alert("Unable to get order data. Please try again later.")
    })
}
// -----------------------------------------------------------------------------------------

const fetchOneOrder = (token, id, onSuccess) => {
  fetch(config.apiUrl + `/orders/${id}/`, {
    method: "GET",
    headers: formatHeaders(token),
  })
    .then((response) => response.json())
    .then((data) => {
      //console.log(data.order)
      if (!data["success"]) {
        alert("Sever Error. Unable to get order data.")
      } else {
        onSuccess(data.order)
      }
    })
    .catch((err) => {
      console.log(err)
      alert("Unable to get order data. Please try again later.")
    })
}
// -----------------------------------------------------------------------------------------
const deleteOrder = (token, id, onSuccess = nul) => {
  fetch(config.apiUrl + `/orders/${id}/`, {
    method: "DELETE",
    headers: formatHeaders(token),
  })
    .then((response) => response.json())
    .then((data) => {
      if (!data["success"]) {
        alert("Sever Error. Unable to delete this order.")
      } else {
        onSuccess && onSuccess()
        emitMessage("Order was successfully deleted.")
      }
    })
    .catch((err) => {
      console.log(err)
      alert("Unable to delete this order. Please try again later.")
    })
}
// ------------------------------------------------------------------
const fetchCart = (token, onSuccess) => {
  fetch(config.apiUrl + "/cart/", {
    method: "GET",
    headers: formatHeaders(token),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.cart)

      if (!data["success"]) {
        alert("Sever Error. Unable to get cart data.")
      } else {
        onSuccess(data.cart)
      }
    })
    .catch((err) => {
      console.log(err)
      alert("Unable to get cart data. Please try again later.")
    })
}

// ----------------------------------------------------------------
const submitOrder = (token, orderData, onSuccess = null) => {
  fetch(config.apiUrl + "/orders/", {
    method: "POST",
    headers: formatHeaders(token),
    body: JSON.stringify(orderData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      if (!data["success"]) {
        alert(
          "Unable to submit the order. Please check the form fields and try again."
        )
      } else {
        emitMessage("Order was successfully submitted")
        onSuccess && onSuccess()
      }
    })
    .catch((err) => {
      console.log(err)
      alert("Unable to submit the order. Please try again later.")
    })
}

// ----------------------------------------------------------------
const patchOrder = (token, id, orderData, onSuccess = null) => {
  fetch(config.apiUrl + `/orders/${id}/`, {
    method: "PATCH",
    headers: formatHeaders(token),
    body: JSON.stringify(orderData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      if (!data["success"]) {
        alert(
          "Unable to update this order. Please check the form fields and try again."
        )
      } else {
        emitMessage("Order was successfully updated")
        onSuccess && onSuccess()
      }
    })
    .catch((err) => {
      console.log(err)
      alert("Unable to update this order. Please try again later.")
    })
}


// ---------------------------------------------------------------------------------------
const fetchCategories = (onSuccess) => {
  fetch(config.apiUrl + "/categories/")
    .then((response) => response.json())
    .then((data) => {
      console.log(data.categories)

      if (!data["success"]) {
        alert("Server error. Unable to fetch categories.")
      } else onSuccess(data.categories)
    })
    .catch((err) => {
      console.log(err)
      alert("Unable to fetch categories. Please try again later.")
    })
}

// ----------------------------------------------------------------------------------------
const patchCartItem = (token, cartItemId, quantity, onSuccess = null) => {
  fetch(config.apiUrl + `/cart/${cartItemId}/`, {
    method: "PATCH",
    headers: formatHeaders(token),
    body: JSON.stringify({ quantity }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      if (!data["success"]) {
        alert("Server error. Unable to update this cart item.")
      } else {
        onSuccess && onSuccess()
      }
    })
    .catch((err) => {
      console.log(err)
      alert("Unable to update this cart item. Please try again later.")
    })
}

// ----------------------------------------------------------------------
const deleteCartItem = (token, cartItemId, onSuccess = null) => {
  fetch(config.apiUrl + `/cart/${cartItemId}/`, {
    method: "DELETE",
    headers: formatHeaders(token),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      if (!data["success"]) {
        alert("Server error. Unable to delete this cart item.")
      } else {
        onSuccess && onSuccess()
      }
    })
    .catch((err) => {
      console.log(err)
      alert("Unable to delete this cart item. Please try again later.")
    })
}

// -------------------------------------------------------------------------
const deleteCategory = (token, id, onSuccess = null) => {
  fetch(config.apiUrl + `/categories/${id}/`, {
    method: "DELETE",
    headers: formatHeaders(token),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      if (!data["success"]) {
        alert("Server error. Unable to delete this category.")
      } else {
        emitMessage("Category was successfully deleted.")
        onSuccess && onSuccess()
      }
    })
    .catch((err) => {
      console.log(err)
      alert("Unable to delete this category. Please try again later.")
    })
}

// -----------------------------------------------------------------------
const patchCategory = (token, id, obj, onSuccess = null) => {
  fetch(config.apiUrl + `/categories/${id}/`, {
    method: "PATCH",
    headers: formatHeaders(token),
    body: JSON.stringify({ ...obj }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      if (!data["success"]) {
        alert(
          "Unable to update this category. Please check the form fields and try again."
        )
      } else {
        emitMessage("Category was successfully updated.")
        onSuccess && onSuccess()
      }
    })
    .catch((err) => {
      console.log(err)
      alert("Unable to update this category. Please try again later.")
    })
}

// -----------------------------------------------------------------------
const searchProducts = (searchQuery, onSuccess) => {
  fetch(config.apiUrl + "/search/", {
    method: "POST",
    headers: {
      ...defaultHeaders,
    },
    body: JSON.stringify({ search_query: searchQuery }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      if (!data["success"]) {
        alert(
          "Unable to process the search request. Please check the data and try again."
        )
      } else {
        onSuccess && onSuccess(data.products)
      }
    })
    .catch((err) => {
      console.log(err)
      alert("Unable to process the search request. Please try again later.")
    })
}

export {
  fetchProducts,
  fetchProductsByCategory,
  fetchOneProduct,
  addProductToCart,
  deleteProduct,
  patchProduct,
  fetchOrders,
  fetchOneOrder,
  fetchCart,
  submitOrder,
  fetchCategories,
  patchCartItem,
  deleteCartItem,
  deleteCategory,
  patchCategory,
  searchProducts,
  deleteOrder,
  patchOrder,
}
