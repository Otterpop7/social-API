const router = require('express').Router()
const {
	getSocialPost,
	getSocialPostId,
	createSocialPost,
	updateSocialPost,
	deleteSocialPost,
	addReactions,
	removeReactions,
} = require('../../controllers/socialPost-controller')


router.route('/')
	.get(getSocialPost)

router.route('/:socialPostId')
	.get(getSocialPostId)
	.put(updateSocialPost)

router.route('/:userId')
	.post(createSocialPost)

router.route('/:userId/:socialPostId')
	.delete(deleteSocialPost)

router.route('/:socialPostId/reactions')
	.post(addReactions)

router.route('/:socialPostId/reactions/:reactionId')
	.delete(removeReactions)


module.exports = router