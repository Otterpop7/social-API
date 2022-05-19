const { SocialPost, User } = require('../models')

const socialPostController = {
	getSocialPost(req, res) {
		SocialPost.find({})
			.select('-__v')
			.sort({ _id: -1 })
			.then((dbSocialPostData) => res.json(dbSocialPostData))
			.catch((err) => {
				console.log(err)
				res.status(400).json(err)
			})
	},

	getSocialPostId({ params }, res) {
		SocialPost.findOne({ _id: params.socialPostId })
			.select('-__v')
			.then((dbSocialPostData) => {
				if (!dbSocialPostData) {
					res.status(404).json({ message: 'There is no socialPost with this id.' })
					return
				}
				res.json(dbSocialPostData)
			})
			.catch((err) => {
				console.log(err)
				res.status(400).json(err)
			})
	},
	createSocialPost({ params, body }, res) {
		SocialPost.create(body)
			.then(({ _id }) => {
				return User.findOneAndUpdate(
					{ _id: params.userId },
					{ $push: { socialPosts: _id } },
					{ new: true }
				)
			})
			.then((dbUserData) => {
				if (!dbUserData) {
					res.status(404).json({ message: 'There is no user with this id.' })
					return
				}
				res.json(dbUserData)
			})
			.catch((err) => res.json(err))
	},
	updateSocialPost({ params, body }, res) {
		SocialPost.findOneAndUpdate({ _id: params.socialPostId }, body, {
			new: true,
			runValidators: true,
		})
			.then((dbSocialPostData) => {
				if (!dbSocialPostData) {
					res.status(404).json({ message: 'There is no socialPost with this id.' })
					return
				}
				res.json(dbSocialPostData)
			})
			.catch((err) => res.status(400).json(err))
	},
	deleteSocialPost({ params }, res) {
		SocialPost.findOneAndDelete({ _id: params.socialPostId })
			.then((deletedSocialPost) => {
				if (!deletedSocialPost) {
					res.status(404).json({ message: 'There are no socialPosts with this id.' })
				}
				return User.findOneAndUpdate(
					{ _id: params.userId },
					{ $pull: { socialPosts: params.socialPostId } },
					{ new: true }
				)
			})
			.then((dbUserData) => {
				if (!dbUserData) {
					res.status(404).json({ message: 'There is no user with this socialPost.' })
					return
				}
				res.json(dbUserData)
			})
			.catch((err) => res.json(err))
	},
	addReactions({ params, body }, res) {
		SocialPost.findOneAndUpdate(
			{ _id: params.socialPostId },
			{ $push: { reactions: body } },
			{ new: true, runValidators: true }
		)
			.then((dbUserData) => {
				console.log('userdata: ' , dbUserData)
				if (!dbUserData) {
					res.status(404).json({ message: 'There is no user with this id.' })
					return
				}
				res.json(dbUserData)
			})
			.catch((err) => res.json(err))
	},
	removeReactions({ params }, res) {
		SocialPost.findOneAndUpdate(
			{ _id: params.socialPostId },
			{ $pull: { reactions: { reactionId: params.reactionId } } },
			{ new: true }
		)
			.then((dbUserData) => res.json(dbUserData))
			.catch((err) => res.json(err))
	},
}

module.exports = socialPostController