const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const { port, host } = require("./configs/config.json");
const dbconfig = require("./configs/dbconfig.json");

const app = express();

function getInfo(res, kysely) {
  const connection = mysql.createConnection(dbconfig);
  connection.connect();
  connection.query(kysely, (err, rows) => {
    if (err) {
      throw err;
    }

    const info1 = [];
    const info2 = [];
    for (let i = 0; i < rows.length; i++) {
      if (i % 2 === 0) {
        info1.push(rows[i]);
      } else {
        info2.push(rows[i]);
      }
    }

    // Send data as JSON
    res.json({ info1, info2 });
  });
}

// Serve static files from the 'styles' directory
app.use("/styles", express.static(path.join(__dirname, "styles")));

// Serve the HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "includes", "index.html"));
});

// Provide data endpoint
app.get("/data", (req, res) => {
  getInfo(res, "SELECT * FROM auto");
});

app.listen(port, host, () => {
  console.log(`Server running on http://${host}:${port}`);
});
