const express = require('express');
const postgres = require('postgres');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Database connection (using environment variable for production)
const sql = postgres(process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/zentalent');

app.get('/', (req, res) => {
  res.json({ message: 'Zentalent Backend (Node.js) is running!' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
