export function sendData(data, postURL) {
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
