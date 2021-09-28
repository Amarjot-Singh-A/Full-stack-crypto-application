import React from "react";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

// import { Link } from "react-router-dom";

export default function FavouriteItem({ coins }) {
  return (
    <div className="fav-items">
      {coins &&
        coins.map((obj, i) => {
          return (
            <div className="favourite_item">
              <Typography component="p" variant="h4">
                {Object.keys(obj)}
              </Typography>
              <Typography color="text.secondary" sx={{ flex: 1 }}>
                {Object.values(obj)}
              </Typography>
              <Link
                href={{ pathname: `/coin/${Object.keys(obj).join("")}` }}
                key={i}
                color="primary"
              >
                More Details
              </Link>
            </div>
          );
        })}
    </div>
  );
}

// {coins && coins.map((obj, i) => {
//     return <Link to = {{pathname : `/coin/${Object.keys(obj).join('')}`}} key={i}>
//     <div className='favourite_item'  >
//         <p>{Object.keys(obj)}</p>
//         <p>{Object.values(obj)}</p>
//     </div>
//     </Link>
// })}
