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


app.get("/hae", (req, res) => {
  const hakuehto = req.query.hakuehto; 
  const query = `
    SELECT title, length, description 
    FROM film 
    WHERE title LIKE ?
  `;
  const connection = mysql.createConnection(dbconfig);
  connection.connect();
  connection.query(query, [`%${hakuehto}%`], (err, movies) => {
    if (err) {
      throw err;
    }
    const genreQuery = "SELECT name FROM category";
    connection.query(genreQuery, (err, genres) => {
      if (err) {
        throw err;
      }
      res.render("genret", { genres: genres, movies: movies, hakuehto: hakuehto });
    });
  });
});

app.get("/genret", (req, res) => {
  const query = "SELECT name FROM category";
  const connection = mysql.createConnection(dbconfig);
  connection.connect();
  connection.query(query, (err, genres) => {
    if (err) {
      throw err;
    }
    const query2 = `
      SELECT film.title, film.length, film.description 
      FROM film 
      JOIN film_category ON film.film_id = film_category.film_id
      JOIN category ON film_category.category_id = category.category_id
    `;
    connection.query(query2, (err, movies) => {
      if (err) {
        throw err;
      }
      res.render("genret", { genres: genres, movies: movies, hakuehto: "" });
    });
  });
});

app.get("/genret/:genre", (req, res) => {
  const genre = req.params.genre;
  const query = `
    SELECT film.title, film.length, film.description 
    FROM film 
    JOIN film_category ON film.film_id = film_category.film_id
    JOIN category ON film_category.category_id = category.category_id
    WHERE category.name = ?
  `;
  const connection = mysql.createConnection(dbconfig);
  connection.connect();
  connection.query(query, [genre], (err, movies) => {
    if (err) {
      throw err;
    }
    res.json({ movies: movies });
  });
});


app.listen(port, host, () => {
  console.log(`Server running on http://${host}:${port}`);
});
