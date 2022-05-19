const { Schema, model, Types } = require('mongoose')
const dayjs = require('dayjs')

const ReactionSchema = new Schema(
	{
		reactionId: {
			type: Schema.Types.ObjectId,
			default: () => new Types.ObjectId(),
		},
		reactionText: {
			type: String,
			required: true,
			trim: true,
			minlength: 1,
			maxlength: 280,
		},
		userName: {
			type: String,
			required: true,
			trim: true,
		},
		createdAt: {
			type: Date,
			default: Date.now,
			get: (createdAtVal) => dayjs(createdAtVal).format('MMM D, YYYY h:mm A'),
		},
	},
	{
		toJSON: {
			getters: true,
		},
	}
)

const SocialPostSchema = new Schema(
	{
		userName: {
			type: String,
			required: true,
			trim: true,
		},
		socialPost: {
			type: String,
			required: true,
			minlength: 1,
			maxlength: 280,
		},
		createdAt: {
			type: Date,
			default: Date.now,
			get: (createdAtVal) => dayjs(createdAtVal).format('MMM D, YYYY h:mm A'),
		},
		reactions: [ReactionSchema],
	},
	{
		toJSON: {
			virtuals: true,
			getters: true,
		},
		id: false,
	}
)

SocialPostSchema.virtual('reactionCount').get(function () {
	return this.reactions.length
})

const SocialPost = model('SocialPost', SocialPostSchema)

module.exports = SocialPost