const express = require("express")
const router = express.Router();
const wrapAsync = require("../Utils/wrapAsync.js")
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js")
const multer = require ('multer')
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage })

// https://my-project-1-wanderlust.onrender.com/
// for running page 
router.route("https://my-project-1-wanderlust.onrender.com/")
.get( wrapAsync(listingController.indexListing))
.post(isLoggedIn,upload.single("listing[Image]"), validateListing, wrapAsync(listingController.createListings));

// Index Route & Create Route
router.route("/")
.get( wrapAsync(listingController.indexListing))
.post(isLoggedIn,upload.single("listing[Image]"), validateListing, wrapAsync(listingController.createListings));

//New Route
router.get("/new", isLoggedIn, listingController.newRender )

// Show Route & Update Route & Delete Route
router.route("/:id")
.get(wrapAsync(listingController.showListings))
.put(isLoggedIn, isOwner,upload.single("listing[Image]"), validateListing, wrapAsync(listingController.updateListings))
.delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing))

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListings))
module.exports = router