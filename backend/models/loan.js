const mongoose = require('mongoose')

const LoanSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required'],
        index: true
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: [true, 'Book is required'],
        index: true
    },
    loanDate: {
        type: Date,
        required: [true, 'Loan date is required'],
        index: true
    },
    returnDate: {
        type: Date,
        required: [true, 'Return date is required'],
        index: true
    },
    actualReturnDate: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ['active', 'returned', 'overdue'],
        default: 'active',
        index: true
    },
    notes: {
        type: String,
        default: '',
        trim: true
    }
}, {
    timestamps: true
})

// Compound index for finding active/overdue loans by book and date range
LoanSchema.index({ book: 1, status: 1, loanDate: 1, returnDate: 1 });

// Compound index for user's active loans
LoanSchema.index({ user: 1, status: 1 });

const LoanModel = mongoose.model('Loan', LoanSchema);

module.exports = LoanModel
