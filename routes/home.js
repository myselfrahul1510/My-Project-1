const express = require("express")
const router = express.Router();
const wrapAsync = require("../Utils/wrapAsync.js")
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js")
const multer = require ('multer')
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage })


router.route("/")
.get( wrapAsync(listingController.indexListing))
.post(isLoggedIn,upload.single("listing[Image]"), validateListing, wrapAsync(listingController.createListings));