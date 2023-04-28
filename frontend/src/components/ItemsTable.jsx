import React from "react"
import { Link } from "react-router-dom"
import "../stylesheets/ItemsTable.css"

const ItemsTable = ({
  obj,
  withButtons = false,
  onItemIncrease = null,
  onItemDecrease = null,
  onItemDelete = null,
}) => {
  return (
    <>
      <table className="table mb-4">
        <thead className="table-secondary">
          <tr>
            <th>#</th>
            <th>Product</th>
            <th>Price</th>
            <th className="text-center">Quantity</th>
            <th colSpan="2">Sub total</th>
          </tr>
        </thead>
        <tbody>
          {obj.items &&
            obj.items.map((item, index) => (
              <tr key={item.id}>
                <td className="align-middle">{index + 1}</td>
                <td className="align-middle">
                  <Link to={"/products/" + item.product.id}>
                    <img
                      src={
                        item.product.image_link
                          ? item.product.image_link
                          : "/img-placeholder.png"
                      }
                      className="item-image me-2"
                      alt="Product image"
                    />
                    {item.product.name}
                  </Link>
                </td>
                <td className="align-middle">
                  $
                  {item.product.discounted_price
                    ? item.product.discounted_price.toFixed(2)
                    : item.product.price.toFixed(2)}
                </td>
                <td className="text-center align-middle">
                  <div className="d-flex justify-content-center align-items-center">
                    {withButtons && (
                      <button
                        className="btn btn-light btn-sm me-2"
                        onClick={() => {
                          onItemIncrease(item.id, item.quantity)
                        }}
                      >
                        <img src="/plus-circle.svg" width="25" alt="add one" />
                      </button>
                    )}
                    {item.quantity}
                    {withButtons && (
                      <button
                        className="btn btn-light btn-sm ms-2"
                        onClick={() => {
                          onItemDecrease(item.id, item.quantity)
                        }}
                      >
                        <img
                          src="/dash-circle.svg"
                          width="25"
                          alt="remove one"
                        />
                      </button>
                    )}
                  </div>
                </td>
                <td className="align-middle">${item.sub_total.toFixed(2)}</td>
                <td className="align-middle">
                  {withButtons && (
                    <button
                      className="btn btn-light btn-sm"
                      onClick={() => {
                        onItemDelete(item.id)
                      }}
                    >
                      <img src="/trash-can.svg" width="25" alt="delete" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
        <tfoot className="table-secondary">
          <tr>
            <th colSpan="3">Total</th>
            <th className="text-center">{obj.items_count}</th>
            <th colSpan="2">${obj.total_amount.toFixed(2)}</th>
          </tr>
        </tfoot>
      </table>
    </>
  )
}

export default ItemsTable
