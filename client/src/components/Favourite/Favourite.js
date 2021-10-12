import React, { useEffect, useState, useCallback } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";


import FavouriteList from "./FavouriteList";

export default function Favourite() {
  const [favCoins, setFavCoins] = useState([]);
  const fetchCoinsApi = useCallback(async () => {
    const url = "http://localhost:5000/favourite";
    const result = await fetch(url, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => data)
      .catch((err) => console.error("error in fetchCoinsapi", err));

    return result;
  }, []);

  useEffect(() => {
    async function setCoinsEffect() {
      let { coins } = await fetchCoinsApi();
      if (coins == null) {
        setFavCoins([]);
        localStorage.setItem("favouriteCoins", []);
      } else {
        let result = coins[0].coins;
        localStorage.setItem("favouriteCoins", result);
        console.log(result);
        setFavCoins(JSON.parse(result));
      }
    }
    setCoinsEffect();
  }, [fetchCoinsApi]);

  const displayFavSkeleton = () => {
    return (
      <Grid item xs={12} md={4} lg={2}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: 240,
          }}>
          <Stack spacing={1}>
            <Skeleton variant="text" />
            <Skeleton variant="rectangular" height={150}/>
            <Skeleton variant="text" />
          </Stack>
        </Paper>
      </Grid>
    );
  };
  return (
    <>
      {favCoins.length > 0 ? (
        <FavouriteList favCoinsLists={favCoins} />
      ) : (
        displayFavSkeleton()
      )}
    </>
  );
}
