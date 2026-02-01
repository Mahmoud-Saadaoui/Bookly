import { BASE_URL } from '../../constantes';

export const LOANS_URL = `${BASE_URL}/loans`;

// Get book loan dates (unavailable dates)
export const getBookLoanDates = async (bookId) => {
    try {
        const response = await fetch(`${LOANS_URL}/book/${bookId}`);
        const data = await response.json();
        if (data.success) {
            return data.data;
        }
        return [];
    } catch (error) {
        console.error('Error fetching loan dates:', error);
        return [];
    }
};

// Check book availability for specific dates
export const checkBookAvailability = async (bookId, startDate, endDate) => {
    try {
        const response = await fetch(
            `${LOANS_URL}/availability/${bookId}?startDate=${startDate}&endDate=${endDate}`
        );
        const data = await response.json();
        return data.success ? data.isAvailable : false;
    } catch (error) {
        console.error('Error checking availability:', error);
        return false;
    }
};

// Create a new loan
export const createLoan = async (bookId, loanDate, returnDate, notes = '') => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${LOANS_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                bookId,
                loanDate,
                returnDate,
                notes
            })
        });

        const data = await response.json();
        if (!data.success) {
            throw new Error(data.message);
        }
        return data.data;
    } catch (error) {
        console.error('Error creating loan:', error);
        throw error;
    }
};

// Get user's loans
export const getUserLoans = async () => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${LOANS_URL}/user/all`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        if (data.success) {
            return data.data;
        }
        return [];
    } catch (error) {
        console.error('Error fetching user loans:', error);
        return [];
    }
};

// Return a book
export const returnBook = async (loanId) => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${LOANS_URL}/return/${loanId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        if (!data.success) {
            throw new Error(data.message);
        }
        return data.data;
    } catch (error) {
        console.error('Error returning book:', error);
        throw error;
    }
};

// Get loan details
export const getLoanDetail = async (loanId) => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${LOANS_URL}/${loanId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        if (data.success) {
            return data.data;
        }
        return null;
    } catch (error) {
        console.error('Error fetching loan details:', error);
        return null;
    }
};
