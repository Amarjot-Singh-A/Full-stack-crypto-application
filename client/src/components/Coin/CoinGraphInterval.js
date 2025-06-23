import React from 'react';
import PropTypes from 'prop-types';

export default function CoinGraphInterval({ graphInterval, setGraphInterval }) {
  const graphIntervals = [
    { name: 'Minute', value: 'minutely' },
    { name: 'Hourly', value: 'hourly' },
    { name: 'Daily', value: 'daily' },
    { name: 'Weekly', value: 'weekly' },
  ];

  const handleGraphIntervalChange = (e) => {
    setGraphInterval(e.target.value);
  };

  return (
    <div className="graph_interval_div">
      <label htmlFor="interval"> Graph Interval</label>
      <select
        name="interval"
        onChange={handleGraphIntervalChange}
        defaultValue={graphInterval}
      >
        {graphIntervals.map((obj) => (
          <option key={obj.name} value={obj.value}>
            {obj.name}
          </option>
        ))}
      </select>
    </div>
  );
}

CoinGraphInterval.propTypes = {
  graphInterval: PropTypes.string.isRequired,
  setGraphInterval: PropTypes.func.isRequired,
};