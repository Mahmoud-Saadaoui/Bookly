const mongoose = require('mongoose')
const MAX_REVIEWS_PER_BOOK = Number(process.env.MAX_REVIEWS_PER_BOOK) || 500;

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
        type: {
          url: { type: String, default: '' },
          publicId: { type: String, default: null }
        },
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
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
    reservationVersion: {
        type: Number,
        default: 0,
        min: 0,
        select: false
    },
    isDeleted: {
        type: Boolean,
        default: false,
        index: true
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
        default: [],
        validate: {
            validator: (reviews) => reviews.length <= MAX_REVIEWS_PER_BOOK,
            message: `A book cannot have more than ${MAX_REVIEWS_PER_BOOK} reviews`
        }
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
BookSchema.index({ isDeleted: 1, createdAt: -1 });

const BookModel = mongoose.model('Book', BookSchema);

module.exports = BookModel
