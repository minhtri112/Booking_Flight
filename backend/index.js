const express = require("express");
const app = express();
const PORT = 3000;


app.use(express.json());


app.get("/", (req, res) => {
  res.send("Hello Node.js fvdfd🚀");
});


app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
