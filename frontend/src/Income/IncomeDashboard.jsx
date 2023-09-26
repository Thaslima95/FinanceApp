import React from "react";
import { Grid } from "@mui/material";
import Income from "./Income";
import { Box, Typography } from "@mui/material";
import { useState, useMemo } from "react";
import ApiCalls from "../API/ApiCalls";
export default function IncomeDashboard() {
  const [totalIncome, setTotalIncome] = useState(0);
  const [unpaidIncome, setUnpaidIncome] = useState(0);

  useMemo(() => {
    ApiCalls.getUnpaidTotalIncome()
      .then((res) => {
        setUnpaidIncome(res[0].Total);
      })
      .catch((err) => console.log(err));
  }, []);
  useMemo(() => {
    ApiCalls.getTotalIncome()
      .then((res) => {
        console.log(res);
        setTotalIncome(res[0].Total);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <Grid container>
      <Grid container xs>
        <Grid item xl={2} md={3} xs={4}>
          <Box
            sx={{
              boxShadow: "10px 10px 4px 0px #00000050",
              borderRadius: "5px",
              display: { xs: "block", md: "block" },
              height: "150px",
              paddingLeft: "20px",
            }}
          >
            <Typography sx={{ fontSize: { md: "30px", xs: "1rem" } }}>
              Income
            </Typography>
            <Typography
              sx={{ color: "green", fontSize: { md: "30px", xs: "1rem" } }}
            >
              +{totalIncome}
            </Typography>
          </Box>
        </Grid>
        <Grid item xl={1} xs={2} md={2}></Grid>
        <Grid item xl={3} md={3} xs={4}>
          <Box
            sx={{
              boxShadow: "10px 10px 4px 0px #00000050",
              borderRadius: "5px",

              height: "150px",
            }}
          >
            <Typography sx={{ fontSize: { md: "30px", xs: "1rem" } }}>
              Income Outstanding
            </Typography>
            <Typography
              sx={{ color: "red", fontSize: { md: "30px", xs: "1rem" } }}
            >
              {unpaidIncome}
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Typography sx={{ fontSize: "220%", color: "secondary" }}>
          Income Outstanding
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Income />
      </Grid>
    </Grid>
  );
}
