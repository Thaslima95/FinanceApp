import React from "react";
import { Grid } from "@mui/material";
import { Box, Typography } from "@mui/material";
import { useState, useMemo } from "react";
import ApiCalls from "../API/ApiCalls";
import ExpenseRecord from "./ExpenseRecord";
export default function ExpenseDashboard() {
  const [totalExpense, setTotalExpense] = useState(0);
  const [unpaidExpense, setUnpaidExpense] = useState(0);
  useMemo(() => {
    ApiCalls.getTotalExpense()
      .then((res) => {
        setTotalExpense(res[0].Total);
      })
      .catch((err) => console.log(err));
  }, []);
  useMemo(() => {
    ApiCalls.getUnpaidTotalExpense()
      .then((res) => {
        setUnpaidExpense(res[0].Total);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <Grid container>
      <Grid container xs>
        <Grid item xl={3} md={3} xs={5}>
          <Box
            sx={{
              marginTop: "20px",
              borderRadius: "25px",
              display: { xs: "block", md: "block" },
              height: "150px",
              paddingLeft: "20px",
              background: "#676767",
              color: "white",
              marginLeft: "50px",
            }}
          >
            <Typography sx={{ fontSize: { md: "30px", xs: "1rem" } }}>
              Direct Expense
            </Typography>
            <Typography sx={{ fontSize: { md: "30px", xs: "1rem" } }}>
              {totalExpense && `-${totalExpense}`}
            </Typography>
          </Box>
        </Grid>
        <Grid item xl={3} md={3} xs={4}>
          {unpaidExpense && (
            <Box
              sx={{
                marginTop: "20px",
                borderRadius: "25px",
                display: { xs: "block", md: "block" },
                height: "150px",
                paddingLeft: "20px",
                background: "#676767",
                color: "white",
                marginLeft: "20px",
              }}
            >
              <Typography sx={{ fontSize: { md: "30px", xs: "1rem" } }}>
                Indirect Expense
              </Typography>
              <Typography sx={{ fontSize: { md: "30px", xs: "1rem" } }}>
                {unpaidExpense && `-${unpaidExpense}`}
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
      <Grid container xs={12}>
        <Grid item md={6}>
          <Typography sx={{ fontSize: "220%", color: "secondary" }}>
            Expense Record
          </Typography>
        </Grid>
      </Grid>
      <Grid container xs={12}>
        <Grid item md={0.5}></Grid>
        <Grid item md={12}>
          <ExpenseRecord />
        </Grid>
      </Grid>
    </Grid>
  );
}
