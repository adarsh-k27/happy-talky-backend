const mongoose=require('mongoose')

const MessageSchema=mongoose.Schema({
   Sender:{
    type:mongoose.Types.ObjectId ,
    ref:"user"
   },
   Text:{
    type:String,
    required:true
   },
   ChatId:{
    type:mongoose.Types.ObjectId,
    ref:"chats"
   }
},{timestamps:true})

module.exports = mongoose.model('messages', MessageSchema)