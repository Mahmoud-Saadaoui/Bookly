const mongoose = require('mongoose')

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        index: true,
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        index: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    image: {
        type: Object,
        default: {
          url: "",
          publicId: null,
        }
    },
    author: {
        type: String,
        required: [true, 'Author is required'],
        trim: true
    },
    language: {
        type: String,
        trim: true
    },
    PublicationDate: {
        type: Date,
    },
    rate: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviews: {
        type: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                },
                username: {
                    type: String,
                    required: true,
                    trim: true
                },
                comment: {
                    type: String,
                    trim: true
                },
                rate: {
                    type: Number,
                    min: 0,
                    max: 5
                }
            }
        ],
        default: []
    }
}, {
    timestamps: true
})

// Configure JSON serialization
BookSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
        delete ret._id
    }
})

// Add text index for search functionality
BookSchema.index({ title: 'text', description: 'text', author: 'text' });

const BookModel = mongoose.model('Book', BookSchema);

module.exports = BookModel
