const User = require("../models/user.js");

// Sign-Up form
module.exports.signUpForm = (req, res) => {
    res.render("users/signup.ejs")
}

// Sign-Up Post request 
module.exports.signUp = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({
            email, username
        });
        const registeredUser = await User.register(newUser, password)
        // console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
            }
            req.flash("success", "Welcome to WanderLust");
            res.redirect("/listings")
        })

        
    }
    catch (e) {
        req.flash("error", e.message)
        res.redirect("/signup")
    }
}

// Login Form 
module.exports.loginForm =(req, res) => {
    res.render("users/login.ejs")
}

//Login Post request
module.exports.login = async(req,res)=> {
req.flash("success", "You are logged in!!!")
let redirectUrl = res.locals.redirectUrl || "/listings"
res.redirect(redirectUrl) }

//Logout get request
module.exports.logOut = (req, res, next) =>{
    req.logout((err) => {
        if(err) {
           return next(err);
        }
        req.flash("success", "You are logged out!!!");
        res.redirect("/listings");
    })

}