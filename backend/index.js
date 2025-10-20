// import express
const express = require("express");
const dotenv = require("dotenv");
// import database config
const database = require("./config/datasbase");
const PORT = process.env.PORT || 3000;
// import routes
const route = require('./routes/index.route');
const app = express();
dotenv.config();
app.use(express.json());

// Connect to Database
database.connect();

// Routes
route(app);


app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
