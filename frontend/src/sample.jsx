import React, { useState } from "react";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";

function CustomCGSTCellEditor(props) {
  const { value, onValueChange } = props;

  const handlePercentageChange = (event) => {
    onValueChange({
      ...value,
      cgstPercentage: event.target.value,
    });
  };

  const handleTypeChange = (event) => {
    onValueChange({
      ...value,
      cgstType: event.target.value,
    });
  };

  return (
    <div>
      <input
        type="number"
        value={value.cgstPercentage}
        onChange={handlePercentageChange}
        placeholder="Percentage"
      />
      <input
        type="text"
        value={value.cgstType}
        onChange={handleTypeChange}
        placeholder="Type"
      />
    </div>
  );
}

export default function CustomCGSTColumn() {
  const [rows, setRows] = useState([
    {
      id: 1,
      "CGST %": {
        cgstPercentage: "",
        cgstType: "",
      },
    },
    {
      id: 2,
      "CGST %": {
        cgstPercentage: "",
        cgstType: "",
      },
    },
  ]);

  const handleCellValueChange = (params: GridCellParams) => {
    setRows((prevRows) => {
      const updatedRows = [...prevRows];
      const rowIndex = updatedRows.findIndex((row) => row.id === params.id);
      updatedRows[rowIndex]["CGST %"] = params.value;
      return updatedRows;
    });
  };

  const columns = [
    {
      field: "CGST %",
      headerName: "CGST %",
      width: 200,
      editable: true,
      renderEditCell: (params) => (
        <CustomCGSTCellEditor
          value={params.value || { cgstPercentage: "", cgstType: "" }}
          onValueChange={(newValue) => {
            params.api.setEditCellValue({
              id: params.id,
              field: params.field,
              value: newValue,
            });
          }}
        />
      ),
    },
  ];

  return (
    <div style={{ height: 200, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        onEditCellChangeCommitted={handleCellValueChange}
      />
    </div>
  );
}
