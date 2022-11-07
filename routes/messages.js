const express=require('express')
const { SendMessage, GetMessages } = require('../collections/messages')
const router=express.Router()
const {VerifyToken}=require('../middleware/authentication')

 router.post('/send-message',VerifyToken,SendMessage)
 router.get('/all-messages/:ChatId',GetMessages)

module.exports=router