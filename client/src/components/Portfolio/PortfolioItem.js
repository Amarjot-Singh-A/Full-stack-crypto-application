import React, { useState, useEffect } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import CircularProgress from '@mui/material/CircularProgress';
import PropTypes from 'prop-types';

export default function PortfolioItem({ obj }) {
  const { coin_name, coin_price, amount_invested, quantity_bought, id } = obj;
  const [currentPrice, setCurrentPrice] = useState(0);
  const [percentDiff, setPercentDiff] = useState(0);

  useEffect(() => {
    async function getCoinPrice() {
      try {
        let priceOfCoinInCurrency = `https://api.coingecko.com/api/v3/simple/price?ids=${coin_name}&vs_currencies=cad`;
        let result = await fetch(priceOfCoinInCurrency)
          .then((res) => res.json())
          .then((data) => data)
          .catch((err) => console.error(err));
        let fetchedPrice = Number(Object.values(result)[0]?.cad);
        setCurrentPrice(fetchedPrice);
        setPercentDiff(
          Number((fetchedPrice / coin_price) * 100 - 100).toFixed(2),
        );
      } catch (e) {
        console.error('error fetching getcoinprice', e);
      }
    }
    getCoinPrice();
  }, [coin_name, coin_price]);

  return (
    <TableRow key={id}>
      <TableCell>{coin_name}</TableCell>
      <TableCell>{coin_price}</TableCell>
      <TableCell>{amount_invested}</TableCell>
      <TableCell>{Number(quantity_bought).toFixed(4)}</TableCell>
      <TableCell>
        {currentPrice ? (
          currentPrice
        ) : (
          <CircularProgress size="1rem" color="info" />
        )}
      </TableCell>
      <TableCell style={{ color: percentDiff >= 0 ? 'green' : 'red' }}>
        {percentDiff ? (
          percentDiff
        ) : (
          <CircularProgress size="1rem" color="info" />
        )}
      </TableCell>
    </TableRow>
  );
}

PortfolioItem.propTypes = {
  obj: PropTypes.shape({
    coin_name: PropTypes.string.isRequired,
    coin_price: PropTypes.number.isRequired,
    amount_invested: PropTypes.number.isRequired,
    quantity_bought: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
};
