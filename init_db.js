// This script initializes the SQLite database and creates the "users" table
const sqlite3 = require('sqlite3').verbose();

// Creates or opens the database file
const db = new sqlite3.Database('./neonrpm.db');

// Creates the 'users' table if it doesn't exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT,
  created_at TEXT DEFAULT (datetime('now'))
)`, (err) => {
    if (err) {
      return console.error('Notif: Failed to create users table:', err.message);
    }
    console.log('Notif: Users table initialized.');
  });
});
