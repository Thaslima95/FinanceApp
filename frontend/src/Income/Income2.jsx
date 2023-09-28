import * as React from "react";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import DialogTitle from "@mui/material/DialogTitle";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
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
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import { randomId } from "@mui/x-data-grid-generator";
import { useEffect, useState } from "react";
import ApiCalls from "../API/ApiCalls";
import Popup2 from "./Popup2";
const currentYear = new Date().getFullYear();

const nextYear = currentYear + 1;
const lastTwoDigitsCurrentYear = currentYear % 100;
const lastTwoDigitsNextYear = nextYear % 100;

// function EditToolbar(props) {
//   const { setRows, setRowModesModel } = props;

//   const handleClick = () => {
//     const id = randomId();
//     setOpen(true);
//   };

//   return (

//   );
// }

export default function Income2() {
  const [open, setOpen] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("sm");
  const [age, setAge] = React.useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const [deleteid, setDeleteId] = useState(0);
  const [updaterow, setUpdateRow] = useState({});
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [actionTake, setActionTake] = useState(false);
  const [adddetails, setAddDetails] = useState({
    CompanyName: "",
    StreetAddress: "",
    City: "",
    Pincode: "",
    State: "",
    PlaceofSupply: "",
    GSTIN: "A56Af",
    Particulars: "",
    PSYear: "23-24",
    Items: "",
    HSNSAC: 0,
    Rate: 0,
    CGST: 0,
    SGST: 0,
    IGST: 0,
    Status: "",
    DueDate: "",
    ActionDate: "",
    GSTN: "",
    TotalAmount: 0,
    BalanceDue: 0,
  });
  const [companyName, setCompanyName] = useState("");
  const today = new Date().toISOString().split("T")[0];
  console.log(adddetails);
  const handleDelete = (id) => {
    console.log(adddetails);
    console.log(adddetails.DueDate);
    const total =
      (adddetails.CGST / 100) * adddetails.Rate +
      (adddetails.SGST / 100) * adddetails.Rate +
      (adddetails.IGST / 100) * adddetails.Rate +
      adddetails.Rate;
    setAddDetails({ ...adddetails, TotalAmount: total, BalanceDue: total });
    console.log(adddetails);
    ApiCalls.addIncome({ ...adddetails, TotalAmount: total, BalanceDue: total })
      .then((res) => {
        if (res.status == 200 || 201) {
          window.alert("Record Inserted Successfully");
          window.location.reload();
        }
      })
      .catch((err) => window.alert("Oops! some error occured"));
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleClick = () => {
    const id = randomId();
    setOpen(true);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleMaxWidthChange = (event) => {
    setMaxWidth(
      // @ts-expect-error autofill of arbitrary value is not handled.
      event.target.value
    );
  };

  const handleFullWidthChange = (event) => {
    setFullWidth(event.target.checked);
  };

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

  const handleEditClick = (id) => {
    setActionTake(true);
    setUpdateRow(rows.filter((e) => e.id == id));
    console.log(updaterow);
    setOpen(true);
    // return <Popup2 open={open} setOpen={setOpen} />;
    // setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    setDeleteId(id);
    // setOpen(true);
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
      newRow.CompanyName == "" ||
      newRow.StreetAddress == "" ||
      newRow.City == "" ||
      newRow.State == "" ||
      newRow.Pincode == null ||
      newRow.PlaceofSupply == "" ||
      newRow.GSTN == "" ||
      newRow.GSTIN == "" ||
      newRow.Particulars == "" ||
      newRow.Items == "" ||
      newRow.HSNSAC == "" ||
      newRow.Rate == null ||
      newRow.DueDate == null ||
      newRow.Status == ""
    ) {
      alert(`Mandatory fields should not be empty`);
    } else {
      const totalvalue =
        (newRow.CGST / 100) * newRow.Rate +
        (newRow.SGST / 100) * newRow.Rate +
        (newRow.IGST / 100) * newRow.Rate +
        newRow.Rate;
      const updatedRow = {
        ...newRow,
        TotalAmount: totalvalue,
        BalanceDue: totalvalue,
        isNew: false,
      };
      newRow.TotalAmount = totalvalue;
      newRow.BalanceDue = totalvalue;

      if (actionTake) {
        ApiCalls.updateIncome(newRow.id, newRow)
          .then((res) => {
            if (res.status == 200 || 201) {
              window.alert("Record Update Sucess");
              window.location.reload();
            }
          })
          .catch((err) => window.alert("Oops! some error occured"));
      } else {
        ApiCalls.addIncome(newRow)
          .then((res) => {
            if (res.status == 200 || 201) {
              window.alert("Record Inserted Successfully");
              window.location.reload();
            }
          })
          .catch((err) => window.alert("Oops! some error occured"));
      }
      return updatedRow;
    }
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    {
      field: "CompanyName",
      headerName: (
        <div>
          <b>Company Name </b>
          <span style={{ color: "red" }}>*</span>
        </div>
      ),
      width: 120,
      editable: true,
    },

    {
      field: "GSTN",
      headerName: (
        <div>
          <b>GSTN</b> <span style={{ color: "red" }}>*</span>
        </div>
      ),
      width: 120,
      editable: true,
    },
    {
      field: "Particulars",
      headerName: (
        <div>
          <b>Particulars</b> <span style={{ color: "red" }}>*</span>
        </div>
      ),
      width: 120,
      editable: true,
    },

    {
      field: "HSNSAC",
      headerName: (
        <div>
          <b>HSNSAC</b> <span style={{ color: "red" }}>*</span>
        </div>
      ),
      type: "number",
      width: 100,
      editable: true,
      renderCell: (params) => {
        const value = params.value || 0;
        return <span>{value}</span>;
      },
    },
    {
      field: "Rate",
      headerName: (
        <div>
          <b>Rate</b> <span style={{ color: "red" }}>*</span>
        </div>
      ),
      type: "number",
      width: 100,
      editable: true,
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
      field: "BalanceDue",
      headerName: "BalanceDue",
      type: "number",
      width: 100,
      editable: true,
    },
    {
      field: "Status",
      headerName: (
        <div>
          <b>Status</b> <span style={{ color: "red" }}>*</span>
        </div>
      ),
      width: 100,
      editable: true,
      type: "singleSelect",
      valueOptions: ["Paid", "UnPaid", "Overdue"],
      renderCell: (params) => {
        const value = params.value;
        let color = "";
        if (params.value == "UnPaid" || "Overdue") {
          color = "red";
        } else {
          color = "";
        }

        return (
          <span
            style={{
              color: (value == "UnPaid" || value == "Overdue") && "red",
            }}
          >
            {value}
          </span>
        );
      },
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
      <Button
        color="secondary"
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
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
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
              />

              <TextField
                id="standard-number"
                label={
                  <span style={{ marginTop: -20 }}>
                    Pincode<span style={{ color: "red" }}>*</span>
                  </span>
                }
                type="number"
                variant="standard"
                sx={{ marginBottom: "20px", width: 218 }}
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    Pincode: Number(e.target.value),
                  })
                }
              />
              <TextField
                id="filled-basic"
                label={
                  <span>
                    GSTN <span style={{ color: "red" }}>*</span>
                  </span>
                }
                variant="filled"
                sx={{ marginBottom: "20px" }}
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    GSTN: e.target.value,
                  })
                }
              />
              <TextField
                id="filled-basic"
                label={
                  <span>
                    Items <span style={{ color: "red" }}>*</span>
                  </span>
                }
                variant="filled"
                sx={{ marginBottom: "20px" }}
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    Items: e.target.value,
                  })
                }
              />
              <TextField
                id="standard-number"
                label={
                  <span>
                    CGST % <span style={{ color: "red" }}>*</span>
                  </span>
                }
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
                  <MenuItem value={"OverDue"}>Over Due</MenuItem>
                  <MenuItem value={"Declined"}>Declined</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item lg={4}>
              <TextField
                id="filled-basic"
                label={
                  <span>
                    Street Address <span style={{ color: "red" }}>*</span>
                  </span>
                }
                variant="filled"
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    StreetAddress: e.target.value,
                  })
                }
                sx={{ marginBottom: "20px" }}
              />
              <TextField
                id="filled-basic"
                label={
                  <span>
                    State <span style={{ color: "red" }}>*</span>
                  </span>
                }
                variant="filled"
                sx={{ marginBottom: "20px" }}
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    State: e.target.value,
                  })
                }
              />
              <TextField
                id="filled-basic"
                label={
                  <span>
                    Particulars <span style={{ color: "red" }}>*</span>
                  </span>
                }
                variant="filled"
                sx={{ marginBottom: "28px" }}
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    Particulars: e.target.value,
                  })
                }
              />
              <TextField
                id="standard-number"
                label={
                  <span>
                    HSNSAC <span style={{ color: "red" }}>*</span>
                  </span>
                }
                type="number"
                variant="standard"
                sx={{ marginBottom: "20px", width: 218 }}
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    HSNSAC: Number(e.target.value),
                  })
                }
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
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label={
                    <span>
                      Due Date <span style={{ color: "red" }}>*</span>
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
                label={
                  <span>
                    City <span style={{ color: "red" }}>*</span>
                  </span>
                }
                variant="filled"
                sx={{ marginBottom: "20px" }}
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    City: e.target.value,
                  })
                }
              />
              <TextField
                id="filled-basic"
                label={
                  <span>
                    Place of Supply<span style={{ color: "red" }}>*</span>
                  </span>
                }
                variant="filled"
                sx={{ marginBottom: "20px" }}
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    PlaceofSupply: e.target.value,
                  })
                }
              />
              <TextField
                id="filled-basic"
                label={
                  <span>
                    PS Year <span style={{ color: "red" }}>*</span>
                  </span>
                }
                variant="filled"
                sx={{ marginBottom: "28px" }}
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    PSYear: e.target.value,
                  })
                }
              />
              <TextField
                id="standard-number"
                label={
                  <span>
                    Rate <span style={{ color: "red" }}>*</span>
                  </span>
                }
                type="number"
                variant="standard"
                sx={{ marginBottom: "20px", width: 218 }}
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    Rate: Number(e.target.value),
                  })
                }
              />
              <TextField
                id="standard-number"
                label={
                  <span>
                    IGST % <span style={{ color: "red" }}>*</span>
                  </span>
                }
                type="number"
                variant="standard"
                sx={{ marginBottom: "25px", width: 218 }}
                onChange={(e) =>
                  setAddDetails({
                    ...adddetails,
                    IGST: Number(e.target.value),
                  })
                }
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label={
                    <span>
                      Action Date <span style={{ color: "red" }}>*</span>
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
            color="secondary"
            variant="contained"
            onClick={() => handleDelete(deleteid)}
          >
            ADD
          </Button>
          <Button onClick={handleClose} autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
