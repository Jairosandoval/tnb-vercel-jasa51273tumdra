app.get("/callback", async (req, res) => {
  console.log("Callback query:", req.query); // ver qué llega exactamente

  const { code, state, shop } = req.query;

  // Solo exigimos 'code'
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
    }

    // const data = await resp.json(); // opcional guardar

    return res.redirect(302, "https://tumundoutil.mitiendanube.com/admin/v2/apps");
  } catch (err) {
    return res.status(500).send(`Error: ${err?.message || err}`);
  }
});
