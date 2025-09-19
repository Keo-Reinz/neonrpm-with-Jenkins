const express = require('express');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// ==================== Database Setup ====================
// Connects to the SQLite database file neonrpm.db (or creates it if it doesn't exist)
const db = new sqlite3.Database('./neonrpm.db');

// ==================== Middleware Setup ====================
app.use(express.urlencoded({ extended: true }));
// Configures and enables session storage for login tracking
app.use(session({
  secret: 'neon-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: null,
    expires: false,
  }
}));


// ==================== Static File Access ====================
// Serve static files needed for login page (logo, css, etc.)
app.use(express.static('Login_html'));

// ==================== Session and Route Access Control ====================
// This blocks access to protected routes unless logged in or on specific public pages
app.use((req, res, next) => {
  const allowed = ['/login', '/login.html', '/register', '/register.html', '/health'];
  if (req.session.loggedIn || allowed.includes(req.path)) {
    return next();
  }
  res.redirect('/login.html');
});

// ==================== GET Route: Login History ====================

// This route is above the static middleware "app.use(express.static('public_html'));" ...
// ... so it can modify the HTML before sending.

// Handles request to display the list of registered users and their registration timestamps
app.get('/user_history.html', (req, res) => {
  const query = `SELECT id, username, created_at FROM users ORDER BY id ASC`;

  db.all(query, (err, users) => {
    if (err) {
      console.error("Notif: Failed to load user history:", err.message);
      return res.status(500).send("Could not load user list.");
    }

    fs.readFile(path.join(__dirname, 'public_html', 'user_history.html'), 'utf8', (err, html) => {
      if (err) {
        console.error("Notif: Failed to read HTML file:", err.message);
        return res.status(500).send("Could not load the user history page.");
      }

      let content = users.length
        ? users.map((user, index) => `
          <div class="border border-success rounded mb-3 p-3">
            <p class="text-secondary mb-1">
              <small>[${index + 1}] Registered User</small>
            </p>
            <div class="row">
              <div class="col-sm-8">
                <p class="text-success mb-1">Username</p>
                <p class="lead">${user.username}</p>
              </div>
              <div class="col-sm-4">
                <p class="text-success mb-1">Registration Date</p>
                <p class="text-light"><small>${new Date(user.created_at + ' UTC').toLocaleString()}</small></p>
              </div>
            </div>
          </div>
        `).join('')
        : `<div class="alert alert-warning">No users found.</div>`;

      const UserHistoryPage = html.replace('<!--USER-TABLE-->', content);
      res.send(UserHistoryPage);
    });
  });
});


// This must stay after any custom HTML injection routes
// Serve protected static files (main website)
app.use(express.static('public_html'));

// ==================== GET Routes ====================
app.get('/login.html', (req, res) => {
  console.log('Notif: GET /login.html');
  res.sendFile(path.join(__dirname, 'public_html', 'login.html'));
});

app.get('/register.html', (req, res) => {
  console.log('Notif: GET /register.html');
  res.sendFile(path.join(__dirname, 'Login_html', 'register.html'));
});

app.get('/logout', (req, res) => {
  console.log('Notif: GET /logout');
  req.session.destroy(() => res.redirect('/login.html'));
});

// ==================== POST Route: Login ====================
// Authenticates the login attempt by comparing the form data with the Database entries
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log(`Notif: POST /login - Attempt by user: ${username}`);

  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.get(query, [username, password], (err, user) => {
    if (err) {
      console.error('Notif: Login error:', err.message);
      return res.status(500).send('Server error');
    }

    if (!user) {
      console.warn('Notif: Invalid login attempt');

      fs.readFile(path.join(__dirname, 'public_html', 'login.html'), 'utf8', (err, html) => {
        if (err) return res.status(500).send('Error loading login page');
        const modified = html.replace('<!--ERROR-LOGIN-->', '<p style="color:red; text-align:center;">Invalid, Please try again.</p>');
        res.send(modified);
      });
      return;
    }

    console.log(`Notif: Login successful for user: ${username}`);
    req.session.loggedIn = true;
    req.session.username = user.username;
    res.redirect('/index.html');
  });
});

// ==================== POST Route: User Registration ====================
// Processes any new user registrations by inserting the credentials into the database (neonrpm.db)
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  console.log(`Notif: Register attempt: ${username}`);

  if (!username || !password) {
    return res.status(400).send('Missing username or password.');
  }

  const insertQuery = `INSERT INTO users (username, password) VALUES (?, ?)`;

  db.run(insertQuery, [username, password], function (err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        // Injects the error into the original registration HTML
        fs.readFile(path.join(__dirname, 'Login_html', 'register.html'), 'utf8', (readErr, html) => {
          if (readErr) {
            console.error('Notif: Error reading register.html:', readErr.message);
            return res.status(500).send('Server error');
          }

          // Replaces <!--ERROR--> with the inline error message
          const modifiedHtml = html.replace('<!--ERROR-REGISTER-->', `
            <div class="text-danger mt-2 text-center">Username is taken. Please try a different one.</div>
          `);

          res.send(modifiedHtml);
        });
        return;
      }

      console.error('Notif: Registration error:', err.message);
      return res.status(500).send('Server error during registration.');
    }

    console.log(`Notif: New user registered: ${username}`);
    res.redirect('/login.html');
  });
});

// ==================== Health Check Route ====================
app.get('/health', (req, res) => res.status(200).send('ok'));


// ==================== Start Server ====================
// Only start the server if this file is run directly (not when imported by tests)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Notif: NeonRPM server running at http://localhost:${PORT}`);
  });
}

module.exports = app; // Export app for testing

