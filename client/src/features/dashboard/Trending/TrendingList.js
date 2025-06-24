import React from 'react';
import TableBody from '@mui/material/TableBody';
import TrendingItem from './TrendingItem';
import PropTypes from 'prop-types';

export default function TrendingList({ trendings }) {
  const iterateTrendings = (trendings) => {
    return (
      trendings.length > 0 &&
      trendings.map((obj, i) => {
        return <TrendingItem key={i} obj={obj} />;
      })
    );
  };

  return <TableBody>{iterateTrendings(trendings)}</TableBody>;
}
TrendingList.propTypes = {
  trendings: PropTypes.arrayOf(
    PropTypes.shape({
      item: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        symbol: PropTypes.string.isRequired,
        thumb: PropTypes.string.isRequired,
        price_btc: PropTypes.number.isRequired,
      }).isRequired,
    }),
  ).isRequired,
};
