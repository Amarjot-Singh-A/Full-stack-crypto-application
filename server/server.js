// Require the file
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = require("./app");

// Express is listening to port
app.listen(port, () => console.log(`Listening to port ${port}`));

