import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';

export default function DisplayBalance() {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    let mounted = true;
    async function getBalance() {
      const url = `${process.env.REACT_APP_API_URL}/ledger`;
      try {
        const res = await fetch(url, {
          method: 'GET',
          credentials: 'include',
        });
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Not authenticated or invalid response');
        }
        const data = await res.json();
        return data;
      } catch (error) {
        console.error('error inside getbalance', error);
      }
      return null;
    }

    const balanceInAcc = getBalance();

    if (mounted) {
      balanceInAcc.then((data) => {
        if (
          data &&
          data.result &&
          data.result.length > 0 &&
          data.error == null
        ) {
          setBalance(data.result[0]['balance'].toFixed(2));
        } else {
          setBalance(0);
          console.log('balance', 0);
        }
      });
    }
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Typography variant="string" color="inherit" noWrap sx={{ flexGrow: 0.25 }}>
      {balance} CAD
    </Typography>
  );
}
