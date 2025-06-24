import React, { useState, useCallback, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import PropTypes from 'prop-types';

const axios = require('axios');

export default function CoinGraph({ id, graphInterval }) {
  let graphUrl = `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=cad&days=90&interval=${graphInterval}`;

  const [coin, setCoin] = useState('');

  const fetchGraph = useCallback(async () => {
    try {
      // let respone = await axios.get(graphUrl);
      // respone = await formatChartData(respone.data.prices);
      // setCoin(respone);
      setCoin([]);
    } catch (err) {
      console.error(`Error inside fetchGraph -> ${err}`);
    }
  }, [graphUrl]);

  useEffect(() => {
    fetchGraph();
    const fetchGraphTimer = setInterval(() => fetchGraph(), 86400000);
    return () => {
      clearInterval(fetchGraphTimer);
    };
  }, [fetchGraph]);

  const formatChartData = (data) => {
    return data.map((datapoint) => {
      return {
        time: new Date(datapoint[0]).toLocaleString('en-ca'),
        price: datapoint[1],
      };
    });
  };

  return (
    <ResponsiveContainer>
      <AreaChart
        width={600}
        height={600}
        data={coin}
        margin={{
          top: 50,
          right: 10,
          left: 10,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="price" stroke="#F766FF" fill="#F766FF" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

CoinGraph.propTypes = {
  id: PropTypes.string.isRequired,
  graphInterval: PropTypes.string.isRequired,
};
