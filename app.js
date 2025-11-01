const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const Listing = require("./models/listing.js")
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
const Review = require("./models/review.js");
const review = require("./models/review.js");



main().then(()=>{
    console.log("connected to database");
}).catch((err) =>{ 
    console.log(err)
});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}


app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));



app.get("/",(req, res)=>{
    res.send("Hi i am root");
})

const validateListing = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

//index route 
app.get("/listings",wrapAsync (async(req, res)=>{
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", {allListing});
}))

// show route

app.get("/listing/:id", wrapAsync (async (req, res)=>{
    let{id}= req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
}))


//new route
app.get("/listings/new", (req, res)=>{ // square brackets replace by curly brackets
    res.render("listings/addnewuser.ejs")
});


//create Route
app.post("/listings",validateListing, wrapAsync (async (req, res, next)=>{
    let listing = req.body.listing;
    const newListing = new Listing (listing);
    await newListing.save();
    res.redirect("/listings");
}))

// edit route 
app.get("/listing/:id/edit", wrapAsync (async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}))

//update route
app.put("/listing/:id",validateListing, wrapAsync (async (req, res)=>{
    let{id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listing/${id}`);
}))


//delete route 
app.delete("/listing/listings/:id",wrapAsync (async (req, res)=>{
    let{id}= req.params;
    let deltedListing = await Listing.findByIdAndDelete(id);
    console.log(deltedListing);
    res.redirect("/listings");
}))

// review section 
// Post Route

app.post("/listings/:id/reviews",async (req, res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listing/${listing._id}`);
})
// app.get("/testListing",async (req, res)=>{
//     let sampleListing = new listing({
//         title: "My New Villa",
//         description: "by the beach",
//         price: 1200,
//         location: "calangate Goa",
//         country: "india"
//     })
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successfull testing");
// })


app.all("/*splat",(req, res, next)=>{
    next(new ExpressError(404, "Page not Found!"))
})


app.use((err, req, res, next)=>{
    let{statusCode= 500, message="something went wrong!"}= err;
    res.status(statusCode).render("error.ejs", {message});
    // res.status(statusCode).render(message);
});


app.listen(port,()=>{
    console.log("server is running on",port);
})