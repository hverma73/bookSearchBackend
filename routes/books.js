const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const booksFile = path.join(__dirname, "../data/books.json");

// Read books from JSON
const readBooks = () => {
  const data = fs.readFileSync(booksFile, "utf-8");
  return JSON.parse(data);
};

// Search Books API
router.get("/search", (req, res) => {
  const { query } = req.query;
  console.log("query:::::::::", query);
  const books = readBooks();

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(query.toLowerCase())
  );

  res.status(200).json(filteredBooks);
});

// Add Book API
router.post("/add", (req, res) => {
  const { title, author, image } = req.body;

  if (!title || !author || !image) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const books = readBooks();
  const newBook = { id: books.length + 1, title, author, image };

  books.push(newBook);
  fs.writeFileSync(booksFile, JSON.stringify(books, null, 2));

  res.status(201).json(newBook);
});

module.exports = router;
