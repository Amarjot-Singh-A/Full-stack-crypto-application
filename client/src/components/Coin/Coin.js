import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import TableContainer from "@mui/material/TableContainer";
import Paper from '@mui/material/Paper';
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import Title from "../Title";
// import "./Coin.css";


const axios = require("axios");

export default function Coin() {
  const [coin, setCoin] = useState("");
  const [crypto, setCrypto] = useState(0);
  const [price, setPrice] = useState(0);
  const { id } = useParams();
  // const id = 'bitcoin'
  const [stats, setStats] = useState("");
  const [moneyInput, setMoneyInput] = useState(() => {
    let moneyInputLocal = JSON.parse(localStorage.getItem("moneyInput"));
    return moneyInputLocal || "";
  });

  const [isFav, setIsFav] = useState(() => {
    let checkLocalStorage = JSON.parse(localStorage.getItem("favouriteCoins"));
    if (checkLocalStorage) {
      return checkLocalStorage.includes(id);
    } else {
      return false;
    }
  });

  const [graphInterval, setGraphInterval] = useState("daily")

  const graphIntervals = [
    { name: "Minute", value: "minutely" },
    { name: "Hourly", value: "hourly" },
    { name: "Daily", value: "daily" },
    { name: "Weekly", value: "weekly" }
  ]

  let graphUrl = `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=cad&days=90&interval=${graphInterval}`
  const priceUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=cad`
  const statsUrl = `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`

  const formatChartData = (data) => {
    return data.map((datapoint) => {
      return {
        time: new Date(datapoint[0]).toLocaleString("en-ca"),
        price: datapoint[1],
      };
    });
  };

  const fetchGraph = useCallback(async () => {
    try {
      let respone = await axios.get(graphUrl);
      respone = await formatChartData(respone.data.prices)
      setCoin(respone);
    } catch (err) {
      console.error(`Error inside fetchGraph -> ${err}`)
    }
  }, [graphUrl]);

  const fetchStats = useCallback(async () => {
    try {
      let response = await axios.get(statsUrl)
      response = response.data
      setStats(response)
    } catch (err) {
      console.error(`Error inside fetchStats -> ${err}`)
    }
  }, [statsUrl]);

  useEffect(() => {
    fetchGraph()
    fetchStats()
    const fetchGraphTimer = setInterval(() => fetchGraph(), 86400000)
    return () => {
      clearInterval(fetchGraphTimer)
    }
  }, [fetchGraph, fetchStats])

  useEffect(() => {
    function getCryptoPrice() {
      axios
        .get(priceUrl)
        .then((res) => {
          let priceOfCoin = Object.values(res.data)[0].cad
          setPrice(priceOfCoin)
        })
        .catch((err) => console.error(`Error inside getCryptoPrice -> ${err}`))
    }
    getCryptoPrice()
    const getCryptoPriceTimer = setInterval(() => getCryptoPrice(), 200000)
    return () => {
      clearInterval(getCryptoPriceTimer)
    };
  }, [priceUrl]);

  const moneyToCrypto = (event) => {
    localStorage.setItem("moneyInput", event.target.value)
    setMoneyInput(event.target.value)
    setCrypto(Number.parseFloat((1 / price) * event.target.value).toFixed(7))
  };

  const addToFavouriteHandler = () => {
    if (!isFav) {
      if (JSON.parse(localStorage.getItem("favouriteCoins"))) {
        let favouriteCoinsArr = JSON.parse(
          localStorage.getItem("favouriteCoins")
        );
        favouriteCoinsArr = [...favouriteCoinsArr, id]
        localStorage.setItem(
          "favouriteCoins",
          JSON.stringify([...new Set(favouriteCoinsArr)])
        );
        setIsFav(true);
      } else {
        localStorage.setItem("favouriteCoins", JSON.stringify([id]));
        setIsFav(true);
      }
    } else {
      let favouriteCoinsArr = JSON.parse(
        localStorage.getItem("favouriteCoins")
      );
      let arrayAfterFavRemoval = favouriteCoinsArr.filter((e) => e !== id);
      localStorage.setItem(
        "favouriteCoins",
        JSON.stringify(arrayAfterFavRemoval)
      );
      setIsFav(false);
    }
  };

  const addToFavourite = () => {
    return (
      <button className="fav-button" onClick={addToFavouriteHandler}>
        {isFav ? "Remove from favourite" : "Add to favourite"}
      </button>
    );
  };
  const displayGraph = () => {
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
          <Area
            type="monotone"
            dataKey="price"
            stroke="#F766FF"
            fill="#F766FF"
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  const handleGraphIntervalChange = (e) => {
    setGraphInterval(e.target.value);
  };

  const displayGraphInterval = () => {
    return (
      <div className='graph_interval_div'>
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
  };

  const displayPriceConvertor = () => {
    return (
      <div className="price_convertor_div">
        <label htmlFor="dollarToCoin">
          Price of {id}= {price}
        </label>
        <input
          id="dollarToCoin"
          onChange={moneyToCrypto}
          type="number"
          placeholder="invest money"
          value={moneyInput}
        />

        <p>
          Total {id} = {crypto}
        </p>
      </div>
    );
  };


  /**
   * TODO - change the table structure to remove repitition
   */

  const displayStats = (stats) => {
    return (
      Object.keys(stats).length !== 0 && (
        <TableContainer component={Paper}>
          <Title>Statistics</Title>
          <Table size="small" aria-label="stats table">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell align="left">Image</TableCell>
                <TableCell align="left">
                  <img src={stats.image.small} alt="coinimage" />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left">Name</TableCell>
                <TableCell align="left">{stats.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left">Symbol</TableCell>
                <TableCell align="left">{stats.symbol}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left">All Time High</TableCell>
                <TableCell align="left">{stats.market_data.ath.cad}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left">All Time Low</TableCell>
                <TableCell align="left">{stats.market_data.atl.cad}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left">Market Cap</TableCell>
                <TableCell align="left">
                  {stats.market_data.market_cap.cad}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left">Total Volume</TableCell>
                <TableCell align="left">
                  {stats.market_data.total_volume.cad}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left">High 24h</TableCell>
                <TableCell align="left">
                  {stats.market_data.high_24h.cad}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left">Low 24h</TableCell>
                <TableCell align="left">
                  {stats.market_data.low_24h.cad}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left">Circulating Supply</TableCell>
                <TableCell align="left">
                  {stats.market_data.circulating_supply}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left">Max Supply</TableCell>
                <TableCell align="left">
                  {stats.market_data.max_supply}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )
    );
  };

  const displayDescription = (stats) => {
    return (
      <div className="desc_coin">
        <Title>Description</Title>
        <p>
          {Object.keys(stats).length > 0 &&
            stats.description.en.replace(/[^\w\s]/gi, "")}
        </p>
      </div>
    );
  };

  return (
    <div
      style={{
        width: "90%",
        height: 500,
        margin:'7% auto'
      }}
    >
      {addToFavourite()}
      {displayGraph()}
      {displayGraphInterval()}
      {displayPriceConvertor()}
      {displayStats(stats)}
      {displayDescription(stats)}
    </div>
  );
}
