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
              Paid Income
            </Typography>
            <Typography sx={{ fontSize: { md: "30px", xs: "1rem" } }}>
              {totalIncome ? `+${totalIncome}` : 0}
            </Typography>
          </Box>
        </Grid>
        <Grid item xl={3} md={3} xs={4}>
          {unpaidIncome && (
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
                Income Outstanding
              </Typography>
              <Typography sx={{ fontSize: { md: "30px", xs: "1rem" } }}>
                {unpaidIncome}
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
      <Grid container xs={12}>
        <Grid item md={6}>
          <Typography sx={{ fontSize: "220%", color: "secondary" }}>
            Income Outstanding
          </Typography>
        </Grid>
      </Grid>
      <Grid container xs={12}>
        <Grid item md={0.5}></Grid>
        <Grid item md={12}>
          <Income />
        </Grid>
      </Grid>
    </Grid>
  );
}
