const USER_Model = require('../models/usermodel')
const jwt = require('jsonwebtoken')
exports.RegisterUser = async (req, res) => {
    try {
        const {
            Email
        } = req.body
        console.log(req.body)
        const isUserAlreadyRegistered = await USER_Model.findOne({
            Email
        })
        if (isUserAlreadyRegistered) {
            return res.status(400).json({
                message: "User Already Registered"
            })
        } else {
            const create = await USER_Model.create(req.body)
            if (create) {
                const token = await jwt.sign({
                    _id: create._id,
                    Email: create.Email
                }, process.env.SECRET)
                const {
                    HashPassword,
                    ...otherDoc
                } = create._doc
                return res.status(200).json({
                    user: {
                        ...otherDoc,
                        token
                    }
                })
            } else {
                return res.status(400).json({
                    message: "Registration Failed"
                })
            }
        }
    } catch (error) {
        console.log(error);
    }

}

exports.LoginUser = async (req, res) => {
    try {
        const {
            Email,
            HashPassword
        } = req.body
        console.log("pass", HashPassword);
        const AlreadyRegisteredUser = await USER_Model.findOne({
            Email
        })
        if (AlreadyRegisteredUser) {
            if (await (AlreadyRegisteredUser.ComparePassword(HashPassword))) {
                const token = await jwt.sign({
                    _id: AlreadyRegisteredUser._id,
                    Email: AlreadyRegisteredUser.Email
                }, process.env.SECRET)
                const {
                    HashPassword,
                    ...otherData
                } = AlreadyRegisteredUser._doc
                return res.status(200).json({
                    user: {
                        ...otherData,
                        token
                    }
                })
            } else {
                return res.status(400).json({
                    message: "Password Is Incorrect "
                })
            }
        } else {
            return res.status(400).json({
                message: "User not Registered yet"
            })
        }
    } catch (error) {
        console.log(error);
    }
}

exports.GetUsers = async (req, res) => {
    try {
        const {
            search
        } = req.query
        console.log(search);
        const keyword = search ? {
            $or: [{
                    Name: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    Email: {
                        $regex: search,
                        $options: "i"
                    }
                }

            ]
        } : {}


        const AllUsers =await  USER_Model.find(keyword).find({_id:{$ne:req.user._id}})
        if (AllUsers.length >0) {
            return res.status(200).json({
                message: "success",
                users: AllUsers
            })
        } else {
            return res.status(400).json({
                message: "No User Exist"
            })
        }
    } catch (error) {
        console.log(error);
    }

    e
}