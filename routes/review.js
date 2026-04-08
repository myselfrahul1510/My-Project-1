const express = require("express")
const router = express.Router({mergeParams: true});
const wrapAsync = require("../Utils/wrapAsync.js")
const Review = require("../models/review.js")
const Listing = require("../models/listing.js")
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js")
const reviewController = require("../controllers/review.js")

// Reviews Route (Post)
router.post("/",isLoggedIn, validateReview , wrapAsync(reviewController.createReview))

// Reviews-Delete Route
router.delete("/:reviewId",isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview))

module.exports = router