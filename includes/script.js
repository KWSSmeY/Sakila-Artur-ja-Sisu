fetch("/data")
  .then((response) => response.json())
  .then((data) => {
    const info1Div = document.getElementById("info1");
    const info2Div = document.getElementById("info2");

    data.info1.forEach((item) => {
      const p = document.createElement("p");
      p.textContent = item.malli;
      info1Div.appendChild(p);
    });

    data.info2.forEach((item) => {
      const p = document.createElement("p");
      p.textContent = item.malli;
      info2Div.appendChild(p);
    });
  })
  .catch((error) => console.error("Error fetching data:", error));
