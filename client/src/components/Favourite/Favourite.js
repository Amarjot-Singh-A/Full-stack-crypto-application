import React from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

import FavouriteList from "./FavouriteList";

export default function Favourite() {
  const favCoins = JSON.parse(localStorage.getItem("favouriteCoins"))
    ? JSON.parse(localStorage.getItem("favouriteCoins"))
    : [];

  return (
    <Grid item xs={12} md={4} lg={3}>
      <Paper
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          height: 240,
        }}
      >
        <FavouriteList favCoinsLists={favCoins} />
      </Paper>
    </Grid>
  );
}
