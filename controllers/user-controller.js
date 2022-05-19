const { User, SocialPost } = require('../models')

const userController = {
	getUsers(req, res) {
		User.find({})
			.populate({
				path: 'socialPosts',
				select: '-__v',
			})
			.select('-__v')
			.then((dbUserData) => res.json(dbUserData))
			.catch((err) => {
				console.log(err)
				res.status(400).json(err)
			})
	},

	getUserId({ params }, res) {
		User.findOne({ _id: params.id })
			.populate([
				{
					path: 'socialPosts',
					select: '-__v',
				},
				{
					path: 'friends',
					select: '-__v',
				},
			])
			.select('-__v')
			.then((dbUserData) => {
				if (!dbUserData) {
					res.status(404).json({ message: 'No user found with this ID!' })
					return
				}
				res.json(dbUserData)
			})
			.catch((err) => {
				console.log(err)
				res.status(400).json(err)
			})
	},

	makeUser({ body }, res) {
		User.create(body)
			.then((dbUserData) => res.json(dbUserData))
			.catch((err) => res.status(400).json(err))
	},

	updateUser({ params, body }, res) {
		User.findOneAndUpdate({ _id: params.id }, body, {
			new: true,
			runValidators: true,
		})
			.then((dbUserData) => {
				if (!dbUserData) {
					res.status(404).json({ message: 'No user found with this ID!' })
					return
				}
				res.json(dbUserData)
			})
			.catch((err) => res.status(400).json(err))
	},

	deleteUser({ params }, res) {
		User.findOneAndDelete({ _id: params.id })
			.then((deletedUser) => {
				if (!deletedUser) {
					res.status(404).json({ message: 'No user found with this ID!' })
					return
				}
				User.updateMany(
					{ _id: { $in: deletedUser.friends } },
					{ $pull: { friends: params.id } }
				)
					.then(() => {
						SocialPost.deleteMany({ userName: deletedUser.userName })
							.then(() => {
								res.json({ message: 'User deleted' })
							})
							.catch((err) => res.status(400).json(err))
					})
					.catch((err) => res.status(400).json(err))
			})
			.catch((err) => res.status(400).json(err))
	},

	addFriends({ params }, res) {
		User.findOneAndUpdate(
			{ _id: params.userId },
			{ $addToSet: { friends: params.friendId } },
			{ new: true, runValidators: true }
		)
			.then((dbUserData) => {
				if (!dbUserData) {
					res.status(404).json({ message: 'No user found with this ID!' })
					return
				}
				res.json(dbUserData)
			})
			.catch((err) => res.json(err))
	},

	removeFriends({ params }, res) {
		User.findOneAndUpdate(
			{ _id: params.userId },
			{ $pull: { friends: params.friendId } },
			{ new: true }
		)
			.then((dbUserData) => res.json(dbUserData))
			.catch((err) => res.json(err))
	},
}

module.exports = userController
