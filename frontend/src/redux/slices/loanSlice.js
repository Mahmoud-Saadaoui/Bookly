import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loans: [],
    unavailableDates: [],
    loading: false,
    error: null,
    selectedLoan: null
};

const loanSlice = createSlice({
    name: 'loan',
    initialState,
    reducers: {
        // Set unavailable dates for a book
        setUnavailableDates: (state, action) => {
            state.unavailableDates = action.payload;
        },

        // Set loans loading
        setLoading: (state, action) => {
            state.loading = action.payload;
        },

        // Set error
        setError: (state, action) => {
            state.error = action.payload;
        },

        // Set user loans
        setUserLoans: (state, action) => {
            state.loans = action.payload;
            state.error = null;
        },

        // Add new loan
        addLoan: (state, action) => {
            state.loans.unshift(action.payload);
            state.error = null;
        },

        // Update loan status
        updateLoanStatus: (state, action) => {
            const { loanId, status } = action.payload;
            const loan = state.loans.find(loan => loan._id === loanId);
            if (loan) {
                loan.status = status;
            }
            state.error = null;
        },

        // Set selected loan
        setSelectedLoan: (state, action) => {
            state.selectedLoan = action.payload;
        },

        // Clear error
        clearError: (state) => {
            state.error = null;
        },

        // Reset loan state
        resetLoanState: (state) => {
            state.loans = [];
            state.unavailableDates = [];
            state.loading = false;
            state.error = null;
            state.selectedLoan = null;
        }
    }
});

export const {
    setUnavailableDates,
    setLoading,
    setError,
    setUserLoans,
    addLoan,
    updateLoanStatus,
    setSelectedLoan,
    clearError,
    resetLoanState
} = loanSlice.actions;

export default loanSlice.reducer;
