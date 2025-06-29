require('dotenv').config(); // initializes and loads environment variables from a .env file
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000" ,
    credentials: true // allows cookies/credentials
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