const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({

    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },

    isverified: {
        type: Boolean,
        required: true
    },

    isAdmin: {
        type: Boolean,
        default: false,
        required: false,
    },

    resetVerified: {
        type: Boolean,
        required: false,
    },

    courses: [
        {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Course",
        }
    ],

    Bookmark: [
        {
            type: Schema.Types.ObjectId,
            required: false,
            ref: "Course",
        }]

    //Token:String,
    //resetToken:String,
    //resetTokenExpiration:Date,

});

module.exports = mongoose.model('User', userSchema);
