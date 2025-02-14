import React from "react"
import { useNavigate } from "react-router-dom"
import "../stylesheets/ProductCard.css"

const ProductCard = ({
  id,
  name,
  image_link,
  price,
  discountedPrice = null,
}) => {
  const navigate = useNavigate()

  const goToDetailView = () => {
    navigate(`/products/${id}`)
  }

  function renderPrice() {
    if (discountedPrice)
      return (
        <div className="d-flex flex-row align-items-center col-md-3">
          <h5 className="p-1 rounded rounded-4 price-badge-discount">
            ⌑{discountedPrice.toFixed(2)}
          </h5>
          <h6 className="text-secondary price-badge text-decoration-line-through p-1 ms-2 rounde rounded-4">
            ⌑{price.toFixed(2)}
          </h6>
        </div>
      )
    else
      return (
        <div className="d-flex flex-row align-items-center col-md-2">
          <h5 className="p-1 rounded rounded-4 price-badge">
            ⌑{price.toFixed(2)}
          </h5>
        </div>
      )
  }

  return (
    <>
      <div className="col">
        <div className="card list-card">
          <img
            src={image_link ? image_link : "/img-placeholder.png"}
            className="card-img-top card-image"
            alt="Product image"
            onClick={goToDetailView}
          />
          <div className="card-body">
            <h5 className="card-title">{name}</h5>
            {renderPrice()}
            <button
              className="btn btn-outline-warning btn-sm"
              onClick={goToDetailView}
            >
              View
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductCard
