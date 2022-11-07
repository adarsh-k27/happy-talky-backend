const express = require('express');
const {
    Addchat,
    FindChat,
    CreateGroupChat,
    RenameGroupChat,
    RemoveUser,
    AddMembers
} = require('../collections/chat');
const {
    VerifyToken
} = require('../middleware/authentication');
const router = express.Router()

router.post('/add-chat', VerifyToken, Addchat)
router.get('/find-chat', VerifyToken, FindChat)
router.post('/create-group', VerifyToken, CreateGroupChat)
router.put('/rename', RenameGroupChat)
router.put('/remove',RemoveUser)
router.put('/add-member', AddMembers)


module.exports = router;