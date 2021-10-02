import React from "react";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import Title from "../Title/Title";

/**
 * TODO - change the table structure to remove repitition
 */
export default function CoinStats({ stats }) {
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
            <TableRow>
              <TableCell align="left">Image</TableCell>
              <TableCell align="left">
                <img src={stats.image.small} alt="coinimage" />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">{stats.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left">Symbol</TableCell>
              <TableCell align="left">{stats.symbol}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left">All Time High</TableCell>
              <TableCell align="left">{stats.market_data.ath.cad}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left">All Time Low</TableCell>
              <TableCell align="left">{stats.market_data.atl.cad}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left">Market Cap</TableCell>
              <TableCell align="left">
                {stats.market_data.market_cap.cad}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left">Total Volume</TableCell>
              <TableCell align="left">
                {stats.market_data.total_volume.cad}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left">High 24h</TableCell>
              <TableCell align="left">
                {stats.market_data.high_24h.cad}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left">Low 24h</TableCell>
              <TableCell align="left">
                {stats.market_data.low_24h.cad}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left">Circulating Supply</TableCell>
              <TableCell align="left">
                {stats.market_data.circulating_supply}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left">Max Supply</TableCell>
              <TableCell align="left">{stats.market_data.max_supply}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    )
  );
}
