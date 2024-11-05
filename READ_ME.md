# BookNotes

BookNotes is a web application designed for users to search for books, create notes for their favorite books, and manage personal notes. This project uses Node.js, Express.js, and PostgreSQL for the backend, and EJS for rendering views.

## Features

- **User Authentication**: Secure signup and login functionalities.
- **Search Books**: Integrated book search functionality.
- **Create and Edit Notes**: Ability to create, edit, and manage notes for individual books.
- **Responsive Design**: User-friendly design with a sticky navigation bar and modals for viewing and creating notes.

## Installation

1. **Clone the repository:**
2. **Install dependencies:**
npm install
3. **Set up SQL database :**
CREATE DATABASE bookproject;
\c bookproject

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  author VARCHAR(255),
  title VARCHAR(255),
  coverid VARCHAR(255),
  key VARCHAR(255) UNIQUE
);

CREATE TABLE users_notes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  book_id INTEGER REFERENCES books(id),
  note TEXT NOT NULL
);

4. **Create a .env file with the following contents:**
PG_SQL_KEY="yourPassword"

5. **Run the application:**
node index.js