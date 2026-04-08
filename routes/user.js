const express = require("express")
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../Utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js")

const userController = require("../controllers/user.js")

// Sign-Up form & Sign-Up Post request 

router.route("/signup")
.get(userController.signUpForm )
.post(wrapAsync( userController.signUp ))

// Login Form & Login Post request
router.route("/login")
.get(userController.loginForm )
.post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true}), wrapAsync( userController.login ))


//Logout get request
router.get("/logout", userController.logOut)


module.exports = router;
