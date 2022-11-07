const mongoose = require('mongoose')

const ChatSchema = mongoose.Schema({
    ChatName: {
        type: String,
        required: true,
        trim: true
    },
    IsGroupChat: {
        type: Boolean,
        default: false
    },
    IsAdmin:{
        type:String,
        default:"false"
    },
    User: [{
        type: mongoose.Types.ObjectId,
        ref: 'user'
    }],
    LatestMessage:{
       type:mongoose.Types.ObjectId,
       ref:'messages'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('chats',ChatSchema)