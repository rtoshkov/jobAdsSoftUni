const Ad = require('../models/Ad');


async function getAllAds(filter = false) {
    const result = await Ad.find({}).lean();
    if (filter) {
        const top = Object.values(result).slice(0, 3);
        return top;
    } else {
        return result;
    }

}

async function createAd(received) {
    const post = new Ad({
        headline: received.headline,
        location: received.location,
        name: received.name,
        author: received.author,
        description: received.description,
    });

    await post.save();
    return post;
}


async function editAd(received, id) {
    let existing = await Ad.findById(id);
    existing.headline = received.headline;
    existing.location = received.location;
    existing.name = received.name;
    existing.description = received.description;
    await existing.save();
    return existing;
}


async function getAdByID(id) {
    const post = await Ad.findById(id).populate('author').populate('applied').lean();
    return post;
}


async function getNotPopulatedAdByID(id) {
    const post = await Ad.findById(id);
    return post;
}

async function deleteAdById(id) {
    await Ad.findByIdAndDelete(id);
}


module.exports = {
    getAllAds,
    createAd,
    editAd,
    getAdByID,
    getNotPopulatedAdByID,
    deleteAdById,
}