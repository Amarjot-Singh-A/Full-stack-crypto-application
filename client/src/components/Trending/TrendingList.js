import React from 'react';
import TableBody from '@mui/material/TableBody';
import TrendingItem from './TrendingItem';

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
