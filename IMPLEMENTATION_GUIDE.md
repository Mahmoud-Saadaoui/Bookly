# Implementation Guide - Loan & Return Management

## Quick Start Guide

This guide will help you implement the new loan and return management system in your Bookly application.

## Backend Setup

### Step 1: Database Model
The Loan model has been created in `backend/models/loan.js`. It includes:
- User reference
- Book reference
- Loan dates (start and end)
- Return status tracking
- Timestamps

### Step 2: Controllers
The loan controller (`backend/controllers/loanController.js`) provides all business logic:
- Loan creation with availability checking
- Date conflict detection
- Book return processing
- Loan history retrieval

### Step 3: Routes
Add loan routes to your server. The routes file (`backend/routes/loanRoute.js`) is already configured.

### Step 4: Server Integration
The `server.js` file has been updated to include:
```javascript
app.use('/api/loans', require('./routes/loanRoute'))
```

This allows access to all loan endpoints at `/api/loans/*`

### Step 5: Database Connection
Ensure your MongoDB is running and your `.env` file contains:
```
MONGODB_URI=your_mongodb_connection_string
```

## Frontend Setup

### Step 1: Components Installation
New components have been created:
- `Calendar.jsx` - Interactive calendar component
- `LoanButton.jsx` - Main loan interface

### Step 2: Redux Integration
New Redux files created:
- `loanSlice.js` - Redux slice for loan state management
- `loanApiCall.js` - API communication functions

The store has been updated to include the loan reducer.

### Step 3: BookDetails Integration
The `BookDetails.jsx` page now includes:
```jsx
<LoanButton bookId={books?._id} isAuthenticated={!!user} />
```

This integration requires no additional changes to existing functionality.

## Important Configuration

### Authentication Token
The loan API calls use the authentication token stored in `localStorage` as `authToken`. Ensure your authentication system stores tokens with this key:

```javascript
localStorage.setItem('authToken', token);
```

### API Base URL
The API calls use the `BASE_URL` from `constantes.js`. Ensure your environment is correctly set:
- Development: `http://localhost:5001/api`
- Production: Your production domain

## Testing the Implementation

### Backend Testing (Using Postman or curl)

1. **Create a Loan** (requires authentication):
```bash
POST http://localhost:5001/api/loans
Authorization: Bearer {your_token}
Content-Type: application/json

{
  "bookId": "book_id_here",
  "loanDate": "2024-02-15T00:00:00Z",
  "returnDate": "2024-02-22T00:00:00Z",
  "notes": "Optional notes"
}
```

2. **Get Book Unavailable Dates**:
```bash
GET http://localhost:5001/api/loans/book/{bookId}
```

3. **Check Availability**:
```bash
GET http://localhost:5001/api/loans/availability/{bookId}?startDate=2024-02-15&endDate=2024-02-22
```

4. **Get User Loans** (requires authentication):
```bash
GET http://localhost:5001/api/loans/user/all
Authorization: Bearer {your_token}
```

5. **Return a Book** (requires authentication):
```bash
PUT http://localhost:5001/api/loans/return/{loanId}
Authorization: Bearer {your_token}
```

### Frontend Testing

1. **Login** to the application
2. **Navigate** to any book details page
3. **Click** "Loan This Book" button
4. **Select** a date range in the calendar
5. **Click** "Confirm Loan"
6. **Verify** success message appears
7. **Check** unavailable dates update in the calendar

## Troubleshooting

### Issue: "Unauthorized" Error
**Solution**: Ensure your authentication token is being stored and sent correctly:
- Check `localStorage.getItem('authToken')` in browser console
- Verify token is included in API request headers

### Issue: Calendar Not Showing
**Solution**: Check:
- CSS files are imported in components
- No JavaScript errors in console
- Component is properly mounted in BookDetails.jsx

### Issue: Loan Creation Fails with "Book not available"
**Solution**: This is expected if:
- Dates overlap with existing loans
- Return date is before loan date
- Try selecting different dates

### Issue: Database Connection Error
**Solution**:
- Verify MongoDB is running
- Check connection string in `.env`
- Ensure MONGODB_URI is set correctly

## Performance Optimization

### For Production Deployment

1. **Add Database Indexes**:
```javascript
// In loan.js model, add indexes for frequently queried fields
db.loans.createIndex({ book: 1, status: 1 })
db.loans.createIndex({ user: 1, createdAt: -1 })
db.loans.createIndex({ book: 1, loanDate: 1, returnDate: 1 })
```

2. **Consider Caching**:
- Cache unavailable dates for popular books
- Implement Redis for session management

3. **API Rate Limiting**:
- Implement rate limiting on loan creation endpoint
- Prevent abuse

### Frontend Optimization

1. **Lazy Load Calendar**:
   - Calendar loads only when user clicks "Loan This Book"

2. **Memoize Components**:
   - Calendar component can be wrapped with `React.memo()` for performance

## Deployment Checklist

- [ ] Loan model created in MongoDB
- [ ] Backend routes configured in server.js
- [ ] Frontend components imported and integrated
- [ ] Redux store updated with loan slice
- [ ] Authentication token properly configured
- [ ] API base URL correct for environment
- [ ] CSS files properly imported
- [ ] No console errors in browser
- [ ] Tested loan creation
- [ ] Tested loan return
- [ ] Tested date range selection
- [ ] Tested overlapping date rejection

## File Checklist

### Backend Files (Created/Modified)
- ✅ `backend/models/loan.js` - NEW
- ✅ `backend/controllers/loanController.js` - NEW
- ✅ `backend/routes/loanRoute.js` - NEW
- ✅ `backend/server.js` - MODIFIED (added loan routes)

### Frontend Files (Created/Modified)
- ✅ `frontend/src/components/calendar/Calendar.jsx` - NEW
- ✅ `frontend/src/components/calendar/calendar.css` - NEW
- ✅ `frontend/src/components/loan/LoanButton.jsx` - NEW
- ✅ `frontend/src/components/loan/loan-button.css` - NEW
- ✅ `frontend/src/redux/slices/loanSlice.js` - NEW
- ✅ `frontend/src/redux/apiCalls/loanApiCall.js` - NEW
- ✅ `frontend/src/redux/store.js` - MODIFIED (added loan reducer)
- ✅ `frontend/src/pages/book/BookDetails.jsx` - MODIFIED (added LoanButton)
- ✅ `frontend/src/pages/book/book.css` - MODIFIED (added loan section styling)
- ✅ `frontend/src/constantes.js` - MODIFIED (added LOANS_URL)

## Next Steps

1. **Test the implementation** thoroughly
2. **Deploy to production** following your standard process
3. **Monitor for errors** in production
4. **Gather user feedback** on the feature
5. **Plan enhancements** (see documentation for ideas)

## Support & Questions

For detailed information about the loan feature, see:
- `LOAN_FEATURE_DOCUMENTATION.md` - Complete technical documentation
- API endpoint documentation in this guide

## Rollback Plan (if needed)

If you need to disable the loan feature:

1. Remove LoanButton from BookDetails.jsx
2. Comment out loan routes in server.js
3. Remove loan slice from Redux store
4. Redeploy application

The loan data will remain in the database for future use or rollback.

---

**Congratulations!** Your Bookly application now has a fully functional loan and return management system! 🎉
