/**
 * @design by milon27
 */
const bcryptjs = require('bcryptjs')
const nodemailer = require('nodemailer'); // add this line to import nodemailer
const AuthModel = require('../../models/authModel/AuthModel')
const Response = require('../../models/Response')
// const DB_Define = require('../../utils/DB_Define')
const Define = require('../../utils/Define')
const Helper = require('../../utils/Helper')
const sendEmailNotification = require("../../models/notificationModel/notificationModel");
const uuid = require('uuid');
const moment = require('moment');
const pool = require('../../models/config'); // Require your MySQL connection pool


// const csrf = require('csurf');
// const csrfProtection = csrf({ cookie: true });

const generateRandomToken = () => {
    return Math.random().toString(36).substr(2) + Date.now().toString(36);
};

const AuthController = {
    /**
     * @description  
     * get email, name, pass from req.body
     * do validatioin
     * ck already have an account or not(mySql Optional,Mongo required)
     * create password hash,save into database
     * generate a jwt access token,set into http cookie
     * return new user object as response
     * @param { email, name, pass} =req.body
     * @response {error(boolean), message(String), response(object:USER)}
     */

    // forget Password

    forgotPassword: (req, res) => {
        try {
            const { email_id } = req.body;
            if (!email_id) {
                throw new Error("Please provide your email");
            }
            // Fetch the user data from the database using email_id
            new AuthModel().getUserByEmail(email_id, async (err, results) => {
                try {
                    if (err) {
                        throw err
                    } else {
                        if (results.length == 0) {
                            throw new Error("no user found with this email")
                        }
                        const user = results[0]

                        //get token and set into cookie
                        // const token = Helper.getJWTtoken(email_id)
                        const token = uuid.v4();
                        const expiration = moment().add(5, 'minutes');
                        const randomString = generateRandomToken();
                        const link = `http://localhost:3001/auth/resetPassword/${randomString}?token=${token}`;


                        pool.query('INSERT INTO tokens (token , expiration) VALUES(? , ?)', [token, expiration.format("YYYY-MM-DD HH:mm:ss")], (err, results) => {
                            if (err) {
                                console.log('error in storing token and expiration time', err)
                            } else {
                                console.log("token and expiration time saved in database")
                            }
                        })
                        // actual sending of mail


                        //   res.send("");

                        //send token in http cookie 
                        res.cookie(Define.TOKEN, token, Define.SESSION_COOKIE_OPTION)
                        user['token'] = token
                        // sending email notification
                        let shouldSendEmail = true;
                        const recipient = email_id; // use the email from the login
                        const subject = " Password Reset " + user.user_name + " !";
                        const emailTemplate = `
            Hello ${user.user_name},
            
            Click on the following link to reset your password:${link}
            
            With warm regards,
            [My Health Saver]
            
            Note: This email is intended solely for the named recipient and may contain confidential or privileged information. If you have received this email in error, please notify us immediately and delete it from your system.`;

                        sendEmailNotification(shouldSendEmail, recipient, subject, emailTemplate);

                        res.status(200).json(new Response(false, "Mail send successfully !!!", user))
                    }
                } catch (e) {
                    let response = new Response(true, e.message, e);
                    res.send(response);
                }


            })
        } catch (e) {
            let response = new Response(true, e.message, e);
            res.send(response);
        }
    },

    //reset thepassword after the getting email of reset link
    resetPassword:  (req, res) => {
        console.log("Route triggered!");
        const { token, randomString, email_id } = req.query;
        // const { randomString } = req.params;

        console.log("Received randomString:", randomString);
        console.log("Received token:", token);
        console.log("Received email", email_id);

        try {
            const [rows] =  pool.promise().query('SELECT expiration FROM tokens WHERE token = ?', [token]);

            if (rows.length > 0) {
                const expirationTime = moment(rows[0].expiration);

                if (expirationTime.isAfter(moment())) {
                    // Token is valid, allow navigation to google.com or any other URL
                    res.redirect("http://localhost:3001/auth/resetPassword");
                } else {
                    // Token has expired
                    res.send("This link has expired.");
                }
            } else {
                // Token not found or invalid
                res.send("Invalid token.");
            }
        } catch (error) {
            console.error("Error verifying token:", error);
            res.status(500).send("Error verifying token");
        }
    },

    //change the password after the getting email of reset link
    updatePassword: [Helper.verifyJWTtoken,(req, res) => {
        const { email_id, password } = req.body;

        console.log("email", email_id);
        console.log("password:", password);

        new AuthModel().updatePassword(email_id, password, async (err, result) => {
            if (err) {
                console.error("Error while updating password:", err);
                res.status(500).json({ error: "Internal server error" });
            } else {
                console.log("Password updated successfully !!!");
                // sending email notification
                new AuthModel().getUserByEmail(email_id, async (err, results) => {
                    if (err) {

                        throw err
                    } else {
                        if (results.length == 0) {
                            throw new Error("no user found with this email")
                        }
                        const user = results[0]
                        let shouldSendEmail = true;
                        const recipient = email_id; // use the email from the login
                        const subject = "Welcome back, " + user.user_name + " !";
                        const emailTemplate = `
    Hello ${user.user_name},

    Your Password is updated sucessfully.

    With warm regards,
    [My Health Saver]

    Note: This email is intended solely for the named recipient and may contain confidential or privileged information. If you have received this email in error, please notify us immediately and delete it from your system.`;

                        sendEmailNotification(shouldSendEmail, recipient, subject, emailTemplate);
                        res.json({ message: "Password updated successfully !!!", result });
                    }

                });
            }
        })
    }],


    //login
    login: async (req, res) => {
        try {
            const { email_id, password } = req.body
            //validatioin
            if (!email_id || !password) {
                throw new Error("Enter email,password")
            }
            //check user is available or not in db
            new AuthModel().getUserByEmail(email_id, async (err, results) => {
                try {
                    if (err) {
                        throw err
                    } else {
                        if (results.length == 0) {
                            throw new Error("no user found with this email")
                        }
                        const user = results[0]
                        // const ckPass = await compare(password, user.password)
                        if (password != user.password) {
                            throw new Error("Wrong email or password")
                        }
                        //get token and set into cookie
                        const role_name=user.role_name;
                        const token = Helper.getJWTtoken(email_id,role_name)
                        //send token in http cookie 
                        res.cookie(Define.TOKEN, token, Define.SESSION_COOKIE_OPTION)
                        delete user.password
                        user['token'] = token
                        // sending email notification
                        let shouldSendEmail = true;
                        const recipient = email_id; // use the email from the login
                        const ccRecipient = [email_id];
                        const subject = "Login Successful - Welcome Back" + user.user_name + " !";
                        const emailTemplate = `
            Hello ${user.user_name},
   
            Welcome back to our platform! We're delighted to see you again.

            You have successfully logged in to your account. With your login, you can access a variety of features and services tailored to your needs. Whether it's managing your profile, exploring new content, or connecting with our community, we're here to make your experience seamless.
            
            Thank you for choosing us. If you have any questions or need assistance, feel free to reach out to our support team. We're here to help.
            
            With warm regards,
            [CB]
        
            Note: This email is intended solely for the named recipient and may contain confidential or privileged information. If you have received this email in error, please notify us immediately and delete it from your system.`;

            sendEmailNotification(shouldSendEmail, recipient, ccRecipient, subject, emailTemplate);

                        res.status(200).json(new Response(false, "user logged in successfully", user))
                    }
                } catch (e) {
                    let response = new Response(true, e.message, e);
                    res.send(response);
                }
            })//end db
        } catch (e) {
            let response = new Response(true, e.message, e);
            res.send(response);
        }
    },

    //logout
    logout: [ Helper.verifyJWTtoken,(req, res) => {
        res.cookie(Define.TOKEN, "", Define.LOGOUT_COOKIE_OPTION)
        res.status(200).json(new Response(false, "user logged out", {}))
    }],


    //check the user is the logdin isLoggedIn

    isLoggedIn: [ Helper.verifyJWTtoken,(req, res) => {
        try {
            const token = req.cookies.token
            if (!token) {
                throw new Error("Unauthorized Access")
            }
            //token validation
            Helper.verifyJWTtoken(token)
            res.send(true)// logged in
        } catch (e) {
            //remove the old/expire token
            res.cookie("token", "", Define.LOGOUT_COOKIE_OPTION)
            res.send(false)//not logged in
        }
    }]
}

module.exports = AuthController