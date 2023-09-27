import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

import axios from "axios";
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import { randomId } from "@mui/x-data-grid-generator";
import { useEffect, useState } from "react";
import ApiCalls from "../API/ApiCalls";

function EditToolbar(props) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = randomId();
    setRows((oldRows) => [
      ...oldRows,
      {
        id,
        InvoiceNumber: "",
        Particulars: "",
        PaymentType: "",
        Amount: "",
        CGST: 0,
        SGST: 0,
        IGST: 0,
        TotalAmount: "",
        isNew: true,
      },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "Particulural" },
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

export default function ExpenseRecord() {
  const [open, setOpen] = React.useState(false);
  const [deleteid, setDeleteId] = useState(0);
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [actionTake, setActionTake] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const handleDelete = (id) => {
    ApiCalls.deleteSingleExpense(id)
      .then((res) => window.alert("deleted"))
      .catch((err) => console.log(err));
    setOpen(false);
    window.location.reload();
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    axios
      .get(`/getexpensedetails`)
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
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    setDeleteId(id);
    setOpen(true);
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
    if (
      newRow.InvoiceNumber == "" ||
      newRow.Particulars == "" ||
      newRow.Amount == null ||
      newRow.PaymentType == "" ||
      newRow.DueDate == null
    ) {
      alert(`Mandatory fields should not be empty`);
    } else {
      const totalvalue =
        (newRow.CGST / 100) * newRow.Amount +
        (newRow.SGST / 100) * newRow.Amount +
        (newRow.IGST / 100) * newRow.Amount +
        newRow.Amount;
      const updatedRow = {
        ...newRow,
        TotalAmount: totalvalue,
        isNew: false,
      };
      newRow.TotalAmount = totalvalue;

      if (actionTake) {
        ApiCalls.updateExpense(newRow.id, newRow)
          .then((res) => window.alert("Row Updated"))
          .catch((err) => window.alert("Oops error occured"));
        window.location.reload();
      } else {
        axios
          .post("/addexpense", newRow)
          .then((res) => console.log(res))
          .catch((err) => console.log(err));
        window.location.reload();
      }
      return updatedRow;
    }
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    {
      field: "InvoiceNumber",
      headerName: (
        <div>
          <b>Invoice Number </b>
          <span style={{ color: "red" }}>*</span>
        </div>
      ),
      width: 120,
      editable: true,
    },
    {
      field: "Particulars",
      headerName: (
        <div>
          <b>Particulars </b>
          <span style={{ color: "red" }}>*</span>
        </div>
      ),
      width: 120,
      editable: true,
    },
    {
      field: "Amount",
      headerName: (
        <div>
          <b>Amount </b>
          <span style={{ color: "red" }}>*</span>
        </div>
      ),
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
      renderCell: (params) => {
        const value = params.value || 0;
        return (
          <span>
            <b>{value}</b>
          </span>
        );
      },
    },
    {
      field: "PaymentType",
      headerName: (
        <div>
          <b>Payment Type </b>
          <span style={{ color: "red" }}>*</span>
        </div>
      ),
      width: 140,
      editable: true,
      type: "singleSelect",
      valueOptions: ["Direct", "Indirect"],
    },
    {
      field: "DueDate",
      headerName: (
        <div>
          <b>DueDate </b>
          <span style={{ color: "red" }}>*</span>
        </div>
      ),
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
      field: "ActionDate",
      headerName: (
        <div>
          <b>ActionDate </b>
          <span style={{ color: "red" }}>*</span>
        </div>
      ),
      type: "date",
      width: 120,
      align: "left",
      headerAlign: "left",
      editable: true,
      valueGetter: (params) => {
        const actionDate = params.row.ActionDate;
        if (actionDate === null || actionDate === undefined) {
          return new Date();
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
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            Are you sure want to delete the record?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ color: "red" }}
            autoFocus
            onClick={() => handleDelete(deleteid)}
          >
            Yes
          </Button>
          <Button onClick={handleClose} autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
