const {Router} = require('express')
const router = Router()
const {Auth,verifyUser} = require('../middleware/auth')

const {register, login,getUser,updateUser, logout,forgetPassword,resetPassword, loginUser} = require('../controller/userController')
 

router.post('/register',register)
// router.post('/login',login)


// fiver login gigs
router.post('/login',loginUser)


// router.get('/:username',getUser)

router.get('/',Auth,getUser)

// router.get('/createSession',createSession)


// router.put('/resetpassword',verifyUser,resetPassword)
router.put('/',Auth,updateUser)
router.get('/logout',Auth,logout)

router.post('/forget-password',forgetPassword)
router.put('/reset-password/:resetToken',resetPassword)




module.exports = router
