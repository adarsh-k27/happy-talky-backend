const chatmodel = require('../models/chatmodel');
const ChatModel = require('../models/chatmodel')
const UserModel = require('../models/usermodel')
const MessageModal=require('../models/messagemodel')
const {
    ObjectId
} = require('mongodb')

exports.Addchat = async (req, res) => {
    try {
        const {
            userId,
        } = req.body

        console.log(req.body);
        const isChatCreated = await ChatModel.findOne({
            IsGroupChat: false,
            User: {
                $all: [userId, req.user._id]
            }
        }).populate('User').populate('LatestMessage')
        console.log(isChatCreated);

        if (isChatCreated) {
            //RETURN DATA
            return res.status(200).json({
                message: "success",
                chat: isChatCreated
            })

        } else {
            //create data
            const createChat = await ChatModel.create({
                ChatName: "sender",
                User: [userId, req.user._id]
            })
            if (createChat) {
                return res.status(200).json({
                    message: "success",
                    chat: createChat
                })
            } else return res.status(400).json({
                message: "Chat Not Created"
            })
        }
    } catch (error) {
        console.log(error);
    }
}

exports.FindChat = async (req, res) => {
    try {
        let chats = await ChatModel.find({
            User: {
                $in: [req.user._id]

            }
        }).populate('User')

        if (chats.length > 0) {
            chats=await MessageModal.populate(chats,{
                path:"LatestMessage",
                select:"Sender Text"
            })
            chats=await UserModel.populate(chats,{
                path:'LatestMessage.Sender',
                select:'Name Profile'
            })
            return res.status(200).json({
                message: "success",
                chats
            })
        } else return res.status(400).json({
            message: "No chat get"
        })
    } catch (error) {
        console.log(error);
    }
}
exports.CreateGroupChat = async (req, res) => {
    try {
        const {
            User,
            ChatName,
        } = req.body
        if (User.length < 1) {
            return res.status(400).json({
                message: "MoreThan 2 People Need FOR a gROUPcHAT"
            })
        } else {
            const NewArray = []
            User.push({
                _id: req.user._id
            })
            User.map((user) => NewArray.push(user._id))
            const createGroupChat = await ChatModel.create({
                ChatName,
                User: NewArray,
                IsGroupChat: true,
                IsAdmin: req.user._id
            })
            if (createGroupChat) return res.status(200).json({
                message: "Group created succes fully",
                chat: createGroupChat
            })
            else return res.status(400).json({
                message: "Something Went Wrong On Create GroupChat"
            })
        }
    } catch (error) {
        res.status(400).json({
            messsage: "Something Wrong"
        })
        console.log(error);

    }
}

exports.RenameGroupChat = async (req, res) => {
    try {
        const {
            ChatName,
            chatId
        } = req.body

        let Update = await ChatModel.findByIdAndUpdate(chatId, {
            ChatName
        }, {
            new: true
        })
        if (Update) {
            Update = await UserModel.populate(Update, {
                path: "User",
                select: "Name Profile"
            })
            return res.status(200).json({
                message: "updated Succesfully",
                Update
            })
        }

    } catch (error) {
        return res.status(400).json({
            message: "Something went Wrong"
        })
        console.log(error);
    }
}

exports.AddMembers = async (req, res) => {
    try {
        const {
            userId,
            ChatId
        } = req.body
        let updateUser = await chatmodel.findByIdAndUpdate(ChatId, {
            $push: {
                User: userId
            }
        }, {
            new: true
        })

        if (updateUser) {
            updateUser=await UserModel.populate(updateUser,{
                path:'User',
                select:"Name Profile"
            })
            return res.status(200).json({
                message: "updated SuccesFully",
                updateUser
            })
        }
    } catch (error) {
        console.log(error);
    }

}

exports.RemoveUser = async (req, res) => {
    try {
        const {
            userId,
            chatId
        } = req.body
        let RemoveUser = await ChatModel.findByIdAndUpdate(chatId, {
            $pull: {
                User: userId
            }
        }, {
            new: true
        })

        if (RemoveUser) {
            RemoveUser = await UserModel.populate(RemoveUser, {
                path: "User",
                select: "Name Profile"
            })
            return res.status(200).json({
                message: "Remove SuccesFully",
                RemoveUser
            })
        }
    } catch (error) {
        console.log(error);
    }
}

