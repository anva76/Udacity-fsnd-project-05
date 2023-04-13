import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import config from "../config"

const CategoryList = ({ categories, currentCategory, onSelect }) => {
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
        {categories.map((cat, index) => (
          <li
            key={cat.id}
            role="button"
            className={
              // == is used here to compare 1 and "1"
              currentCategory == cat.id
                ? "list-group-item bg-info"
                : "list-group-item"
            }
            onClick={() => onSelect(cat.id)}
          >
            {cat.name}
          </li>
        ))}
      </ul>
    </>
  )
}

export default CategoryList
