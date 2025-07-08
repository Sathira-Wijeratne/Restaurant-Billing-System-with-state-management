require('dotenv').config(); // initializes and loads environment variables from a .env file
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = process.env.NODE_ENV === 'production' 
    ? process.env.CLIENT_URL 
    : process.env.LOCAL_CLIENT_URL;

app.use(cors({
    origin: allowedOrigins,
    credentials: true, // allows cookies/credentials
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Without this, browsers block your login POST requests
    allowedHeaders: ['Content-Type', 'Authorization'] // custom headers aren't allowed by default in CORS
}));

// import routes
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');

// use routes
app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});