const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/customer/auth/*", function auth(req, res, next) {
  // Get the token from session
  const token = req.session.token;

  // Check if the token is present
  if (!token) return res.status(401).send("Access Denied: No Token Provided!");

  // Verify the token
  try {
    const verified = jwt.verify(token, "fingerprint_customer");
    req.user = verified;
    next(); // If token is valid, proceed to the next middleware/route handler
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

// app.listen(PORT,()=>console.log("Server is running"));
app.listen(PORT, "127.0.0.1", () =>
  console.log(`Server is running on port ${PORT}`)
);
