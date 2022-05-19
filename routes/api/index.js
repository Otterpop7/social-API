const router = require('express').Router()
const userRoutes = require('./user-routes')
const socialPostRoutes = require('./socialPost-routes')


router.use('/users', userRoutes)
router.use('/socialPosts', socialPostRoutes)


module.exports = router