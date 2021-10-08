import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select/Select";
import MenuItem from "@mui/material/MenuItem/MenuItem";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel/InputLabel";
import CircularProgress from "@mui/material/CircularProgress/CircularProgress";

/**
 *todo - use snackbar material ui to notify buy bitcoin
 *todo - use formik and yup for form validation and check balance before processing 
 */
export default function Buy() {
  const [coinsList, setCoinsList] = useState(0);
  const [defaultCoin, setDefaultCoin] = useState("bitcoin");
  const [coinPrice, setCoinPrice] = useState(0);
  const [amountInvest, setAmountInvest] = useState(null);
  const [quantityBought, setQuantityBought] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(e)
  };

  const handleChange = (e) => {
    setDefaultCoin(e.target.value);
  };

  const handleInputChange = (e) => {
    setAmountInvest(e.target.value);
    setQuantityBought(
      Number.parseFloat((1 / coinPrice) * e.target.value).toFixed(7)
    );
  };

  useEffect(() => {
    async function getCoinsList() {
      try{

        let url =
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=cad&order=market_cap_desc&per_page=50&page=1&sparkline=false";
        let result = await fetch(url)
        .then((res) => res.json())
        .then((data) => data)
        .catch((err) => console.error(err));
        setCoinsList(JSON.stringify(result));
      }catch(e){
        console.error('error inside getcoinlist',e)
      }
    }
    async function getCoinPrice() {
      try{
        let priceOfCoinInCurrency = `https://api.coingecko.com/api/v3/simple/price?ids=${defaultCoin}&vs_currencies=cad`;
        let result = await fetch(priceOfCoinInCurrency)
        .then((res) => res.json())
        .then((data) => data)
        .catch((err) => console.error(err));
        setCoinPrice(Number(Object.values(result)[0]?.cad));
      }catch(e){
        console.error('error fetching getcoinprice',e)
      }
      if (amountInvest !== null) {
        setQuantityBought(
          Number.parseFloat((1 / coinPrice) * amountInvest).toFixed(7)
        );
      } else {
        setQuantityBought(null);
      }
    }
    getCoinsList();
    getCoinPrice();
  }, [amountInvest,coinPrice,coinsList, defaultCoin]);



  return (
    <>
      <Box
        sx={{
          marginTop: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Grid item xs={6}>
          <Typography variant="h5">Buy Coin</Typography>
          <Typography name="coinPrice" variant="h6">{coinPrice}</Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <InputLabel id="coin-label">Coin</InputLabel>
                {coinsList ? (
                  <Select
                    labelId="coin-label"
                    id="coin-select"
                    name="coinName"
                    value={defaultCoin}
                    label="Coin"
                    onChange={handleChange}
                  >
                    {coinsList &&
                      JSON.parse(coinsList).map((e) => (
                        <MenuItem key={e.id} value={e.id}>
                          {e.name}
                        </MenuItem>
                      ))}
                  </Select>
                ) : (
                  <CircularProgress />
                )}
              </Grid>

              <Grid item xs={12}>
                <OutlinedInput
                  id="filled-adornment-amount"
                  name="amountInvested"
                  value={amountInvest}
                  onChange={handleInputChange}
                  startAdornment={
                    <InputAdornment position="start">$</InputAdornment>
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" name="quantityBought">
                  {" "}
                  {defaultCoin} - {quantityBought}
                </Typography>
              </Grid>
            </Grid>
            <Button
              type="submit"
              color="success"
              size="large"
              variant="contained"
              sx={{ mt: 3, mb: 2, pl: 5, pr: 5 }}
            >
              Buy
            </Button>
          </Box>
        </Grid>
      </Box>
    </>
  );
}
