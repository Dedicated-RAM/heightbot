const { Schema, model } = require("mongoose");
const profileSchema = new Schema({
    id: { type: String, unique: true, required: true },
    profileIcon: { type: String, required: false },
    height: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: new Date() }
});

// ARG 1: Singular name of the collection your model is for
// Mongoose automatically looks for the plural, lowercased version of your model name
// So ARG 3 is unnecessary
module.exports = model("Profile", profileSchema, "profiles");