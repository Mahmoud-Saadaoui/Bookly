import React, { useState, useEffect } from 'react';
import Calendar from '../calendar/Calendar';
import { createLoan, getBookLoanDates } from '../../redux/apiCalls/loanApiCall';
import './loan-button.css';

const LoanButton = ({ bookId, isAuthenticated }) => {
    const [showCalendar, setShowCalendar] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [unavailableDates, setUnavailableDates] = useState([]);
    const [selectedDates, setSelectedDates] = useState(null);

    useEffect(() => {
        if (showCalendar) {
            fetchLoanDates();
        }
    }, [showCalendar, bookId]);

    const fetchLoanDates = async () => {
        try {
            setLoading(true);
            const dates = await getBookLoanDates(bookId);
            setUnavailableDates(dates);
            setError(null);
        } catch (err) {
            console.error('Error fetching loan dates:', err);
            setError('Failed to load availability');
        } finally {
            setLoading(false);
        }
    };

    const handleDateRangeSelect = (range) => {
        setSelectedDates(range);
    };

    const handleSubmitLoan = async () => {
        if (!selectedDates || !selectedDates.start || !selectedDates.end) {
            setError('Please select both start and end dates');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            await createLoan(
                bookId,
                selectedDates.start.toISOString(),
                selectedDates.end.toISOString(),
                ''
            );

            setSuccess('Loan created successfully!');
            setSelectedDates(null);
            
            // Refresh unavailable dates
            await fetchLoanDates();

            // Close calendar after success
            setTimeout(() => {
                setShowCalendar(false);
                setSuccess(null);
            }, 2000);
        } catch (err) {
            console.error('Error creating loan:', err);
            setError(err.message || 'Failed to create loan');
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="loan-button-container">
                <p className="loan-message">Please log in to loan this book</p>
            </div>
        );
    }

    return (
        <div className="loan-button-container">
            <button
                className="loan-btn"
                onClick={() => setShowCalendar(!showCalendar)}
                disabled={loading}
            >
                {showCalendar ? 'Hide Calendar' : 'Loan This Book'}
            </button>

            {showCalendar && (
                <div className="loan-modal-overlay" onClick={() => setShowCalendar(false)}>
                    <div className="loan-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="loan-modal-header">
                            <h2>Select Loan Dates</h2>
                            <button
                                className="close-btn"
                                onClick={() => setShowCalendar(false)}
                            >
                                ✕
                            </button>
                        </div>

                        {loading && <div className="loading-spinner">Loading...</div>}

                        {error && (
                            <div className="error-message">
                                {error}
                                <button onClick={() => setError(null)}>×</button>
                            </div>
                        )}

                        {success && (
                            <div className="success-message">
                                {success}
                            </div>
                        )}

                        {!loading && (
                            <>
                                <Calendar
                                    bookId={bookId}
                                    onDateRangeSelect={handleDateRangeSelect}
                                    unavailableDates={unavailableDates}
                                />

                                <div className="loan-modal-footer">
                                    <button
                                        className="cancel-btn"
                                        onClick={() => setShowCalendar(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="submit-btn"
                                        onClick={handleSubmitLoan}
                                        disabled={!selectedDates || !selectedDates.start || !selectedDates.end || loading}
                                    >
                                        {loading ? 'Creating...' : 'Confirm Loan'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoanButton;
