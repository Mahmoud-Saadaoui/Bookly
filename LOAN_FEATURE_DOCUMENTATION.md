# Loan & Return Management System

## Overview
This document describes the new loan and return management functionality added to the Bookly library application. This feature allows authenticated users to loan books for a specific date range and view book availability.

## Features

### 1. Calendar-Based Booking
- Users can view a calendar of the current month when on the book details page
- Unavailable dates are highlighted in red (books already loaned)
- Users can select a date range for their loan
- Past dates are disabled and cannot be selected

### 2. Book Availability Management
- Books show unavailable dates based on existing loans
- The system prevents overlapping loans automatically
- Real-time availability checking

### 3. Loan Tracking
- Users can track their active and returned loans
- Each loan record includes:
  - Loan date
  - Return date
  - Actual return date (when returned)
  - Current status (active, returned, overdue)

## Backend Architecture

### Database Models

#### Loan Model (`backend/models/loan.js`)
```javascript
{
  user: ObjectId,           // Reference to User
  book: ObjectId,           // Reference to Book
  loanDate: Date,          // When the loan starts
  returnDate: Date,        // Expected return date
  actualReturnDate: Date,  // When actually returned (null if not returned)
  status: String,          // 'active', 'returned', 'overdue'
  notes: String,           // Optional notes
  timestamps: true         // createdAt, updatedAt
}
```

### API Endpoints

#### 1. Create Loan
```
POST /api/loans
Headers: Authorization: Bearer {token}
Body: {
  bookId: string,
  loanDate: ISO8601 date,
  returnDate: ISO8601 date,
  notes: string (optional)
}
Response: {
  success: boolean,
  message: string,
  data: Loan object
}
```

#### 2. Get Book Loan Dates
```
GET /api/loans/book/:bookId
Response: {
  success: boolean,
  data: [
    {
      startDate: ISO8601 date,
      endDate: ISO8601 date
    }
  ]
}
```

#### 3. Get User Loans
```
GET /api/loans/user/all
Headers: Authorization: Bearer {token}
Response: {
  success: boolean,
  data: [Loan objects populated with book and user details]
}
```

#### 4. Check Book Availability
```
GET /api/loans/availability/:bookId?startDate={date}&endDate={date}
Response: {
  success: boolean,
  isAvailable: boolean
}
```

#### 5. Return Book
```
PUT /api/loans/return/:loanId
Headers: Authorization: Bearer {token}
Response: {
  success: boolean,
  message: string,
  data: Updated Loan object
}
```

#### 6. Get Loan Details
```
GET /api/loans/:loanId
Headers: Authorization: Bearer {token}
Response: {
  success: boolean,
  data: Loan object (populated with user and book details)
}
```

## Frontend Architecture

### Components

#### Calendar Component (`frontend/src/components/calendar/Calendar.jsx`)
Displays an interactive calendar with:
- Month navigation
- Hover range selection
- Unavailable dates highlighting
- Past dates disabled
- Legend showing date status

**Props:**
- `bookId`: string - Book ID
- `onDateRangeSelect`: function - Callback when dates are selected
- `unavailableDates`: array - Array of date ranges that are unavailable

#### LoanButton Component (`frontend/src/components/loan/LoanButton.jsx`)
Main component integrating the loan workflow:
- Shows login prompt for non-authenticated users
- Opens calendar modal
- Handles loan creation
- Shows success/error messages
- Displays loading states

**Props:**
- `bookId`: string - Book ID
- `isAuthenticated`: boolean - Whether user is logged in

### Redux Integration

#### Loan Slice (`frontend/src/redux/slices/loanSlice.js`)
State management for loan operations with actions:
- `setUnavailableDates` - Store unavailable dates
- `setUserLoans` - Store user's loans
- `addLoan` - Add new loan to state
- `updateLoanStatus` - Update loan status
- `setError` - Set error state
- `clearError` - Clear error state

#### Loan API Calls (`frontend/src/redux/apiCalls/loanApiCall.js`)
Direct API communication functions:
- `getBookLoanDates(bookId)` - Fetch unavailable dates
- `createLoan(bookId, loanDate, returnDate, notes)` - Create new loan
- `getUserLoans()` - Fetch user's loans
- `returnBook(loanId)` - Return a book
- `checkBookAvailability(bookId, startDate, endDate)` - Check availability
- `getLoanDetail(loanId)` - Get loan details

