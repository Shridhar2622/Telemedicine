const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        trim: true
    },
    fullName: {
        type: String,
        trim: true,
        default: ""
    },

    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true      
    },

    password: {
        type: String,
        required: function() {
            return !this.googleId; // Password required only if not Google auth
        },
        minlength: 6         
    },

    googleId: {
        type: String,
        unique: true,
        sparse: true  // Allows null values while maintaining uniqueness
    },

    profilePicture: {
        type: String,
        default: null
    },

    authProvider: {
        type: String,
        enum: ["local", "google"],
        default: "local"
    },

    role: {
        type: String,
        enum: ["Patient", "Doctor", "Admin"],
        default: "Patient"
    },

    style: {                 
        type: String,
        enum: ["light", "dark"],
        default: "light"
    },

    isActive: {
        type: Boolean,
        default: true
    },
    prescriptions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Prescription"
    }],

    //verification part
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationOTP:{
        type: Number,
        default: null
    },
    emailVerificationExpires: {
        type: Date,
        default: null}
}, { timestamps: true });    

const User = mongoose.model("User", userSchema);

module.exports = User;
