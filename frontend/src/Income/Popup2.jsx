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

export default function Popup2(open, setOpen) {
  console.log(setOpen);
  const [deleteid, setDeleteId] = useState(0);
  const [fullWidth, setFullWidth] = React.useState(true);
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
  return (
    <>
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
    </>
  );
}
