import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import Moment from "react-moment";
import moment from "moment";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { Grid } from "@mui/material";

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

export default function ExpenseRecord() {
  const [open, setOpen] = React.useState(false);
  const [deleteopen, setdeleteOpen] = React.useState(false);
  const [deleteid, setDeleteId] = useState(0);
  let updatedrow = [];
  const [rows, setRows] = useState([]);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [rowModesModel, setRowModesModel] = useState({});
  const [actionTake, setActionTake] = useState(false);
  const [adddetails, setAddDetails] = useState({
    InvoiceNumber: "",
    Particulars: "",
    Amount: "",
    CGST: "",
    SGST: "",
    IGST: "",
    PaymentType: "",
    DueDate: "",
    ActionDate: "",

    TotalAmount: 0,
    BalanceDue: 0,
  });

  const today = new Date().toISOString().split("T")[0];

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    window.location.reload();
  };
  const handleDeleteClose = () => {
    setdeleteOpen(false);
    window.location.reload();
  };
  const handleaddExpense = () => {
    if (
      adddetails.InvoiceNumber == "" ||
      adddetails.Particulars == "" ||
      adddetails.Amount == null ||
      adddetails.DueDate == null ||
      adddetails.ActionDate == null ||
      adddetails.PaymentType == ""
    ) {
      alert(`Mandatory fields should not be empty`);
    } else {
      const total =
        (adddetails.CGST / 100) * adddetails.Amount +
        (adddetails.SGST / 100) * adddetails.Amount +
        (adddetails.IGST / 100) * adddetails.Amount +
        adddetails.Amount;
      setAddDetails({
        ...adddetails,
        TotalAmount: total,
        BalanceDue: total,
      });
      if (actionTake) {
        console.log("due date update" + adddetails.DueDate);
        console.log(typeof adddetails.DueDate);
        const duedate = new Date(adddetails.DueDate);
        const actiondate = new Date(adddetails.ActionDate);
        ApiCalls.updateExpense(adddetails.id, {
          ...adddetails,
          TotalAmount: total,
          BalanceDue: total,
          // DueDate: duedate.setDate(duedate.getDate() + 1),
          // Actiondate: actiondate.setDate(actiondate.getDate() + 1),
          // DueDate: adddetails.DueDate.add(1, "days"),
          // ActionDate: adddetails.ActionDate.add(1, "days"),
        })
          .then((res) => {
            if (res.status == 200 || 201) {
              window.alert("Expense Updated Successfully");
              window.location.reload();
            }
          })
          .catch((err) => window.alert("Sorry!Try Again"));
      } else {
        console.log("add api");
        console.log(typeof adddetails.DueDate);
        console.log(adddetails.DueDate + "add due date");
        ApiCalls.addExpense({
          ...adddetails,
          TotalAmount: total,
          BalanceDue: total,
          DueDate: adddetails.DueDate.add(1, "days"),
          ActionDate: adddetails.ActionDate.add(1, "days"),
        })
          .then((res) => {
            if (res.status == 200 || 201) {
              window.alert("Expense Created Successfully");
              window.location.reload();
            }
          })
          .catch((err) => window.alert("Sorry!Try Again"));
      }
    }
  };

  useEffect(() => {
    axios
      .get(`/getexpensedetails`)
      .then((res) => setRows(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleEditClick = (id) => {
    setActionTake(true);
    setOpen(true);
    updatedrow = rows.filter((e) => e.id == id);
    console.log(updatedrow[0].ActionDate);
    console.log(new Date(updatedrow[0].ActionDate).toISOString().split("T")[0]);
    setAddDetails({
      ...updatedrow[0],
      ActionDate: new Date(updatedrow[0].ActionDate)
        .toISOString()
        .split("T")[0],
    });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setdeleteOpen(true);
  };

  const handleDelete = (id) => {
    ApiCalls.deleteSingleExpense(id)
      .then((res) => {
        if (res.status == 300 || 301) {
          window.alert("Expense deleted");
          window.location.reload();
        }
      })
      .catch((err) => window.alert("Sorry!Try Again"));
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

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    {
      field: "InvoiceNumber",
      headerName: (
        <div>
          <b>Invoice Number </b>
        </div>
      ),
      width: 140,
      editable: true,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "Particulars",
      headerName: (
        <div>
          <b>Particulars </b>
        </div>
      ),
      width: 130,
      editable: true,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "Amount",
      headerName: (
        <div>
          <b>Amount </b>
        </div>
      ),
      type: "number",
      width: 100,
      editable: true,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "CGST",
      headerName: (
        <div>
          <b>CGST % </b>
        </div>
      ),
      type: "number",
      width: 100,
      editable: true,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "SGST",
      headerName: (
        <div>
          <b>SGST % </b>
        </div>
      ),
      type: "number",
      width: 100,
      editable: true,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "IGST",
      headerName: (
        <div>
          <b>IGST % </b>
        </div>
      ),
      type: "number",
      width: 100,
      editable: true,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "TotalAmount",
      headerName: (
        <div>
          <b>Total Amount </b>
        </div>
      ),
      type: "number",
      width: 120,
      editable: true,
      renderCell: (params) => {
        const value = params.value || 0;
        return (
          <span>
            <b>{value}</b>
          </span>
        );
      },
      headerClassName: "super-app-theme--header",
    },
    {
      field: "PaymentType",
      headerName: (
        <div>
          <b>Payment Type </b>
        </div>
      ),
      width: 140,
      editable: true,
      type: "singleSelect",
      valueOptions: ["Direct", "Indirect"],
      headerClassName: "super-app-theme--header",
    },
    {
      field: "DueDate",
      headerName: (
        <div>
          <b>DueDate </b>
        </div>
      ),
      type: "date",
      width: 120,
      align: "left",
      headerAlign: "left",
      editable: true,
      valueGetter: (params) => {
        console.log(params.row.duedate + "due date");
        const dueDate = params.row.DueDate;
        if (dueDate === null || dueDate === undefined) {
          return null;
        }
        return new Date(dueDate);
      },
      min: { today },
      headerClassName: "super-app-theme--header",
    },

    {
      field: "ActionDate",
      headerName: (
        <div>
          <b>ActionDate </b>
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

      headerClassName: "super-app-theme--header",
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      headerClassName: "super-app-theme--header",

      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon sx={{ color: "#676767" }} />}
              label="Save"
              sx={{
                color: "#676767",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon sx={{ color: "#676767" }} />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon sx={{ color: "#676767" }} />}
            label="Edit"
            className="textPrimary"
            onClick={() => handleEditClick(id)}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon sx={{ color: "#676767" }} />}
            label="Delete"
            onClick={() => handleDeleteClick(id)}
            sx={{
              color: "#676767",
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
        "& .super-app-theme--header": {
          backgroundColor: "#676767",
          color: "white",
          fontSize: "17px",
        },
      }}
    >
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleClick}
        sx={{ marginBottom: "50px", background: "#FBC91B" }}
      >
        Add record
      </Button>
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
      />
      <Dialog
        fullWidth={fullWidth}
        maxWidth="md"
        open={open}
        onClose={handleClose}
      >
        <DialogContent fullWidth>
          <DialogContentText sx={{ fontWeight: 800 }}>
            Add Expense Details
          </DialogContentText>
          <Grid container lg={12} sx={{ display: "flex" }}>
            <Grid item lg={4}>
              <TextField
                id="filled-basic"
                label={<span>Invoice Number</span>}
                variant="filled"
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    InvoiceNumber: e.target.value,
                  })
                }
                sx={{ marginBottom: "28px" }}
                value={adddetails.InvoiceNumber}
              />
              <TextField
                id="standard-number"
                label={<span>CGST %</span>}
                type="number"
                variant="standard"
                sx={{ marginBottom: "25px", width: 218 }}
                className="red-asterisk"
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    CGST: Number(e.target.value),
                  })
                }
                value={Number(adddetails.CGST) || ""}
              />
              <FormControl sx={{ m: 1, minWidth: 220 }}>
                <InputLabel id="demo-simple-select-label">
                  PaymentType <span style={{ color: "red" }}>*</span>
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={adddetails.PaymentType}
                  label="Status"
                  onChange={(e) =>
                    setAddDetails({
                      ...adddetails,
                      PaymentType: e.target.value,
                    })
                  }
                >
                  <MenuItem value={"Direct"}>Direct</MenuItem>
                  <MenuItem value={"Indirect"}>InDirect</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item lg={4}>
              <TextField
                id="filled-basic"
                label={<span>Particulars</span>}
                variant="filled"
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    Particulars: e.target.value,
                  })
                }
                sx={{ marginBottom: "26px" }}
                value={adddetails.Particulars}
              />

              <TextField
                id="standard-number"
                label={
                  <span>
                    SGST % <span style={{ color: "red" }}>*</span>
                  </span>
                }
                type="number"
                variant="standard"
                sx={{ marginBottom: "25px", width: 218 }}
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    SGST: Number(e.target.value),
                  })
                }
                value={Number(adddetails.SGST) || ""}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label={
                    <span>
                      {actionTake
                        ? moment(adddetails.DueDate).format("YYYY-MM-DD")
                        : "Due Date"}
                    </span>
                  }
                  sx={{ m: 1, width: 200, marginTop: "10px" }}
                  onChange={(e) =>
                    setAddDetails({
                      ...adddetails,
                      DueDate: e,
                    })
                  }
                />
              </LocalizationProvider>
            </Grid>
            <Grid item lg={4}>
              <TextField
                id="standard-number"
                label={<span>Amount</span>}
                type="number"
                variant="standard"
                sx={{ marginTop: "10px", marginBottom: "26px", width: 218 }}
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    Amount: Number(e.target.value),
                  })
                }
                value={adddetails.Amount || ""}
              />

              <TextField
                id="standard-number"
                label={<span>IGST %</span>}
                type="number"
                variant="standard"
                sx={{ marginBottom: "26px", width: 218 }}
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    IGST: Number(e.target.value),
                  })
                }
                value={Number(adddetails.IGST) || ""}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label={
                    <span>
                      {actionTake
                        ? moment(adddetails.ActionDate).format("YYYY-MM-DD")
                        : "Action Date"}
                    </span>
                  }
                  sx={{ m: 1, width: 200 }}
                  onChange={(e) =>
                    setAddDetails({
                      ...adddetails,
                      ActionDate: e,
                    })
                  }
                  // value={moment(adddetails.ActionDate).format("YYYY-MM-DD")}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            sx={{ background: "#FBC91B" }}
            variant="contained"
            onClick={() => handleaddExpense()}
          >
            {actionTake ? "UPDATE" : "ADD"}
          </Button>
          <Button onClick={() => handleClose()} autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={deleteopen}
        onClose={handleDeleteClose}
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
          <Button onClick={() => handleDeleteClose()} autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
