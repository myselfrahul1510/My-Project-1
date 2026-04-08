if(process.env.NODE_ENV != "production") {
    require('dotenv').config()
}

const express = require("express");
const app = express();
const mongoose = require("mongoose")
const methodOverride = require('method-override');
const path = require("path")
const ejsMate = require("ejs-mate")
const ExpressError = require("./Utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport")
const localStrategy = require("passport-local")
const User = require("./models/user.js")

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));



// Atlas connection
const DBUrl = process.env.ATLAS_URL;
async function main() {
    await mongoose.connect(DBUrl);
}

// // Mongo connection
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"
// async function main() {
//     await mongoose.connect(MONGO_URL);
// }

const store = MongoStore.create({
    mongoUrl: DBUrl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600
})

store.on("error", (err) =>{
    console.log("ERROR in MONGO SESSION STORE", err);
})

const sessionOption = {
    value : store,          // shudhu store likhle bujte parche naa tai value store korte hobe 
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie: {
        expires: Date.now() + 10*24*60*60*1000,
        maxAge: 10*24*3600*1000,
        httpOnly: true,
    }
}

main().then(() => {
    console.log("Your Database is connected Successfully")
}).catch((err) => {
    console.log(err)
})

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
}) 

// Required from Routes Lising and Review files
const listingRouter =  require("./routes/listing.js");
const reviewRouter =  require("./routes/review.js");
const userRouter =  require("./routes/user.js");

// Run the Listing and review file
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!!!"))
})

app.use((err, req, res, next) => {
    // res.send("Something went wrong !!!");
    let { statusCode = 500, message = "Something Went Wrong" } = err;
    // res.status(statusCode).send(message);
    // res.render("error.ejs", {message})
    res.status(statusCode).render("error.ejs", {message})
}) 
app.listen(8080, () => {
    console.log("Server is listening to port 8080")
})

