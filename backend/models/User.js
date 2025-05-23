import mongoose from "mongoose";
const { Schema, model } = mongoose

const User = model("User", new Schema({
    email: { 
        type: String, 
        unique: true,
        minlength: [10, "The email must have at least 10 characters"]
    },
    phone: {
        type: String,
        required: true
    },
    password: { 
        type: String, 
        required: true,
        minlength: [8, "The password must be at least 8 characters long"],
    },
    username: { 
        type: String, 
        unique: true,
        minlength: [5, "The username must have at least 5 characters"]
     },
    name: String,
    account:{
        type: String,
        enum: ['standard','author','admin'],
        default: 'standard',
        required: true
    },
    address: {
        city: String, county: String, country: String, lat: String, lon: String
    },
    friendList: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],   
        default: []
    },
    shareList: {
        type: [{
            read: {
                type: Boolean,
                default: false
            },
            userFrom: {
                type: Schema.Types.ObjectId,   
                ref: 'User'},
            sharedArticle: {
                type: Schema.Types.ObjectId,   
                ref: 'Article'},
            sentAt: {
                type: Date,
                default: Date.now }            
        }],
        default: []
    },
    friendRequests: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],   
        default: []
    },
    savedArticles: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Article'
        }],   
        default: []
    },
    birthdate: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
        required: true
    }
}, { timestamps: true }));

export default User;