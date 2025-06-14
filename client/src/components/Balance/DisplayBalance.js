import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";

export default function DisplayBalance() {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    let mounted = true;
    async function getBalance() {
      let url = "http://localhost:5000/ledger/balance";
      let result = await fetch(url, {
        method: "GET",
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          return data;
        })
        .catch((error) => console.error("error inside getbalance", error));

      return result;
    }

    let balanceInAcc = getBalance();

    if (mounted) {
      balanceInAcc.then((data) => {
        if (data.result && data.result.length > 0 && data.error == null) {
          setBalance(data.result[0]['balance'].toFixed(2));
        } else {
          console.log("balance", 0);
        }
      });
    }
    return () => {
      mounted = false;
    };
  }, []);

  


  return (
    <Typography variant="string" color="inherit" noWrap sx={{ flexGrow: .25 }}>
      {balance} CAD
    </Typography>
  );
}
