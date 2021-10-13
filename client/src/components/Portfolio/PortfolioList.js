import React from "react";
import TableBody from "@mui/material/TableBody";
import PortfolioItem from "./PortfolioItem";

export default function PortfolioList({ transactions }) {
  const iterateTransactions = (transactions) => {
    return (
      transactions.length > 0 &&
      transactions.map((obj, i) => {
        return <PortfolioItem key={i} obj={obj} />;
      })
    );
  };

  return <TableBody>{iterateTransactions(transactions)}</TableBody>;
}
