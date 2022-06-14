// require("express-async-errors");
const env = require("dotenv").config();
const express = require("express");
const app = express();

require("./startup/routes")(app);

require("./startup/db")();

//logging errors with winston

//PORT
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}...`));
