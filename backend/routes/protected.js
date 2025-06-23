const express = require('express');
const router = express.Router();

const {authenticateToken}= require("../middleware/auth");

router.get('/protected', authenticateToken, (req, res) => {
    res.json({message: 'This is a protected route', user: req.user});
});

router.get('/verify-token', authenticateToken, (req, res) => { // what happens here when authenticateToken is passes as a parameter, is it called? what are the parameters being passed to it if so?
    res.json({valid: true, user: req.user});
});

module.exports = router;