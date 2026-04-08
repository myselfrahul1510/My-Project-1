const mongoose =  require("mongoose")
const initData = require("./data.js")
const Listing = require("../models/listing.js")

// Mongo connection
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"

async function main() {
    await mongoose.connect(MONGO_URL);
}

main().then(() => {
    console.log("Your Database is connected Successfully")
}).catch((err) => {
    console.log(err)
});

// starting data entry

const initDB = async () => {
    await Listing.deleteMany({})
    initData.data = initData.data.map((obj) => ({...obj, owner:"69cf937edb80cbf0edc914f9" }));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized")
};

initDB();