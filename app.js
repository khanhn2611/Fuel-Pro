const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const mysql = require('mysql2');
const session = require('express-session');
const { register } = require('module');
const bcrypt = require('bcrypt');
const saltRounds = 10; // more security


app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))

require('dotenv').config(); // Load environment variables from .env file

const users = [];

app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
app.use(express.static('public')); 

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Create a connection pool for a locally installed MySQL server
const pool = mysql.createPool({
    host: process.env.DB_HOST, 
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_DATABASE, 
  });
  
  const promisePool = pool.promise();

  promisePool
    .query('SELECT 1')
    .then(() => {
        console.log('Database is connected');
    })
    .catch((error) => {
        console.error('Database connection error:', error);
    });

  // Configure express-session middleware
app.use(
    session({
        secret: 'your-secret-key', // Change this to a strong, random value
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, // Session duration (in milliseconds), e.g., 24 hours
        },
    })
);

app.get('/register', (req, res) => {
    res.render('register'); 
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    var isProfileCompleted = 0;

    if (!username || !password) {
        res.status(400).send('All fields are required');
    } else if (password.length < 6) {
        res.status(400).send('Password must be at least 6 characters long');
    } else {
        try {
            // Check if the username already exists in the database
            const [rows] = await promisePool.query('SELECT * FROM Users WHERE username = ?', [username]);
    
            if (rows.length > 0) {
                return res.status(400).send('Username already taken. Please choose another one.');
            }

            // If the username doesn't exist, hash the password
            bcrypt.hash(password, saltRounds, async (err, hash) => {
                if (err) {
                    console.error('Error hashing the password:', err);
                    return res.status(500).send('Internal server error');
                }

                // Store the hashed password in the database
                await promisePool.query('INSERT INTO Users (username, password, profileComplete) VALUES (?, ?, ?)', [
                    username,
                    hash, 
                    isProfileCompleted 
                ]);

                return res.status(200).send('Registration successful');
            });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).send('Username already taken. Please choose another one.');
            } else {
                console.error('Error registering the user:', error);
                return res.status(500).send('Internal server error');
            }
        }
    }
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Query the database to get the user with the username
        const [userRows] = await promisePool.query('SELECT * FROM Users WHERE username = ?', [username]);

        if (userRows.length > 0) {
            const user = userRows[0]; 

            // Compare the submitted password with the hashed password
            bcrypt.compare(password, user.password, async (err, isMatch) => {
                if (err) {
                    console.error('Error comparing password:', err);
                    return res.status(500).send('Internal server error');
                }

                if (isMatch) {
                    // Password matches, now let's get the user information
                    const [infoRows] = await promisePool.query('SELECT * FROM UserInformation WHERE user_id = ?', [user.id]);

                    if (infoRows.length > 0) {
                        const userInfo = infoRows[0];

                        const fullAddress = `${userInfo.address1} ${userInfo.address2 || ''}, ${userInfo.city}, ${userInfo.state} ${userInfo.zipcode}`;

                        req.session.user = { ...user, address: fullAddress.trim() }; // Trim in case address2 is empty

                        res.redirect('/hub');
                        
                    } else {
                        req.session.user = user;
                        res.redirect('/profile');
                    }
                } else {
                    res.status(401).send('Invalid username or password');
                }
            });
        } else {
            // Username does not exist
            res.status(401).send('Invalid username or password');
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Internal server error');
    }
});



app.get('/quote', (req, res) => {
    if (req.session && req.session.user) {
        // Render the fuel-quote-form view with the address
        res.render('fuel-quote-form', { address: req.session.user.address, city: req.session.user.city });
    } else {
        // If the user is not logged in, redirect to the login page
        res.redirect('/login');
    }
});

app.post('/quote', async (req, res) => {
    console.log(req.body);
    const userId = req.session.user.id;

    const {
        gallonsRequested,
        deliveryAddress,
        deliveryDate,
        suggestedPricePerGallon,
        totalAmountDue
    } = req.body;

    try {

        if (!gallonsRequested || !deliveryAddress || !deliveryDate || !suggestedPricePerGallon || !totalAmountDue) {
            throw new Error('All fields are required.');
        }
        
        const result = await promisePool.query(
            'INSERT INTO FuelQuotes (userId, gallonsRequested, deliveryAddress, deliveryDate, suggestedPricePerGallon, totalAmountDue) VALUES (?, ?, ?, ?, ?, ?)',
            [
                userId,
                gallonsRequested,
                deliveryAddress,
                deliveryDate,
                suggestedPricePerGallon,
                totalAmountDue
            ]
        );

    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).send('Internal server error');
    }
});



app.get('/profile', async (req, res) => {
    const user = req.session.user;
    
    if (user) {
        if (user.profileComplete === 0) {
            res.render('complete-profile');
        } else if (user.profileComplete === 1) {
            res.redirect('/quote');
        }
    } else {
        res.redirect('/login');
    }
});

app.post('/profile', async (req, res) => {
    const userId = req.session.user.id; // Get the user ID from the session
    const { fullName, address1, address2, city, state, zipcode } = req.body;

    try {
        // Update the userInformation table with the new profile information
        await promisePool.query(
            'INSERT INTO userInformation (user_id, fullName, address1, address2, city, state, zipcode) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, fullName, address1, address2, city, state, zipcode]
        );
        await promisePool.query('UPDATE Users SET profileComplete = ? WHERE id = ?', [1, userId]);
        res.redirect('/quote');
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).send('Internal server error');
    }
});



app.get('/', (req, res) => {
    res.render('homepage');
});

app.get('/history', (req, res) => {
    res.render('history');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get('/logout', (req, res) => {
    if (req.session.user) {
        // Log the username of the user who is logging out
        console.log(`User '${req.session.user.username}' is logging out`);
    }
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/login'); // Redirect to the login page after logout
    });
});

app.get('/get-user-info', (req, res) => {
    const username = req.query.username;
    const user = users.find(u => u.username === username);
    if (user) {
        const address = userAddresses[username];
        res.json({ address: address });
    } else {
        res.status(404).send('User not found');
    }
});

app.get('/getAddress', async (req, res) => {
    const { username } = req.query;
    try {
      const connection = await mysql.createConnection(dbConfig);
      const [rows] = await connection.execute(`
        SELECT address1, address2, city, state, zipcode
        FROM UserInformation
        INNER JOIN Users ON UserInformation.user_id = Users.id
        WHERE Users.username = ?
      `, [username]);
      if (rows.length > 0) {
        const userAddress = rows[0];
        const fullAddress = `${userAddress.address1} ${userAddress.address2}, ${userAddress.city}, ${userAddress.state}, ${userAddress.zipcode}`;
        res.json({ address: fullAddress });
      } else {
        res.status(404).json({ message: 'Address not found' });
      }
      await connection.end();
    } catch (err) {
      res.status(500).json({ message: 'Error fetching address', error: err.message });
    }
  });

app.get('/get-quote-history', (req, res) => {
    if (req.session && req.session.user && req.session.user.id) {
        promisePool.query('SELECT * FROM FuelQuotes WHERE userId = ?', [req.session.user.id])
            .then(([rows]) => {
                res.json(rows); 
            })
            .catch(error => {
                console.error('Error fetching quote history:', error);
                console.log(error);
                res.status(500).json({ error: 'Internal server error', details: error.message });
            });
    } else {
        res.status(403).json({ error: 'User not authenticated' });
    }
});

app.get('/hub', (req, res) => {
    res.render('hub'); 
});
