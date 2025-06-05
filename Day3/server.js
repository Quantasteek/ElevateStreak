require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

const port = process.env.PORT || 3000; // fallback 

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

let books = [{
    id: "1",
    title: "1984",
    author: "George Orwell" 
}];

app.get('/books', (req, res) => {
  res.json(books);
});

app.post('/books', (req, res) => {
    const data = req.body;
  
    // Array of data
    if (Array.isArray(data)) {
      const validBooks = data.filter(
        (b) => b.id && b.title && b.author
      );
  
      if (validBooks.length !== data.length) {
        return res.status(400).json({ error: 'All books must have id, title, and author' });
      }
  
      books.push(...validBooks);
      return res.status(201).json({ message: 'Books added', books: validBooks });
    }
  
    // Single data 
    const { id, title, author } = data;
    if (!id || !title || !author) {
      return res.status(400).json({ error: 'id, title, and author are required' });
    }
  
    books.push({ id, title, author });
    res.status(201).json({ message: 'Book added', book: { id, title, author } });
  });



app.put('/books/:id', (req, res) => {
  const bookId = req.params.id;
  const { title, author } = req.body;

  const book = books.find(b => b.id === bookId);
  if (!book) return res.status(404).json({ error: 'Book not found' });

  if (title) book.title = title;
  if (author) book.author = author;

  res.json({ message: 'Book updated', book });
});

app.delete('/books/:id', (req, res) => {
  const bookId = req.params.id;
  const index = books.findIndex(b => b.id === bookId);

  if (index === -1) return res.status(404).json({ error: 'Book not found' });

  const removed = books.splice(index, 1);
  res.json({ message: 'Book removed', book: removed[0] });
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

