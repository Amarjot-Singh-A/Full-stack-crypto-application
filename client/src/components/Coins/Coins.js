import React, { useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

const axios = require("axios");

/**
 * todo - use progress or skeleton from material ui when coins and coin page loads
 */

export default function Coins() {
  const [coins, setCoins] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const history = useHistory();

  const url =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=cad&order=market_cap_" +
    "desc&per_page=100&page=1&sparkline=false&price_change_percentage='1h%2C24h%2C7d'";

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const fetchCoins = useCallback(() => {
    axios
      .get(url)
      .then((res) => {
        setCoins(res.data);
      })
      .catch((err) => console.error(`Error - > ${err}`));
  }, [url]);

  useEffect(() => {
    fetchCoins();
    const fetchCoinsTimer = setInterval(() => {
      fetchCoins();
    }, 10000);
    return () => {
      clearInterval(fetchCoinsTimer);
    };
  }, [fetchCoins]);

  const renderSkeleton = () => {
    return (
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
          <Stack spacing={1}>
            <Skeleton variant="rectangular" sx={{ height: "15vh" }} />
            <Skeleton variant="text" sx={{ height: "6vh" }} />
            <Skeleton variant="text" sx={{ height: "6vh" }} />
            <Skeleton variant="text" sx={{ height: "6vh" }} />
            <Skeleton variant="text" sx={{ height: "6vh" }} />
            <Skeleton variant="text" sx={{ height: "6vh" }} />
            <Skeleton variant="text" sx={{ height: "6vh" }} />
            <Skeleton variant="text" sx={{ height: "6vh" }} />
            <Skeleton variant="text" sx={{ height: "6vh" }} />
            <Skeleton variant="text" sx={{ height: "6vh" }} />
            <Skeleton variant="text" sx={{ height: "6vh" }} />
            <Skeleton variant="rectangular" sx={{ height: "15vh" }} />
          </Stack>
        </Paper>
      </Grid>
    );
  };

  const renderTable = (coins) => {
    return (
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
          <TableContainer>
            <Table stickyHeader aria-label="coins table">
              <TableHead>
                <TableRow>
                  <TableCell key="1">Image</TableCell>
                  <TableCell key="2">Symbol</TableCell>
                  <TableCell key="3">Name</TableCell>
                  <TableCell key="4">Id</TableCell>
                  <TableCell key="5">Price</TableCell>
                  <TableCell key="6">Ath</TableCell>
                  <TableCell key="7">Market cap</TableCell>
                  <TableCell key="8">24h</TableCell>
                  <TableCell key="9">Volume</TableCell>
                  <TableCell key="10">High 24h</TableCell>
                  <TableCell key="11">Low 24h</TableCell>
                  <TableCell key="12">Ath change percentage</TableCell>
                  <TableCell key="13">Ath date</TableCell>
                  <TableCell key="14">Atl</TableCell>
                  <TableCell key="15">Atl change percentage</TableCell>
                  <TableCell key="16">Atl date</TableCell>
                  <TableCell key="17">Circulating supply</TableCell>
                  <TableCell key="18">Fully diluted valuation</TableCell>
                  <TableCell key="19">Last updated</TableCell>
                  <TableCell key="20">Market cap change 24h</TableCell>
                  <TableCell key="21">
                    Market cap change percentage 24h
                  </TableCell>
                  <TableCell key="22">Market cap rank</TableCell>
                  <TableCell key="23">Max supply</TableCell>
                  <TableCell key="24">Price change percentage 24h</TableCell>
                  <TableCell key="25">
                    Price change percentage 24h in currency
                  </TableCell>
                  <TableCell key="26">ROI</TableCell>
                  <TableCell key="27">Total supply</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {coins.length > 0 &&
                  coins
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow
                        hover
                        onClick={() =>
                          history.push(`../dashboard/coin/${row.id}`)
                        }
                        role="checkbox"
                        tabIndex={-1}
                        key={JSON.stringify(row.symbol)}
                      >
                        <TableCell align="right">
                          <img
                            style={{ maxWidth: "25px", height: "auto" }}
                            src={row.image}
                            alt="coin_image"
                          />
                        </TableCell>
                        <TableCell align="right">{row.symbol}</TableCell>
                        <TableCell align="right">{row.name}</TableCell>
                        <TableCell align="right">{row.id}</TableCell>
                        <TableCell align="right">{`CAD ${JSON.stringify(
                          row.current_price
                        )}`}</TableCell>
                        <TableCell component="th" scope="row">
                          {JSON.stringify(row.ath)}
                        </TableCell>
                        <TableCell align="right">
                          {JSON.stringify(row.market_cap)}
                        </TableCell>
                        <TableCell align="right">
                          {JSON.stringify(row.price_change_24h)}
                        </TableCell>
                        <TableCell align="right">
                          {JSON.stringify(row.total_volume)}
                        </TableCell>
                        <TableCell align="right">
                          {JSON.stringify(row.high_24h)}
                        </TableCell>
                        <TableCell align="right">
                          {JSON.stringify(row.low_24h)}
                        </TableCell>
                        <TableCell align="right">
                          {JSON.stringify(row.ath_change_percentage)}
                        </TableCell>
                        <TableCell align="right">
                          {JSON.stringify(row.ath_date)}
                        </TableCell>
                        <TableCell align="right">
                          {JSON.stringify(row.atl)}
                        </TableCell>
                        <TableCell align="right">
                          {JSON.stringify(row.atl_change_percentage)}
                        </TableCell>
                        <TableCell align="right">
                          {JSON.stringify(row.atl_date)}
                        </TableCell>
                        <TableCell align="right">
                          {JSON.stringify(row.circulating_supply)}
                        </TableCell>
                        <TableCell align="right">
                          {JSON.stringify(row.fully_diluted_valuation)}
                        </TableCell>
                        <TableCell align="right">
                          {JSON.stringify(row.last_updated)}
                        </TableCell>
                        <TableCell align="right">
                          {JSON.stringify(row.market_cap_change_24h)}
                        </TableCell>
                        <TableCell align="right">
                          {JSON.stringify(row.market_cap_change_percentage_24h)}
                        </TableCell>
                        <TableCell align="right">
                          {JSON.stringify(row.market_cap_rank)}
                        </TableCell>
                        <TableCell align="right">
                          {JSON.stringify(row.max_supply)}
                        </TableCell>
                        <TableCell align="right">
                          {JSON.stringify(row.price_change_percentage_24h)}
                        </TableCell>
                        <TableCell align="right">
                          {JSON.stringify(
                            row.price_change_percentage_24h_in_currency
                          )}
                        </TableCell>
                        <TableCell align="right">
                          {JSON.stringify(row.roi)}
                        </TableCell>
                        <TableCell align="right">
                          {JSON.stringify(row.total_supply)}
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={coins.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Grid>
    );
  };

  return <>{coins ? renderTable(coins) : renderSkeleton()}</>;
}
