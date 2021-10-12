import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import FavouriteItem from "./FavouriteItem";
import CircularProgress from "@mui/material/CircularProgress";

const axios = require("axios");

export default function FavouriteList({ favCoinsLists }) {
  const [favCoinsList, setFavCoinsList] = useState([]);

  useEffect(() => {
    function displayFavList(favCoinsLists) {
      if (favCoinsLists.length > 0) {
        favCoinsLists.forEach((obj, i) => {
          axios
            .get(
              `https://api.coingecko.com/api/v3/simple/price?ids=${obj}&vs_currencies=cad`
            )
            .then((response) => {
              let keys = Object.keys(response.data);
              setFavCoinsList((prev) => [
                ...prev,
                {
                  [keys]: Object.values(response.data)[0].cad,
                },
              ]);
            });
        });
      }
    }
    displayFavList(favCoinsLists);
  }, [favCoinsLists]);

  return (
    <>
      {favCoinsList.length > 0 ? (
        <FavouriteItem coins={favCoinsList} />
      ) : (
        <Grid item xs={12}>
          <CircularProgress />
        </Grid>
      )}
    </>
  );
}
