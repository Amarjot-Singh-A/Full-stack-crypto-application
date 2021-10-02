import React, { useEffect, useState, useCallback } from "react";

import FavouriteList from "./FavouriteList";

export default function Favourite() {
  
  const [favCoins, setFavCoins] = useState([]);
  const fetchCoinsApi = useCallback(async () => {
    const url = "http://localhost:5000/favourite";
    const result = await fetch(url, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => data)
      .catch((err) => console.error("error in fetchCoinsapi", err));

    return result;
  }, []);
  


  useEffect(() => {
    async function setCoinsEffect() {
      let { coins } = await fetchCoinsApi();
      if (coins == null) {
        setFavCoins([]);
        localStorage.setItem("favouriteCoins", []);
      } else {
        let result = coins[0].coins;
        localStorage.setItem("favouriteCoins", result);
        console.log(result);
        setFavCoins(JSON.parse(result));
      }
    }
    setCoinsEffect();
  }, [fetchCoinsApi]);

  return <FavouriteList favCoinsLists={favCoins} />;
}
