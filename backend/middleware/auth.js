const jwt = require('jsonwebtoken');
const secretKey = process.env.JSON_WEB_TOKEN_SECRET_KEY;

// method to verify the token received by the client
const authenticateToken = (req, res, next) =>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401);
    }

    // what happens here?
    jwt.verify(token, secretKey, (err, user) => { //what is 'user'?
        if (err) {
            return res.sendStatus(403);
        }

        req.user = user; //what is happening here?
        next();//what is happening here?
    });
};

module.exports = { authenticateToken };