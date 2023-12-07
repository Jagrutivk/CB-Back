require('dotenv').config();
const jwt = require('jsonwebtoken');
const moment = require('moment');
const Define = require('./Define');

const Helper = {
    //@get a date after 1 day @return miliseconds
    getExpireDay: (day = 1) => {
        return moment().add(day, Define.DAYS).valueOf();
    },
    //@return token:String
    getJWTtoken: (email_id, role_name, expires) => {
        const payload = {
            email_id: email_id,
            role_name:role_name
        };
        if (expires) {
            return jwt.sign(payload, process.env.ACCESS_SECRET, { expiresIn: expires });
        } else {
            return jwt.sign(payload, process.env.ACCESS_SECRET);
        }
    },
    //@return email:String || throw Error
    verifyJWTtoken: (req, res, next) => {
        try {
            const authHeader = req.headers.authorization; // Assuming the token is passed in the headers
    
            if (!authHeader) {
                throw new Error("Unauthorized Access");
            }
    
            const [bearer, token] = authHeader.split(' ');
    
            if (bearer !== 'Bearer' || !token) {
                throw new Error("Invalid token format");
            }
    
            const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
            const { email_id, role_name } = decoded;
    
            // Storing the email and role in the request object for future use if needed
            req.email_id = email_id;
            req.role_name = role_name;
    
            next(); // Call the next middleware function
        } catch (error) {
            res.status(401).json({ error: 'Unauthorized Access' });
        }
    }
    
    //
}
module.exports = Helper