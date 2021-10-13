import React from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";

export default function PortfolioItem({ obj }) {
  const { coin_name, coin_price, amount_invested, quantity_bought, id } = obj;

  return (
    <TableRow key={id}>
      <TableCell>{coin_name}</TableCell>
      <TableCell>{coin_price}</TableCell>
      <TableCell>{amount_invested}</TableCell>
      <TableCell>{quantity_bought}</TableCell>
    </TableRow>
  );
}
