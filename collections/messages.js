const MessageModel = require('../models/messagemodel')
const User = require('../models/usermodel')
const ChatModel = require('../models/chatmodel')
const {
    ObjectId
} = require('mongodb')

exports.SendMessage = async (req, res) => {
    try {
        let {
            Text,
            ChatId
        } = req.body
        let createMessage = await MessageModel.create({
            Text,
            ChatId: ChatId,
            Sender: req.user._id
        })
        const Update_latest_message = await ChatModel.findByIdAndUpdate(ObjectId(ChatId), {
            LatestMessage: createMessage._id
        })
        if (createMessage && Update_latest_message) {
            createMessage = await User.populate(createMessage, {
                path: "Sender",
                select: "Name Profile"
            })
            createMessage = await createMessage.populate('ChatId')
            createMessage = await MessageModel.populate(createMessage, {
                path: 'ChatId.LatestMessage',
                select: 'Sender Text'
            })

            return res.status(200).json({
                message: "created",
                result: createMessage
            })
        } else return res.status(400).json({
            message: "Failed To Send"
        })
    } catch (error) {
        console.log(error);
    }
}

exports.GetMessages = async (req, res) => {
    try {
        let {
            ChatId
        } = req.params
        if (ChatId !== "") {


            let AllMessages = await MessageModel.find({
                ChatId: ChatId
            })
            if (AllMessages) {
                AllMessages = await User.populate(AllMessages, {
                    path: 'Sender',
                    select: "Name Profile"
                })

                return res.status(200).json({
                    result: AllMessages
                })
            }
        }
    } catch (error) {
        console.log(error);
    }
}