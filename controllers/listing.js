const Listing = require("../models/listing")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// Index Route
module.exports.indexListing = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("Listings/index.ejs", { allListings })
}

//New Route
module.exports.newRender = (req, res) => {
    res.render("Listings/new.ejs")
}

// Show Route
module.exports.showListings = async (req, res) => {
    let { id } = req.params;
    let listItem = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner")
    if (!listItem) {
        req.flash("error", "Listing you requested for does not exits!!!")
        return res.redirect("/listings")
    }
    // console.log(listItem)
    res.render("Listings/show.ejs", { listItem })
}

// Create Route
module.exports.createListings = async (req, res, next) => {
    try {
        let response = await geocodingClient.forwardGeocode({
            query: req.body.listing.location,
            limit: 1
        }).send();
        let url = req.file.path;
        let filename = req.file.filename;
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.Image = { url, filename }
        newListing.geometry = response.body.features[0].geometry
        console.log(await newListing.save());
        req.flash("success", "New Listing Created Successfully!!!")
        return res.redirect("/listings")

    } catch (err) {
        next(err);

    }
}
// Edit Route
module.exports.editListings = async (req, res, next) => {
    try {
        let { id } = req.params;
        let listItem = await Listing.findById(id)
        if (!listItem) {
            req.flash("error", "Listing you requested for does not exits!!!")
            return res.redirect("/listings")
        }
        //  ei condition ta chatgpt help nie banano
        let originalImage = listItem.Image.url;
        if (originalImage.includes("cloudinary")) {
            originalImage = originalImage.replace(
                "/upload",
                "/upload/h_200,c_fill"
            );
        } else {
            originalImage = originalImage + "&w=100&h=250";
        }
        return es.render("Listings/edit.ejs", { listItem, originalImage })

    } catch (err) {
        next(err)

    }
}

//Update Route
module.exports.updateListings = async (req, res, next) => {
    try {
        let { id } = req.params;
        let editListing = req.body.listing;
        // if (!req.body.listing) {                         // Ei tkhane ei 3te line lekhar karon buji ni
        //     throw new ExpressError(400, "Send valid data")
        // }
        let listing = await Listing.findByIdAndUpdate(id, editListing, { new: true, runValidators: true })
        if (typeof req.file !== "undefined") {
            let url = req.file.path;
            let filename = req.file.filename;
            listing.Image = { url, filename }
            await listing.save();
        }
        req.flash("success", "Listing Updated Successfully!!!")
        return res.redirect(`/listings/${id}`)
    } catch (err) {
        next(err);
    }
}

//Delete Route
module.exports.destroyListing = async (req, res, next) => {
    try {
        let { id } = req.params
    await Listing.findByIdAndDelete(id)
    console.log("Delete Successfully")
    req.flash("success", "Listing Deleted Successfully!!!")
    return res.redirect("/listings")
    } catch (err) {
        next(err)
    }
}