const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const { port, host } = require("./configs/config.json");
const dbconfig = require("./configs/dbconfig.json");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "sivupohjat"));

function getInfo(res, query) {
  const connection = mysql.createConnection(dbconfig);
  connection.connect();
  connection.query(query, (err, rows) => {
    if (err) {
      throw err;
    }

    const shuffledFilms = rows.sort(() => Math.random() - 0.5);
    const selectedFilms = shuffledFilms.slice(0, 6);

    const films = selectedFilms.map((row) => ({
      title: row.title,
      length: row.length,
      description: row.description,
    }));

    res.json({ elokuvat: films });
  });
}

// Provide data endpoint
app.get("/data", (req, res) => {
  getInfo(res, "SELECT title, length, description FROM film");
});

// Serve static files from the 'styles' directory
app.use("/styles", express.static(path.join(__dirname, "styles")));

app.use("/photos", express.static(path.join(__dirname, "photos")));

app.get("/", (req, res) => {
  res.render("etusivu", {});
});

app.get("/elokuvat", (req, res) => {
  res.render("elokuva", {});
});

app.get("/yhteystiedot", (req, res) => {
  res.render("yhteystiedot", {});
});

app.get("/tietoa-meista", (req, res) => {
  res.render("tietoa-meistä", {});
});

app.listen(port, host, () => {
  console.log(`Server running on http://${host}:${port}`);
});
