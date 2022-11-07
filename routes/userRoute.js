const expres = require('express');
const {
    RegisterUser,
    LoginUser,
    GetUsers
} = require('../collections/user');
const {
    VerifyToken
} = require('../middleware/authentication');
const { Upload } = require('../middleware/cloudinary');
const router = expres.Router()

router.post('/register',RegisterUser);
router.post('/login', LoginUser);
router.get('/', VerifyToken, GetUsers)
router.post('/add-profile',Upload)
// router.get('/',getAllUser)


module.exports = router