import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import Title from "../Title/Title";
import PortfolioList from "./PortfolioList";
import { getData } from "../../services/dataInteraction";


/**
 * todo - remove reptition of coins in the table
 */
export default function Portfolio() {
  const [transList, setTransList] = useState([]);
  const [transError, setTransError] = useState("");

  useEffect(() => {
    let url = "http://localhost:5000/portfolio";
    let mounted = true;
    getData(url).then((data) => {
      if (mounted) {
        if (data.completed === false && data.result === null) {
          setTransError(data.error);
        } else if (data.completed === false && data.error !== null) {
          setTransError(data.error);
        } else {
          setTransList(data.result);
        }
      } else {
        console.log("trans components had already unmounted");
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Grid item xs={12}>
      <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
        <Title>Portfolio</Title>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Coin</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Invested</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Current Price</TableCell>
              <TableCell>% Change</TableCell>
            </TableRow>
          </TableHead>
          {transList.length > 0 ? (
            <PortfolioList transactions={transList} />
          ) : (
            <TableBody>
            <TableRow>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
            </TableBody>
          )}
        </Table>
        {transError}
      </Paper>
    </Grid>
  );
}
