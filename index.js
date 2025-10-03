const express = require("express");
const app = express();

app.get("/callback", (req, res) => {
  const code = req.query.code;
  res.send(`
    <h2>✅ App instalada en tu tienda</h2>
    <p>Este es tu authorization_code: <b>${code}</b></p>
    <p>Copialo y usalo en tu Colab para pedir tokens.</p>
  `);
});

app.listen(3000, () => console.log("Server running"));
