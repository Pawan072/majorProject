const mongoose = require ("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema ({
    title:{ 
       type: String,
       required: true,
    },
    description: String,
    image: {
        type: String,
        default: "https://unsplash.com/photos/city-street-with-modern-buildings-and-people-walking-sTGjETtoToE", // for testing purpose add this one 
        set: (v)=> v==="" ? "https://unsplash.com/photos/city-street-with-modern-buildings-and-people-walking-sTGjETtoToE": v, // for client site work this line 
    },
    price: Number,
    location: String,
    country: String,
})

const listing = mongoose.model("listing", listingSchema);
module.exports = listing;