import React, { useState, useEffect } from 'react';
const axios = require('axios');

export default function CoinPrice({ id }) {
  const [price, setPrice] = useState(0);

  const priceUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=cad`;

  useEffect(() => {
    function getCryptoPrice() {
      axios
        .get(priceUrl)
        .then((res) => {
          let priceOfCoin = Object.values(res.data)[0].cad;
          setPrice(priceOfCoin);
        })
        .catch((err) => console.error(`Error inside getCryptoPrice -> ${err}`));
    }
    getCryptoPrice();
    const getCryptoPriceTimer = setInterval(() => getCryptoPrice(), 200000);
    return () => {
      clearInterval(getCryptoPriceTimer);
    };
  }, [priceUrl]);

  return (
    <div className="price_convertor_div">
      <label htmlFor="dollarToCoin">
        Price of {id}= {price}
      </label>
    </div>
  );
}
