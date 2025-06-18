import React, { useState } from 'react';
const interactions = require('../../services/dataInteraction');

export default function CoinFav({ id }) {
  const [isFav, setIsFav] = useState(() => {
    let checkLocalStorage = localStorage.getItem('favouriteCoins');
    if (checkLocalStorage) {
      return checkLocalStorage.includes(id);
    } else {
      return false;
    }
  });

  /**
   *
   * todo - once you save the terminal isLogged on client side is getting false
   */
  const addToFavouriteHandler = async () => {
    console.log('isFav', isFav);
    if (!isFav) {
      if (localStorage.getItem('favouriteCoins')) {
        let favouriteCoinsArr = JSON.parse(
          localStorage.getItem('favouriteCoins'),
        );
        favouriteCoinsArr = [...favouriteCoinsArr, id];
        let result = await interactions.addCoinToList([
          ...new Set(favouriteCoinsArr),
        ]);
        console.log('result->', result);
        localStorage.setItem(
          'favouriteCoins',
          JSON.stringify([...new Set(favouriteCoinsArr)]),
        );

        setIsFav(true);
      } else {
        let result = await interactions.addCoinToList([id]);
        console.log('result->', result);
        localStorage.setItem('favouriteCoins', JSON.stringify([id]));
        setIsFav(true);
      }
    } else {
      let favouriteCoinsArr = JSON.parse(
        localStorage.getItem('favouriteCoins'),
      );
      let arrayAfterFavRemoval = favouriteCoinsArr.filter((e) => e !== id);
      let result = await interactions.addCoinToList(arrayAfterFavRemoval);
      console.log('result->', result);
      localStorage.setItem(
        'favouriteCoins',
        JSON.stringify(arrayAfterFavRemoval),
      );
      setIsFav(false);
    }
  };

  return (
    <button className="fav-button" onClick={addToFavouriteHandler}>
      {isFav ? 'Remove from favourite' : 'Add to favourite'}
    </button>
  );
}