### Styling

#### Calendar Styling (`frontend/src/components/calendar/calendar.css`)
- Responsive grid layout
- Color-coded date statuses
- Smooth transitions and animations
- Mobile-friendly design

#### LoanButton Styling (`frontend/src/components/loan/loan-button.css`)
- Modal overlay with backdrop
- Form styling and validation feedback
- Responsive button layout
- Animation effects

## Integration with BookDetails Page

The `LoanButton` component is integrated into the `BookDetails.jsx` page:

1. Import LoanButton component
2. Pass `bookId` and `isAuthenticated` props
3. Component handles all loan logic internally
4. No modification to existing book details functionality

## Usage Flow

### User Journey
1. User browses to book details page
2. If logged in, sees "Loan This Book" button
3. Clicks button to open calendar modal
4. Calendar shows unavailable dates (in red)
5. User selects start and end dates (dates must be in future)
6. Clicks "Confirm Loan" to submit
7. System validates dates and creates loan
8. Success message shown, calendar closes
9. User can later return the book from their loans list

### Validation Rules
- Return date must be after loan date
- Cannot select past dates
- Cannot select unavailable dates
- Cannot create overlapping loans for the same book
- Maximum loan duration (if enforced) - currently no limit

## Error Handling

The system handles various error scenarios:
- Book not available for selected dates
- Invalid date ranges
- User not authenticated
- Network errors
- Unauthorized loan returns

Each error displays a user-friendly message in the modal.

## Security

- All loan endpoints require authentication (Bearer token)
- Users can only return their own loans
- Loan creation validates book availability server-side
- No client-side modifications bypass server validation

## Scalability Considerations

### Database Optimization
- Loan model indexed on:
  - user + status (for user queries)
  - book + status + loanDate/returnDate (for availability checks)
  - createdAt (for sorting)

### Component Modularity
- Calendar component is independent and reusable
- LoanButton wraps all loan logic
- API calls separated from components
- Redux slice for centralized state management

### Future Enhancements
- Loan notifications/reminders
- Fine calculations for overdue books
- Waitlist for unavailable books
- Bulk operations for admins
- Export loan history
- Statistics dashboard

## Configuration

### Environment Variables
No additional environment variables required beyond existing setup.

### Database Migration
Run Prisma migration or manual MongoDB schema setup:
```bash
# Migrations will be handled by your existing database setup
# Ensure Loan model is created in database
```

## Testing

### Manual Testing Checklist
- [ ] Non-authenticated user sees login prompt
- [ ] Authenticated user can open calendar
- [ ] Calendar displays unavailable dates correctly
- [ ] Date range selection works
- [ ] Loan creation succeeds with valid dates
- [ ] Overlapping dates are rejected
- [ ] User can view their loans
- [ ] User can return a book
- [ ] Past dates are disabled
- [ ] Future months navigation works

## Performance Notes

- Loan dates are fetched only when calendar is opened
- Caching can be added for frequently accessed books
- Consider pagination for users with many loans
- Calendar component efficiently renders only visible month

## Troubleshooting

### Calendar not showing unavailable dates
- Check if API endpoint is responding with loan data
- Verify dates are in ISO8601 format
- Check browser console for API errors

### Loan creation fails
- Ensure user is authenticated (token in localStorage)
- Verify return date is after loan date
- Check if dates overlap with existing loans
- Verify bookId is correct

### Styling issues
- Ensure CSS files are imported in components
- Check for CSS variable definitions (--primary-color, etc.)
- Verify no conflicting CSS rules

## File Structure
```
backend/
├── models/
│   └── loan.js
├── controllers/
│   └── loanController.js
├── routes/
│   └── loanRoute.js

frontend/
├── src/
│   ├── components/
│   │   ├── calendar/
│   │   │   ├── Calendar.jsx
│   │   │   └── calendar.css
│   │   └── loan/
│   │       ├── LoanButton.jsx
│   │       └── loan-button.css
│   ├── redux/
│   │   ├── slices/
│   │   │   └── loanSlice.js
│   │   └── apiCalls/
│   │       └── loanApiCall.js
│   └── pages/
│       └── book/
│           └── BookDetails.jsx (updated)
```

## License
Same as main project
