require('dotenv').config(); // initializes and loads environment variables from a .env file
const jwt = require('jsonwebtoken');

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

// firebase imports - only use Admin SDK for backend
// const admin = require('./config/FirebaseAdmin');
const {db} = require('./config/FirebaseAdmin');

const app = express();
app.use(express.json());
app.use(cors());

const secretKey = process.env.JSON_WEB_TOKEN_SECRET_KEY; //process.env is a global object in Node.js that provides access to the environment variables of the current process.

// Middleware to authenticate JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Get token from 'Bearer TOKEN' format

    if (token == null) {
        return res.sendStatus(401); // If there's no token, return 401 Unauthorized
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.sendStatus(403); // If token is invalid or expired, return 403 Forbidden
        }
        req.user = user; // Attach the decoded user payload to the request object
        next(); // Proceed to the next middleware or route handler
    });
};

// Login endpoint
app.post('/api/login', async (req, res) => {
    // console.log(req);
    console.log("Hello");
    // console.log(req.body);
    const { email, password } = req.body;

    // Validate user credentials
    try {
        const usersRef = db.collection("users");
        const q = usersRef.where("email", "==", email);
        const querySnapshot = await q.get();

        if (querySnapshot.empty) {
            return res.status(401).json({message: 'Account not found'});
        }

        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        const isPasswordValid = await bcrypt.compare(password, userData.password);

        if (!isPasswordValid) {
            return res.status(401).json({message : 'Incorrect password'});
        }

        // generate JWT using ID and other relevant info in the payload
        const payload = {id:userDoc.id, email: userData.email};
        const accessToken = jwt.sign(payload, secretKey, {expiresIn: '15m'});

        res.json({accessToken : accessToken});
    } catch (error) {
        console.error("Login failed", error);
        res.status(500).json({message: 'Login failed. Please try again.'});
    }
});

// Example of a protected backend route
app.get('/api/protected', authenticateToken, (req, res) => {
    // If we reach here, the token was valid and req.user contains the decoded payload
    res.json({ message: 'This is a protected route', user: req.user });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});