const router = require('express').Router()
const {
	getUsers,
	getUserId,
	makeUser,
	updateUser,
	deleteUser,
	addFriends,
	removeFriends,
} = require('../../controllers/user-controller')

router.route('/')
	.get(getUsers)
	.post(makeUser)

router.route('/:id')
	.get(getUserId)
	.put(updateUser)
	.delete(deleteUser)

router.route('/:userId/friends/:friendId')
	.post(addFriends)
	.delete(removeFriends)

module.exports = router