const sendData = (data, postURL) => {
  return fetch(postURL, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => {
      let checkJson = res.headers
        .get("content-type")
        ?.includes("application/json")
      if (res && checkJson) {
        return res.json()
      } else {
        throw new Error("not a valid response from server")
      }
    })
    .then((data) => data)
    .catch((err) => {
      return { error: err.message }
    })
}


const addCoinToList = async (data) => {
  try {
    let url = 'http://localhost:5000/favourite';
    let result = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        let checkJson = res.headers
          .get("content-type")
          ?.includes("application/json");
        if (res && checkJson) {
          return res.json();
        } else {
          throw new Error("unknown server response");
        }
      })
      .then((data) => data)
      .catch((err) => console.error("error POST inside addCoinToList", err));

    return result;
  } catch (err) {
    console.error("unexpected error inside addcointolist", err);
  }
};



module.exports = {sendData,addCoinToList}