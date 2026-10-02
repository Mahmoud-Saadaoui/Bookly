const mongoose = require('mongoose')

const MAX_LOAN_DURATION_DAYS = Number(process.env.MAX_LOAN_DURATION_DAYS) || 30;

const isValidDate = (value) => value instanceof Date && !Number.isNaN(value.getTime());

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
        index: true,
        validate: {
            validator: isValidDate,
            message: 'Loan date must be a valid date'
        }
    },
    returnDate: {
        type: Date,
        required: [true, 'Return date is required'],
        index: true,
        validate: {
            validator: function (value) {
                if (!isValidDate(value) || !isValidDate(this.loanDate)) {
                    return false;
                }

                const duration = value.getTime() - this.loanDate.getTime();
                return duration > 0 && duration <= MAX_LOAN_DURATION_DAYS * 24 * 60 * 60 * 1000;
            },
            message: `Return date must be after loan date and within ${MAX_LOAN_DURATION_DAYS} days`
        }
    },
    actualReturnDate: {
        type: Date,
        default: null,
        validate: {
            validator: function (value) {
                return value === null || (
                    isValidDate(value) &&
                    isValidDate(this.loanDate) &&
                    value >= this.loanDate
                );
            },
            message: 'Actual return date must be after the loan date'
        }
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
        trim: true,
        maxlength: [500, 'Notes cannot exceed 500 characters']
    },
    idempotencyKey: {
        type: String,
        trim: true,
        maxlength: [128, 'Idempotency key cannot exceed 128 characters'],
        select: false
    }
}, {
    timestamps: true
})

// Only active loans participate in availability checks.
LoanSchema.index(
    { book: 1, status: 1, loanDate: 1, returnDate: 1 },
    {
        partialFilterExpression: { status: 'active' },
        name: 'active_loan_overlap'
    }
);

// Retries with the same idempotency key must not create another loan.
LoanSchema.index(
    { user: 1, idempotencyKey: 1 },
    { unique: true, sparse: true, name: 'loan_idempotency_key' }
);

// Compound index for user's active loans
LoanSchema.index({ user: 1, status: 1, createdAt: -1 });
LoanSchema.index({ user: 1, book: 1, status: 1 });

const LoanModel = mongoose.model('Loan', LoanSchema);

module.exports = LoanModel
