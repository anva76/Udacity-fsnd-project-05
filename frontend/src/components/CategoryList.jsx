import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useGlobalState } from "../utils/state"

const CategoryList = ({
  categories,
  currentCategory,
  onSelect,
  onEdit,
  onDelete,
}) => {
  const [permissions] = useGlobalState("permissions")

  return (
    <>
      <ul className="list-group">
        <li
          key="-1"
          role="button"
          className={
            currentCategory ? "list-group-item" : "list-group-item bg-warning"
          }
          onClick={() => onSelect(null)}
        >
          All
        </li>
        {categories.map((c, index) => (
          <li
            key={c.id}
            role="button"
            className={
              // == is used here to compare 1 and "1"
              currentCategory == c.id
                ? "list-group-item bg-warning"
                : "list-group-item"
            }
            onClick={() => onSelect(c.id)}
          >
            <div className="d-flex flex-row justify-content-between">
              {c.name}
              <div>
                {permissions.includes("role:admin") && (
                  <button
                    className=" btn btn-light btn-sm  p-1 me-1"
                    title="Edit Category"
                    onClick={() => {
                      onEdit(c.id)
                    }}
                  >
                    <img src="/edit-red.svg" width="18" alt="edit" />
                  </button>
                )}
                {permissions.includes("delete:categories") && (
                  <button
                    className=" btn btn-light btn-sm  p-1"
                    title="Delete Category"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(c.id)
                    }}
                  >
                    <img src="/trash-can-red.svg" width="18" alt="delete" />
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}

export default CategoryList
