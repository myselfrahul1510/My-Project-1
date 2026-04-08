const Review = require("../models/review.js")
const Listing = require("../models/listing.js")

// Reviews Route (Post)
module.exports.createReview = async(req, res) => {
   let listing = await Listing.findById(req.params.id);
   let newReview = new Review(req.body.review);
   newReview.author = req.user._id;
   listing.reviews.push(newReview)
   await newReview.save();
   await listing.save();
   req.flash("success", "Review Added Successfully!!")
   res.redirect(`/listings/${listing.id}`);
}

// Reviews-Delete Route
module.exports.destroyReview = async (req, res) => {
        let {id, reviewId} = req.params;
        // Pull use kora hoy jate DB thekeo object ID ta delete hoye jai pull ta use na korle just review ta delete hoy bt setar review id ta store thake listing er review array modhe.
        await Listing.findByIdAndUpdate(id, {$pull: { reviews: reviewId }});        
        await Review.findByIdAndDelete(reviewId);
        req.flash("success", "Review Deleted Successfully!!")
        res.redirect(`/listings/${id}`)
    }