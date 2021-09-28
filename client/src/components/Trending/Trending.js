import * as React from "react";
import { useEffect, useState } from "react";
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "../Title";
import TrendingList from "./TrendingList";

const axios = require("axios");

export default function Trending() {
  const [trending, setTrending] = useState("");
  const url = "https://api.coingecko.com/api/v3/search/trending";

  useEffect(() => {
    getTrendingData();
  }, []);

  const getTrendingData = () => {
    axios
      .get(url)
      .then((response) => {
        let allData = response.data.coins;
        console.log(allData);
        setTrending(allData);
      })
      .catch((error) => console.error(`Error -> ${error}`));
  };

  return (
    <Grid item xs={12}>
      <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
        <Title>Top Trending Coins</Title>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Symbol</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Price(cad)</TableCell>
            </TableRow>
          </TableHead>
          <TrendingList trendings={trending} />
        </Table>
      </Paper>
    </Grid>
  );
}
