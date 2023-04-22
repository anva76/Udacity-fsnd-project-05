import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "../stylesheets/EditModal.css"

const EditModal = ({
  obj,
  editMap,
  onClose,
  onSubmit,
  title = "Modal Form",
}) => {
  const [editObject, setEditObject] = useState({ ...obj })

  const renderEditControl = (prop, value, index) => {
    if (editMap[prop])
      if (editMap[prop].control != "textarea") {
        return (
          <div className="row" key={index}>
            <div className="mb-3">
              <label className="form-label text-secondary">
                {editMap[prop].label}
              </label>
              <input
                type={editMap[prop].control}
                className="form-control"
                onChange={handleChange}
                name={prop}
                value={value ? value : ""}
              />
            </div>
          </div>
        )
      } else {
        return (
          <div className="row" key={index}>
            <div className="mb-3">
              <label className="form-label text-secondary">
                {editMap[prop].label}
              </label>
              <textarea
                type={editMap[prop].control}
                className="form-control"
                onChange={handleChange}
                name={prop}
                value={value ? value : ""}
                rows="3"
              />
            </div>
          </div>
        )
      }
  }

  const handleChange = (e) => {
    if (e.target.type == "number") {
      setEditObject({
        ...editObject,
        [e.target.name]: parseFloat(e.target.value),
      })
    } else {
      setEditObject({ ...editObject, [e.target.name]: e.target.value })
    }
    //console.log(editObject)
  }

  const trimStrings = () => {
    for (let prop in editObject) {
      if (editMap[prop])
        if (
          editMap[prop].control == "text" ||
          editMap[prop].control == "tel" ||
          editMap[prop].control == "phone"
        ) {
          const tmpValue = editObject[prop].trim()
          setEditObject({ ...editObject, [prop]: tmpValue })
        }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    trimStrings()
    console.log(editObject)
    onSubmit(editObject)
  }

  return (
    <>
      <div className="modal-overlay"></div>
      <div className="modal d-block modal-lg">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              <form className="row" onSubmit={handleSubmit}>
                {editObject &&
                  Object.keys(editMap).map((prop, index) =>
                    renderEditControl(prop, editObject[prop], index)
                  )}
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

export default EditModal
