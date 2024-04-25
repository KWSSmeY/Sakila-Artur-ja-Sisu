const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const { port, host } = require("./configs/config.json");
const dbconfig = require("./configs/dbconfig.json");


const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'sivupohjat'));



function getInfo(res, query1, query2) {
  const connection = mysql.createConnection(dbconfig);
  connection.connect();
  connection.query(query1, (err, rows1) => {
    if (err) {
      throw err;
    }

    connection.query(query2, (err, rows2) => {
      if (err) {
        throw err;
      }

      // Send data as JSON
      res.json({ films: rows1, categories: rows2 });
    });
  });
}

// Serve static files from the 'styles' directory
app.use("/styles", express.static(path.join(__dirname, "styles")));

app.use("/photos", express.static(path.join(__dirname, "photos")));


// Provide data endpoint
app.get("/data", (req, res) => {
  getInfo(
    res,
    "SELECT title FROM film",
    "SELECT * FROM category"
  );
});

app.get("/", (req, res) =>{
  res.render('etusivu', {});
});

app.listen(port, host, () => {
  console.log(`Server running on http://${host}:${port}`);
});
