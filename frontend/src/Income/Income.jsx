import * as React from "react";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import DownloadIcon from "@mui/icons-material/Download";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import Moment from "react-moment";
import moment from "moment";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import { Grid } from "@mui/material";
import axios from "axios";

import {
  GridRowModes,
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import ApiCalls from "../API/ApiCalls";
const currentYear = new Date().getFullYear();
const nextYear = currentYear + 1;
const lastTwoDigitsCurrentYear = currentYear % 100;
const lastTwoDigitsNextYear = nextYear % 100;

export default function Income2() {
  const [open, setOpen] = React.useState(false);
  const [deleteopen, setdeleteOpen] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [deleteid, setDeleteId] = useState(0);
  const [rows, setRows] = useState([]);

  let updatedrow = [];

  const [rowModesModel, setRowModesModel] = useState({});
  const [actionTake, setActionTake] = useState(false);
  const [paymentreceipt, setPaymentReceipt] = useState(false);
  const [adddetails, setAddDetails] = useState({
    InvoiceNumber: "",
    CompanyName: "",
    StreetAddress: "",
    City: "",
    Pincode: "",
    State: "",
    PlaceofSupply: "",
    Particulars: "",
    PSYear: "23-24",
    Items: "",
    HSNSAC: "",
    Rate: "",
    CGST: "",
    SGST: "",
    IGST: "",
    Status: "",
    DueDate: "",
    ActionDate: "",
    GSTIN: "",
    TotalAmount: 0,
    BalanceDue: 0,
  });
  const today = new Date().toISOString().split("T")[0];

  const handleaddIncome = () => {
    if (
      adddetails.CompanyName == "" ||
      adddetails.StreetAddress == "" ||
      adddetails.City == "" ||
      adddetails.State == "" ||
      adddetails.Pincode == null ||
      adddetails.PlaceofSupply == "" ||
      adddetails.GSTIN == "" ||
      adddetails.Particulars == "" ||
      adddetails.Items == "" ||
      adddetails.HSNSAC == "" ||
      adddetails.Rate == null ||
      adddetails.DueDate == null ||
      adddetails.ActionDate == null ||
      adddetails.Status == ""
    ) {
      alert(`Mandatory fields should not be empty`);
    } else {
      const total =
        (adddetails.CGST / 100) * adddetails.Rate +
        (adddetails.SGST / 100) * adddetails.Rate +
        (adddetails.IGST / 100) * adddetails.Rate +
        adddetails.Rate;
      setAddDetails({
        ...adddetails,
        TotalAmount: total,
        BalanceDue: total,
      });
      if (actionTake) {
        console.log(typeof adddetails.DueDate);
        ApiCalls.updateIncome(adddetails.id, {
          ...adddetails,
          TotalAmount: total,
          BalanceDue: total,
          // DueDate: adddetails.DueDate.add(1, "days"),
          // ActionDate: adddetails.ActionDate.add(1, "days"),
        })
          .then((res) => {
            if (res.status == 200 || 201) {
              window.alert("Income Updated Successfully");
              window.location.reload();
            }
          })
          .catch((err) => window.alert("Sorry!Try Again"));
      } else {
        ApiCalls.addIncome({
          ...adddetails,
          TotalAmount: total,
          BalanceDue: total,
          DueDate: adddetails.DueDate.add(1, "days"),
          ActionDate: adddetails.ActionDate.add(1, "days"),
        })
          .then((res) => {
            if (res.status == 200 || 201) {
              window.alert("Income Created Successfully");
              window.location.reload();
            }
          })
          .catch((err) => window.alert("Sorry!Try Again"));
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    window.location.reload();
  };
  const handleDeleteClose = () => {
    setdeleteOpen(false);
    window.location.reload();
  };
  const handleClick = () => {
    setOpen(true);
  };

  useEffect(() => {
    axios
      .get(`/getincomedetails`)
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
      DueDate: new Date(updatedrow[0].DueDate).toISOString().split("T")[0],
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
    ApiCalls.deleteSingleIncome(id)
      .then((res) => {
        if (res.status == 300 || 301) {
          window.alert("Income deleted");
          window.location.reload();
        }
      })
      .catch((err) => window.alert("Sorry!Try Again"));
  };
  const handleDownloadClick = (id) => {
    ApiCalls.donwloadInvoice(id)
      .then((res) => {
        if (res.status == 200 || 201) {
          window.alert("Download success");
        }
      })
      .catch((err) => console.log("error"));
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
      field: "CompanyName",
      headerName: (
        <div>
          <b>Company Name </b>
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
          <b>Particulars</b>
        </div>
      ),
      width: 120,
      editable: true,
      headerClassName: "super-app-theme--header",
    },

    {
      field: "Rate",
      headerName: (
        <div>
          <b>Rate</b>
        </div>
      ),
      type: "number",
      width: 100,
      editable: true,
      headerAlign: "left",
      headerClassName: "super-app-theme--header",
      headerAlign: "left",
      align: "left",
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
      field: "CGST",
      headerName: (
        <div>
          <b>CGST % </b>
        </div>
      ),
      type: "number",
      width: 80,
      editable: true,
      headerClassName: "super-app-theme--header",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "SGST",
      headerName: (
        <div>
          <b>SGST % </b>
        </div>
      ),
      type: "number",
      width: 80,
      editable: true,
      headerClassName: "super-app-theme--header",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "IGST",
      headerName: (
        <div>
          <b>IGST % </b>
        </div>
      ),
      type: "number",
      width: 80,
      editable: true,
      headerClassName: "super-app-theme--header",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "TotalAmount",
      headerName: (
        <div>
          <b>Total Amount</b>
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
      headerAlign: "left",
      align: "left",
    },
    {
      field: "BalanceDue",
      headerName: (
        <div>
          <b>Balance Due</b>
        </div>
      ),
      type: "number",
      width: 120,
      editable: true,
      headerClassName: "super-app-theme--header",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "Status",
      headerName: (
        <div>
          <b>Status</b>
        </div>
      ),
      width: 100,
      editable: true,
      type: "singleSelect",
      renderCell: (params) => {
        const value = params.value;
        if (params.value == "Paid") {
          setPaymentReceipt(true);
        }
        let color = "green";
        if (params.value == "UnPaid" || "Overdue" || "Declined") {
          color = "red";
        } else {
          color = "";
        }

        return (
          <span
            style={{
              color:
                value == "UnPaid" || value == "Overdue" || value == "Declined"
                  ? "red"
                  : "green",
            }}
          >
            {value}
          </span>
        );
      },
      headerClassName: "super-app-theme--header",
    },
    {
      field: "ActionDate",
      headerName: (
        <div>
          <b>Action Date</b>
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
          <GridActionsCellItem
            icon={<DownloadIcon sx={{ color: "#676767" }} />}
            label="Delete"
            onClick={() => handleDownloadClick(id)}
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
        sx={{ background: "#FBC91B", marginBottom: "50px" }}
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleClick}
      >
        Add record
      </Button>

      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
        columnBuffer={5}
      />
      <Dialog
        fullWidth={fullWidth}
        maxWidth="md"
        open={open}
        onClose={handleClose}
      >
        <DialogContent fullWidth>
          <DialogContentText sx={{ fontWeight: 800 }}>
            Add Income Details
          </DialogContentText>
          <Grid container lg={12} sx={{ display: "flex" }}>
            <Grid item lg={4}>
              <TextField
                id="filled-basic"
                label={
                  <span>
                    Company Name <span style={{ color: "red" }}>*</span>
                  </span>
                }
                variant="filled"
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    CompanyName: e.target.value,
                  })
                }
                sx={{ marginBottom: "28px" }}
                value={adddetails.CompanyName}
              />

              <TextField
                id="standard-number"
                label={<span style={{ marginTop: -20 }}>Pincode</span>}
                type="number"
                variant="standard"
                sx={{ marginBottom: "20px", width: 218 }}
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    Pincode: Number(e.target.value),
                  })
                }
                value={adddetails.Pincode}
              />
              <TextField
                id="filled-basic"
                label={<span>GSTIN</span>}
                variant="filled"
                sx={{ marginBottom: "20px" }}
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    GSTIN: e.target.value,
                  })
                }
                value={adddetails.GSTIN}
              />
              <TextField
                id="filled-basic"
                label={<span>Items</span>}
                variant="filled"
                sx={{ marginBottom: "20px" }}
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    Items: e.target.value,
                  })
                }
                value={adddetails.Items}
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
                  Status <span style={{ color: "red" }}>*</span>
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={adddetails.Status}
                  label="Status"
                  onChange={(e) =>
                    setAddDetails({
                      ...adddetails,
                      Status: e.target.value,
                    })
                  }
                >
                  <MenuItem value={"Paid"}>Paid</MenuItem>
                  <MenuItem value={"UnPaid"}>UnPaid</MenuItem>
                  <MenuItem value={"Overdue"}>Over Due</MenuItem>
                  <MenuItem value={"Declined"}>Declined</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item lg={4}>
              <TextField
                id="filled-basic"
                label={<span>Street Address</span>}
                variant="filled"
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    StreetAddress: e.target.value,
                  })
                }
                sx={{ marginBottom: "20px" }}
                value={adddetails.StreetAddress}
              />
              <TextField
                id="filled-basic"
                label={<span>State</span>}
                variant="filled"
                sx={{ marginBottom: "20px" }}
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    State: e.target.value,
                  })
                }
                value={adddetails.State}
              />
              <TextField
                id="filled-basic"
                label={<span>Particulars</span>}
                variant="filled"
                sx={{ marginBottom: "28px" }}
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    Particulars: e.target.value,
                  })
                }
                value={adddetails.Particulars}
              />
              <TextField
                id="standard-number"
                label={<span>HSNSAC</span>}
                type="number"
                variant="standard"
                sx={{ marginBottom: "20px", width: 218 }}
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    HSNSAC: Number(e.target.value),
                  })
                }
                value={adddetails.HSNSAC || ""}
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
                  sx={{ m: 1, width: 200 }}
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
                id="filled-basic"
                label={<span>City</span>}
                variant="filled"
                sx={{ marginBottom: "20px" }}
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    City: e.target.value,
                  })
                }
                value={adddetails.City}
              />
              <TextField
                id="filled-basic"
                label={<span>Place of Supply</span>}
                variant="filled"
                sx={{ marginBottom: "20px" }}
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    PlaceofSupply: e.target.value,
                  })
                }
                value={adddetails.PlaceofSupply}
              />
              <TextField
                id="filled-basic"
                label={<span>PS Year</span>}
                variant="filled"
                sx={{ marginBottom: "28px" }}
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    PSYear: e.target.value,
                  })
                }
                value={adddetails.PSYear}
              />
              <TextField
                id="standard-number"
                label={<span>Rate</span>}
                type="number"
                variant="standard"
                sx={{ marginBottom: "20px", width: 218 }}
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    Rate: Number(e.target.value),
                  })
                }
                value={Number(adddetails.Rate) || ""}
              />
              <TextField
                id="standard-number"
                label={<span>IGST %</span>}
                type="number"
                variant="standard"
                sx={{ marginBottom: "25px", width: 218 }}
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
                      {moment(adddetails.ActionDate).format("YYYY-MM-DD")}
                    </span>
                  }
                  sx={{ m: 1, width: 200 }}
                  onChange={(e) =>
                    setAddDetails({
                      ...adddetails,
                      ActionDate: e,
                    })
                  }
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
            onClick={() => handleaddIncome()}
          >
            {actionTake ? "UPDATE" : "ADD"}
          </Button>
          <Button onClick={handleClose} autoFocus>
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
          <Button onClick={handleDeleteClose} autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
