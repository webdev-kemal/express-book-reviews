const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and Password are required!" });
  }

  // check if  username already exists
  const existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    return res.status(409).json({ message: "Username already exists!" });
  }

  // if username doesn't exist, add as new
  users.push({ username, password });

  return res.status(201).json({ message: "User registered successfully!" });
});

// get books
public_users.get("/", function (req, res) {
  console.log("Fetching book list...");
  const bookList = Object.values(books);
  const formattedResponse = JSON.stringify(bookList, null, 4);
  res.setHeader("Content-Type", "application/json");
  res.status(200).send(formattedResponse);
});

// get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn; // Retrieve the ISBN from the request parameters

  // check if book with the provided ISBN exists
  if (books[isbn]) {
    const bookDetail = books[isbn];
    return res.status(200).json(bookDetail);
  } else {
    return res
      .status(404)
      .json({ message: "Book not found with the provided ISBN" });
  }
});

// get book details based on author
public_users.get("/author/:author", function (req, res) {
  const authorName = req.params.author;
  const bookKeys = Object.keys(books);

  // filter upon author
  const filteredBooks = bookKeys
    .filter(
      (key) => books[key].author.toLowerCase() === authorName.toLowerCase()
    )
    .map((key) => books[key]);

  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  } else {
    return res
      .status(404)
      .json({ message: "No books found for the provided author" });
  }
});

// get all books based on title
public_users.get("/title/:title", function (req, res) {
  const titleName = req.params.title;
  const bookKeys = Object.keys(books);

  // filter books based on the provided title
  const filteredBooks = bookKeys
    .filter((key) =>
      books[key].title.toLowerCase().includes(titleName.toLowerCase())
    )
    .map((key) => books[key]);

  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  } else {
    return res
      .status(404)
      .json({ message: "No books found with the provided title" });
  }
});

//  get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  // check if the book with the provided ISBN exists
  if (books[isbn]) {
    const reviews = books[isbn].reviews;
    return res.status(200).json(reviews);
  } else {
    return res
      .status(404)
      .json({ message: "Book not found with the provided ISBN" });
  }
});

//AXIOS METHODS
const axios = require("axios");
const BASE_URL = "http://localhost:5000";

// fetch all books
async function getAllBooks() {
  try {
    const response = await axios.get(`${BASE_URL}/`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// by ISBN
async function getBookByISBN(isbn) {
  try {
    const response = await axios.get(`${BASE_URL}/isbn/${isbn}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// by author
async function getBooksByAuthor(author) {
  try {
    const response = await axios.get(`${BASE_URL}/author/${author}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// by title
async function getBooksByTitle(title) {
  try {
    const response = await axios.get(`${BASE_URL}/title/${title}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports.general = public_users;
