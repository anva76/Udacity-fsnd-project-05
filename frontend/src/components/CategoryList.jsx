import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import config from "../config"

const CategoryList = ({
  categories,
  currentCategory,
  onSelect,
  onEdit,
  onDelete,
}) => {
  return (
    <>
      <ul className="list-group">
        <li
          key="-1"
          role="button"
          className={
            currentCategory ? "list-group-item" : "list-group-item bg-info"
          }
          onClick={() => onSelect(null)}
        >
          All
        </li>
        {Object.keys(categories).map((catId, index) => (
          <li
            key={catId}
            role="button"
            className={
              // == is used here to compare 1 and "1"
              currentCategory == catId
                ? "list-group-item bg-info"
                : "list-group-item"
            }
            onClick={() => onSelect(catId)}
          >
            <div className="d-flex flex-row justify-content-between">
              {categories[catId].name}
              <div>
                <button
                  className=" btn btn-light btn-sm  p-0 me-1"
                  onClick={() => {
                    onEdit(catId)
                  }}
                >
                  <img src="/edit.svg" width="18" alt="edit" />
                </button>
                <button
                  className=" btn btn-light btn-sm  p-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(catId)
                  }}
                >
                  <img src="/trash-can.svg" width="18" alt="delete" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}

export default CategoryList
