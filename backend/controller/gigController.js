// import gig from "../Model/gig";
// import gig from "../Model/gig";

const Gig = require("../Model/gig")
const User = require("../Model/user")
const cloudinary = require("cloudinary");


const getGigs = async (req, res) => {
    
    
    const q = req.query;
    const filters = {
        ...(q.userId && { userId: q.userId }),
        ...(q.cat && { cat: q.cat }),
        ...((q.min || q.max) && {
        price: {
            ...(q.min && { $gt: q.min }),
            ...(q.max && { $lt: q.max }),
        },
        }),
        ...(q.search && { title: { $regex: q.search, $options: "i" } }),
    };
    

    try {
         const gigs = await Gig.find();
        // const gigs = await Gig.find(filters).sort({ [q.sort]: -1 });
        res.status(200).send(gigs);
    } catch (error) {
        next(error);
    }

}

module.exports = {
    getGigs
  };

