/**
 * @design by milon27
 */
const express = require('express')
const router = express.Router()
const AuthController = require('../../controllers/authController/AuthController')
// const csrf_mid = require('../middleware/csrf_mid')


/**
 * @description 2. login user
 * @param { email:String, pass:String } = req.body
 * @endpoint http://localhost:3003/auth/login
 * @example same
 */
router.post('/login', AuthController.login)

//csrf protected route
//applicable on post put delete
// router.use(csrf_mid.csrfProtection)

/**
 * @description 3. logout user
 * @endpoint http://localhost:3003/auth/logout
 * @example same
 */
router.get('/logout', AuthController.logout)
/**
 * @description 4. ck logged in or not
 * @endpoint http://localhost:3003/auth/is-loggedin
 * @example same
 */
router.get('/is-loggedin', AuthController.isLoggedIn)

/**
 * @description 5. forget password
 * @endpoint http://localhost:3003/auth/forget-password
 * @example same
 */
router.post('/forget-password', AuthController.forgotPassword)
router.get("/reset/password/:randomString", AuthController.resetPassword);

/**
 * @description 6. change password
 * @endpoint http://localhost:3003/auth/change-password
 * @example same
 */
router.put("/change-password", AuthController.updatePassword);


module.exports = router