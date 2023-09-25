import React from "react";

export default function Create() {
  return (
    <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
      <div className="w-50 bg-white rounded p-3">
        <form>
          <h2>Add Income</h2>
          <div className="mb-2">
            <label htmlFor="">From</label>
            <input
              type="text"
              placeholder="Enter Name"
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="">DueDate</label>
            <input
              type="date"
              placeholder="Enter Name"
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="">From</label>
            <input
              type="date"
              placeholder="Enter Name"
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="">Amount</label>
            <input
              type="number"
              placeholder="Enter Name"
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="">CGST</label>
            <input
              type="date"
              placeholder="Enter Name"
              className="form-control"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
