import React from "react";


import FavouriteList from "./FavouriteList";

export default function Favourite() {
  const favCoins = JSON.parse(localStorage.getItem("favouriteCoins"))
    ? JSON.parse(localStorage.getItem("favouriteCoins"))
    : [];

  return (
   
        <FavouriteList favCoinsLists={favCoins} />
   
  );
}
