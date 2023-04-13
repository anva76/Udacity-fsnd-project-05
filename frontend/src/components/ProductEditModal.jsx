import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import config from "../config"
import "../stylesheets/ProductEditModal.css"

const ProductEditModal = ({ obj, onClose, onSubmit }) => {
  const [product, setProduct] = useState({
    name: obj.name,
    price: obj.price,
    discounted_price: obj.discounted_price,
    notes: obj.notes,
    image_link: obj.image_link,
  })

  const handleChange = (e) => {
    if (e.target.type == "number") {
      setProduct({ ...product, [e.target.name]: parseFloat(e.target.value) })
    } else {
      setProduct({ ...product, [e.target.name]: e.target.value })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    product.name = product.name.trim()
    console.log(product)
    onSubmit(product)
  }

  return (
    <>
      <div className="modal-overlay"></div>
      <div className="modal d-block modal-lg">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Product</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              <form className="row" onSubmit={handleSubmit}>
                <div className="row">
                  <div className="mb-3">
                    <label className="form-label text-secondary">
                      Product Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      onChange={handleChange}
                      name="name"
                      value={product.name}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="mb-3 col-md-6">
                    <label className="form-label text-secondary">Price</label>
                    <input
                      type="number"
                      className="form-control"
                      onChange={handleChange}
                      name="price"
                      value={product.price}
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label className="form-label text-secondary">
                      Discounted Price
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      onChange={handleChange}
                      name="discounted_price"
                      value={product.discounted_price}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="mb-3">
                    <label className="form-label text-secondary">
                      Image Link
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      onChange={handleChange}
                      name="image_link"
                      value={product.image_link}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="mb-3">
                    <label className="form-label text-secondary">
                      Product Notes
                    </label>
                    <textarea
                      className="form-control"
                      onChange={handleChange}
                      name="notes"
                      rows="3"
                      value={product.notes}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onClose}
                  >
                    Close
                  </button>
                  <button type="submit" className="btn btn-warning">
                    Save changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductEditModal
