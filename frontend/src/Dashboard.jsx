import React from "react";
import { Grid } from "@mui/material";
import Income2 from "./Income2";
import { Box, Typography } from "@mui/material";
import { useState, useMemo } from "react";
import ApiCalls from "./API/ApiCalls";
export default function Dashboard() {
  const [totalIncome, setTotalIncome] = useState(0);
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
        <Grid item xl={3} md={3} xs={4}>
          <Box
            sx={{
              boxShadow: "10px 10px 4px 0px #00000050",
              borderRadius: "5px",
              display: "flex",
              height: "150px",
              gap: "50px",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontSize: "200%" }}>Income</Typography>
            <Typography sx={{ color: "green", fontSize: "200%" }}>
              +{totalIncome}
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
        <Income2 />
      </Grid>
    </Grid>
  );
}
