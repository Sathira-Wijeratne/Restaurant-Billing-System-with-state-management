const express = require('express');
const router = express.Router(); 
const bcrypt = require('bcryptjs');
const {db} = require("../config/FirebaseAdmin.js");
const jwt = require('jsonwebtoken');

const secretKey = process.env.JSON_WEB_TOKEN_SECRET_KEY; 

// Login endpoint
router.post('/login', async(req, res) => {
    console.log("Starting");
    // get the data
    const {email, password} = req.body;

    try {
        // check user in db
        const usersRef = db.collection("users"); //get reference for collection
        const q = usersRef.where("email", "==", email);
        const querySnapshot = await q.get(); // get() returns a QuerySnapshot containing all matching documents.
    
        if (querySnapshot.empty) {
            return res.status(401).json({message: 'Account not found'});
        }

        // get user data
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        const isPasswordValid = await bcrypt.compare(password, userData.password);

        // password validation
        if (!isPasswordValid){
            return res.status(401).json({message: 'Incorrect password'});
        }

        // create JWT
        const payload = {id:userDoc.id, email: userData.email};
        const accessToken = jwt.sign(payload, secretKey, {expiresIn:'15m'});

        return res.json({accessToken: accessToken});

    } catch (error){
        console.error('Login failed', error);
        res.status(500).json({message: 'Login failed. Please try again'});
    }
});

module.exports = router;