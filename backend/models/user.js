const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Name is required'],
		maxlength: [50, 'Name cannot exceed 50 characters'],
		trim: true
	},
	email: {
		type: String,
		required: [true, 'Email is required'],
		unique: true,
		trim: true,
		lowercase: true,
		index: true
	},
	password: {
		type: String,
		required: [true, 'Password is required'],
		minlength: [6, 'Password must be at least 6 characters']
	},
	favoriteList: [
		{
			book: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Book'
			},
			favorite: {
				type: Boolean,
				default: true
			}
		}
	],
	isAdmin: {
		type: Boolean,
		default: false
	}
}, {
	timestamps: true
})

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel
