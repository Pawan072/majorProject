const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const Listing = require("./models/listing.js")
const path = require("path");
const listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");



app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

main().then(()=>{
    console.log("connected to database");
}).catch((err) =>{ 
    console.log(err)
});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

// app.get("/",(req, res)=>{
//     res.send("Hi i am root");
// })

//index route 
app.get("/listings",async(req, res)=>{
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", {allListing});
})

// show route

app.get("/listing/:id", async (req, res)=>{
    let{id}= req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
})

//new route
app.get("/listings/new", (req, res)=>[
    res.render("listings/addnewuser.ejs")
]);
//create Route
app.post("/listings",async (req, res)=>{
    let listings = req.body.listings;
    const newlisting = new Listing (listings);
    await newlisting.save();
    res.redirect("/listings");
    console.log(newlisting);
})

// edit route 
app.get("/listing/:id/edit", async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
})

//update route
app.put("/listing/:id", async (req, res)=>{
    let{id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listing/${id}`);
})


//delete route 
app.delete("/listing/listings/:id", async (req, res)=>{
    let{id}= req.params;
    let deltedListing = await Listing.findByIdAndDelete(id);
    console.log(deltedListing);
    res.redirect("/listings");
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

app.listen(port,()=>{
    console.log("server is running on",port);
})