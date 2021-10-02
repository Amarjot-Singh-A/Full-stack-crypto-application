import React from "react";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import Title from "../Title/Title";


export default function CoinStats({ stats }) {
  let tableData =
    Object.keys(stats).length !== 0
      ? {
          Image: stats.image.small,
          Name: stats.name,
          Symbol: stats.symbol,
          "All time High": stats.market_data.ath.cad,
          "All time Low": stats.market_data.atl.cad,
          "Market Cap": stats.market_data.market_cap.cad,
          "Total Volume": stats.market_data.total_volume.cad,
          "High 24h": stats.market_data.high_24h.cad,
          "Low 24h": stats.market_data.low_24h.cad,
          "Circulatory Supply ": stats.market_data.circulating_supply,
          "Max Supply": stats.market_data.max_supply,
        }
      : {};

  return (
    Object.keys(stats).length !== 0 && (
      <TableContainer component={Paper}>
        <Title>Statistics</Title>
        <Table size="small" aria-label="stats table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(tableData).map(([key, value]) => {
              if (key === "Image") {
                return (
                  <TableRow key={key}>
                    <TableCell align="left">{key}</TableCell>
                    <TableCell align="left">
                      <img src={value} alt={key} />
                    </TableCell>
                  </TableRow>
                );
              } else {
                return (
                  <TableRow key={key}>
                    <TableCell align="left">{key}</TableCell>
                    <TableCell align="left">{value}</TableCell>
                  </TableRow>
                );
              }
            })}
          </TableBody>
        </Table>
      </TableContainer>
    )
  );
}
