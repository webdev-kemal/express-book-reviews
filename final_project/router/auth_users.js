const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();
const SECRET_KEY = "fingerprint_customer";

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  return !!user;
};

// only registered users can login
regd_users.post("/login", (req, res) => {
  // write your code here
  const username = req.body.username;
  const password = req.body.password;

  // check credentials
  if (authenticatedUser(username, password)) {
    // generate token
    const token = jwt.sign({ _id: username }, SECRET_KEY);

    // store the token in the user's session
    req.session.token = token;

    return res
      .status(200)
      .json({ token: token, message: "Logged in successfully" });
  } else {
    return res
      .status(400)
      .json({ message: `Invalid username or password: ${username}` });
  }
});

// regd_users.post("/login", (req, res) => {
//   const { username, password } = req.body;

//   const user = users.find(
//     (u) => u.username === username && u.password === password
//   );

//   if (!user) {
//     return res.status(401).json({ message: "Invalid username or password" });
//   }

//   const token = jwt.sign({ _id: user.username }, SECRET_KEY);
//   req.session.token = token;

//   return res.status(200).json({ token, message: "Logged in successfully" });
// });

// add book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: "Review added/updated successfully" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: "Review not found" });
  }

  delete books[isbn].reviews[username];

  return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
