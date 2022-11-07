const mongoose = require('mongoose')
const {
    hash,
    compare
} = require('bcrypt')
const UserSchema = mongoose.Schema({
    Name: {
        type: String,
        required: true,
        trim: true
    },
    Email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    HashPassword: {
        type: String,
        required: true,
    },
    Profile: {
        type: String,
        required: true,
        default: "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg"
    },

}, {
    timestamps: true
})

UserSchema.pre('save', async function () {
    if (!this.isModified) {
        next()
    }
    this.HashPassword = await hash(this.HashPassword, 10)
})

UserSchema.methods.ComparePassword = async function (password) {
    console.log("password is ", this.HashPassword);
    return await compare(password, this.HashPassword)
}

module.exports = mongoose.model('user', UserSchema)