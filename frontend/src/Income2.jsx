import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import axios from "axios";
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import { randomCreatedDate, randomId } from "@mui/x-data-grid-generator";
import { useEffect, useState, useRef } from "react";
let initialRows = [];

function EditToolbar(props) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = randomId();
    setRows((oldRows) => [
      ...oldRows,
      {
        id,
        From: "",
        Items: "",
        Prt: "",
        CGST: "",
        SGST: "",
        Amount: "",
        Status: "",
        isNew: true,
      },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button
        color="secondary"
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleClick}
      >
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

export default function Income2() {
  const [rows, setRows] = useState(initialRows);
  const [rowModesModel, setRowModesModel] = useState({});
  const [actionTake, setActionTake] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    axios
      .get(`/getincomedetails`)
      .then((res) => setRows(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setActionTake(true);
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    console.log(rowModesModel);
    console.log(id);
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow) => {
    const totalvalue =
      (newRow.CGST / newRow.Amount) * 100 +
      (newRow.SGST / newRow.Amount) * 100 +
      (newRow.IGST / newRow.Amount) * 100 +
      newRow.Amount;
    const updatedRow = {
      ...newRow,
      TotalAmount: totalvalue,
      isNew: false,
    };
    newRow.TotalAmount = totalvalue;

    // setRows(
    //   rows.map((row) =>
    //     row.id === newRow.id ? console.log(updatedRow) : console.log(row)
    //   )
    // );
    // console.log(rows.filter((row) => row.id === newRow.id));
    // rows.map((row) => row.id === newRow.id && updaterow());
    // console.log(rows.includes(newRow.id));
    if (actionTake) {
      axios
        .put(`/updateincome/${newRow.id}`, newRow)
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    } else {
      axios
        .post("/addincome", newRow)
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
      window.location.reload();
    }
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    { field: "From", headerName: "From", width: 120, editable: true },
    {
      field: "Items",
      headerName: "Items",
      width: 180,
      editable: true,
    },
    {
      field: "DueDate",
      headerName: "DueDate",
      type: "date",
      width: 120,
      align: "left",
      headerAlign: "left",
      editable: true,
      valueGetter: (params) => {
        const dueDate = params.row.DueDate;
        if (dueDate === null || dueDate === undefined) {
          return null;
        }
        return new Date(dueDate);
      },
      min: { today },
    },

    {
      field: "Prt",
      headerName: "Prt",
      width: 100,
      editable: true,
    },
    {
      field: "Amount",
      headerName: "Amount",
      type: "number",
      width: 80,
      editable: true,
    },
    {
      field: "CGST",
      headerName: "CGST %",
      type: "number",
      width: 80,
      editable: true,
    },
    {
      field: "SGST",
      headerName: "SGST %",
      type: "number",
      width: 80,
      editable: true,
    },
    {
      field: "IGST",
      headerName: "IGST %",
      type: "number",
      width: 80,
      editable: true,
    },
    {
      field: "TotalAmount",
      headerName: "TotalAmount",
      type: "number",
      width: 100,
      editable: true,
    },
    {
      field: "Status",
      headerName: "Status",
      width: 100,
      editable: true,
      type: "singleSelect",
      valueOptions: ["Paid", "UnPaid", "Overdue"],
    },
    {
      field: "ActionDate",
      headerName: "ActionDate",
      type: "date",
      width: 120,
      align: "left",
      headerAlign: "left",
      editable: true,
      valueGetter: (params) => {
        const actionDate = params.row.ActionDate;
        if (actionDate === null || actionDate === undefined) {
          return null;
        }
        return new Date(actionDate);
      },
      min: { today },
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",

      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon sx={{ color: "secondary" }} />}
              label="Save"
              sx={{
                color: "secondary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon sx={{ color: "secondary" }} />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon sx={{ color: "secondary" }} />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon sx={{ color: "secondary" }} />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            sx={{
              color: "secondary.main",
            }}
          />,
        ];
      },
    },
  ];

  return (
    <Box
      sx={{
        height: 500,
        width: "100%",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar,
        }}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
      />
    </Box>
  );
}
