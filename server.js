const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Load books data from JSON file
const booksFilePath = path.join(__dirname, "data", "books.json");
let books = [];

try {
  books = JSON.parse(fs.readFileSync(booksFilePath, "utf-8"));
} catch (error) {
  console.error("Error loading books data:", error);
}

// Search for books
app.get("/api/books", (req, res) => {
  const searchQuery = req.query.search?.toLowerCase() || "";

  if (!searchQuery) {
    return res.json(books);
  }

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery) ||
      book.author.toLowerCase().includes(searchQuery)
  );

  if (filteredBooks.length === 0) {
    return res.status(404).json({ message: "No books found" });
  }

  res.json(filteredBooks);
});

// Add new book
app.post("/api/books", (req, res) => {
  const { title, author, image } = req.body;

  if (!title || !author || !image) {
    return res.status(400).json({ message: "Title, author, and image are required" });
  }

  const newBook = {
    id: books.length + 1, // Generate new ID
    title,
    author,
    image,
  };

  books.push(newBook);

  // Save to JSON file
  fs.writeFileSync(booksFilePath, JSON.stringify(books, null, 2), "utf-8");

  res.status(201).json({ message: "Book added successfully", book: newBook });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
