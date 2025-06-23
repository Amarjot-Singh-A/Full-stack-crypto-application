import React from 'react';
import TableBody from '@mui/material/TableBody';
import PortfolioItem from './PortfolioItem';
import PropTypes from 'prop-types';

function combineRep(arrayOfObj) {
  let skip = false;
  let repeatObj = {};

  let result = arrayOfObj.map((obj, i, arrayOfObj) => {
    if (i === arrayOfObj.length - 1) {
      return Object.keys(repeatObj).length > 0 ? (
        <PortfolioItem key={i} obj={repeatObj} />
      ) : (
        <PortfolioItem key={i} obj={obj} />
      );
    } else if (obj.coin_name === arrayOfObj[i + 1].coin_name) {
      if (Object.keys(repeatObj).length === 0) {
        let updatedObj = {
          coin_name: obj.coin_name,
          coin_price: (obj.coin_price + arrayOfObj[i + 1].coin_price) / 2,
          amount_invested:
            obj.amount_invested + arrayOfObj[i + 1].amount_invested,
          quantity_bought:
            obj.quantity_bought + arrayOfObj[i + 1].quantity_bought,
        };
        repeatObj = updatedObj;
        skip = true;
        return undefined;
      } else {
        let updatedObj = {
          coin_name: obj.coin_name,
          coin_price: (arrayOfObj[i + 1].coin_price + repeatObj.coin_price) / 2,
          amount_invested:
            arrayOfObj[i + 1].amount_invested + repeatObj.amount_invested,
          quantity_bought:
            arrayOfObj[i + 1].quantity_bought + repeatObj.quantity_bought,
        };

        repeatObj = updatedObj;
        skip = true;
        return undefined;
      }
    } else if (skip === true) {
      skip = false;
      let result = repeatObj;
      repeatObj = {};
      return <PortfolioItem key={i} obj={result} />;
    } else {
      return <PortfolioItem key={i} obj={obj} />;
    }
  });
  let filteredarr = result.filter((elem) => elem !== undefined);
  return filteredarr;
}

export default function PortfolioList({ transactions }) {
  function compare(a, b) {
    if (a.coin_name < b.coin_name) {
      return -1;
    }
    if (a.coin_name > b.coin_name) {
      return 1;
    }
    return 0;
  }

  const item = (transactions) => {
    let sortedArr = transactions.sort(compare);
    return combineRep(sortedArr);
  };

  return <TableBody>{item(transactions)}</TableBody>;
}

PortfolioList.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      coin_name: PropTypes.string.isRequired,
      coin_price: PropTypes.number.isRequired,
      amount_invested: PropTypes.number.isRequired,
      quantity_bought: PropTypes.number.isRequired,
      id: PropTypes.string.isRequired,
    })
  ).isRequired,
};
