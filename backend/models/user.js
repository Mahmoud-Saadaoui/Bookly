const mongoose = require('mongoose')
const MAX_FAVORITES_PER_USER = Number(process.env.MAX_FAVORITES_PER_USER) || 500;

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
		minlength: [6, 'Password must be at least 6 characters'],
		select: false
	},
 	favoriteList: {
        type: [{
            book: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Book'
            },
            favorite: {
                type: Boolean,
                default: true
            }
        }],
        validate: {
            validator: (favorites) => favorites.length <= MAX_FAVORITES_PER_USER,
            message: `A user cannot have more than ${MAX_FAVORITES_PER_USER} favorites`
        }
    },
	isAdmin: {
		type: Boolean,
		default: false
	}
}, {
	timestamps: true
})

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel
