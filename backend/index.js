const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const database = require("./config/datasbase");
const route = require("./routes/index.route");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
database.connect();

// Mount routes
route(app);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
