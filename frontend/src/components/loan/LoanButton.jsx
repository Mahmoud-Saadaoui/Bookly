import React, { useState, useEffect } from 'react';
import Calendar from '../calendar/Calendar';
import { createLoan, getBookLoanDates } from '../../redux/apiCalls/loanApiCall';
import './loan-button.css';

const LoanButton = ({ bookId, isAuthenticated }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [unavailableDates, setUnavailableDates] = useState([]);
    const [selectedDates, setSelectedDates] = useState(null);

    useEffect(() => {
        // Fetch dates when component mounts
        if (bookId) {
            fetchLoanDates();
        }
    }, [bookId]);

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

            // Clear success message after delay
            setTimeout(() => {
                setSuccess(null);
            }, 3000);
        } catch (err) {
            console.error('Error creating loan:', err);
            setError(err.message || 'Failed to create loan');
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="loan-section-unauth">
                <div className="loan-header">
                    <h3>Loan This Book</h3>
                    <p className="loan-subtitle">Please log in to borrow this book</p>
                </div>
                <div className="login-prompt">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    <span>Authentication required</span>
                </div>
            </div>
        );
    }

    return (
        <div className="loan-section">
            <div className="loan-header">
                <h3>Loan This Book</h3>
                <p className="loan-subtitle">Select your preferred dates to borrow this book</p>
            </div>

            {error && (
                <div className="error-message">
                    <span>{error}</span>
                    <button onClick={() => setError(null)}>×</button>
                </div>
            )}

            {success && (
                <div className="success-message">
                    <span>✓ {success}</span>
                </div>
            )}

            <div className="calendar-container">
                {loading ? (
                    <div className="loading-spinner">Loading availability...</div>
                ) : (
                    <>
                        <Calendar
                            bookId={bookId}
                            onDateRangeSelect={handleDateRangeSelect}
                            unavailableDates={unavailableDates}
                        />
                    </>
                )}
            </div>

            <div className="loan-actions">
                <div className="selected-dates-info">
                    {selectedDates?.start && selectedDates?.end ? (
                        <p>
                            <strong>Selected:</strong> {selectedDates.start.toLocaleDateString()} - {selectedDates.end.toLocaleDateString()}
                        </p>
                    ) : (
                        <p className="hint">↑ Select your dates above</p>
                    )}
                </div>
                <button
                    className="submit-btn"
                    onClick={handleSubmitLoan}
                    disabled={!selectedDates || !selectedDates.start || !selectedDates.end || loading}
                >
                    {loading ? (
                        <>
                            <span className="spinner"></span>
                            Processing...
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                            </svg>
                            Confirm Loan
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default LoanButton;
