import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import CoinDesc from './CoinDesc';
import CoinStats from './CoinStats';
import CoinFav from './CoinFav';
import CoinGraph from './CoinGraph';
import CoinGraphInterval from './CoinGraphInterval';
import CoinPrice from './CoinPrice';

const axios = require('axios');

/**
 * todo - use progress or skeleton from material ui when coins and coin page loads
 */
export default function Coin() {
  const { id } = useParams();
  const [stats, setStats] = useState('');
  const [graphInterval, setGraphInterval] = useState('daily');

  const statsUrl = `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;

  const fetchStats = useCallback(async () => {
    try {
      // let response = await axios.get(statsUrl);
      // response = response.data;
      // setStats(response);
      setStats([]);
    } catch (err) {
      console.error(`Error inside fetchStats -> ${err}`);
    }
  }, [statsUrl]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div
      style={{
        width: '90%',
        height: 500,
        margin: '7% auto',
      }}
    >
      <CoinFav id={id} />
      <CoinGraph id={id} graphInterval={graphInterval} />
      <CoinGraphInterval
        graphInterval={graphInterval}
        setGraphInterval={setGraphInterval}
      />
      <CoinPrice id={id} />
      <CoinStats stats={stats} />
      <CoinDesc stats={stats} />
    </div>
  );
}
