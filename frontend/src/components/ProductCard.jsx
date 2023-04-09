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

  return (
    <>
      <div className="card list-card me-1 mb-1 ">
        <img
          src={image_link}
          className="card-img-top card-image"
          alt={name}
          onClick={goToDetailView}
        />
        <div className="card-body">
          <h5 className="card-title">{name}</h5>
          <h5>
            <span className="badge bg-secondary">${price}</span>
          </h5>
          <button className="btn btn-info btn-sm" onClick={goToDetailView}>
            View
          </button>
        </div>
      </div>
    </>
  )
}

export default ProductCard
