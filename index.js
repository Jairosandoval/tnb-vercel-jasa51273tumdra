const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.status(200).send("OK - TuMundoUtil callback server");
});

app.get("/callback", async (req, res) => {
  // Log para ver qué llega
  console.log("Callback query:", req.query);

  const { code, state, shop } = req.query;

  // Solo exigimos 'code'. Si falta 'state', seguimos igual.
  if (!code) {
    return res.status(400).send("Missing code");
  }
  if (!state) {
    console.warn("Warning: state ausente en callback");
  }

  try {
    const resp = await fetch("https://api.tiendanube.com/apps/authorize/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "TuMundoUtil-App (contacto@tumundoutil.com.ar)"
      },
      body: JSON.stringify({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: "authorization_code",
        code
      })
    });

    if (!resp.ok) {
      const text = await resp.text();
      return res.status(500).send(`Token exchange failed: ${resp.status} ${text}`);
    

    // const data = await resp.json(); // si querés guardar token/scope

    // Redirigir al admin de la tienda (Apps)
    return res.redirect(302, "https://tumundoutil.mitiendanube.com/admin/v2/apps");
  } catch (err) {
    return res.status(500).send(`Error: ${err?.message || err}`);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
