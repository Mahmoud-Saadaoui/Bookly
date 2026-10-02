# 🚀 Quick Reference - Loan Management System

## Files Created/Modified

### 📁 Backend
```
backend/
├── models/loan.js                      [NEW]
├── controllers/loanController.js       [NEW]
├── routes/loanRoute.js                 [NEW]
└── server.js                           [MODIFIED]
```

### 📁 Frontend
```
frontend/src/
├── components/
│   ├── calendar/
│   │   ├── Calendar.jsx                [NEW]
│   │   └── calendar.css                [NEW]
│   └── loan/
│       ├── LoanButton.jsx              [NEW]
│       └── loan-button.css             [NEW]
├── redux/
│   ├── slices/loanSlice.js             [NEW]
│   ├── apiCalls/loanApiCall.js         [NEW]
│   └── store.js                        [MODIFIED]
├── pages/book/BookDetails.jsx          [MODIFIED]
├── pages/book/book.css                 [MODIFIED]
└── constantes.js                       [MODIFIED]
```

### 📄 Documentation
```
LOAN_FEATURE_DOCUMENTATION.md          [NEW] - Full Technical Reference
IMPLEMENTATION_GUIDE.md                [NEW] - Setup & Deployment
LOAN_FEATURE_SUMMARY.md                [NEW] - Overview & Highlights
```

---

## 🔌 API Quick Reference

| Endpoint | Method | Auth | Example Response |
|----------|--------|------|------------------|
| `/loans` | POST | ✅ | `{success: true, data: {_id, user, book, loanDate, ...}}` |
| `/loans/book/:id` | GET | ❌ | `{success: true, data: [{startDate, endDate}, ...]}` |
| `/loans/user/all` | GET | ✅ | `{success: true, data: [loan, loan, ...]}` |
| `/loans/availability/:id` | GET | ❌ | `{success: true, isAvailable: true/false}` |
| `/loans/return/:id` | PUT | ✅ | `{success: true, data: {status: 'returned', ...}}` |
| `/loans/:id` | GET | ✅ | `{success: true, data: loanObject}` |

---

## 🎨 Component Usage

### Calendar Component
```jsx
<Calendar 
  bookId="book_id"
  onDateRangeSelect={(range) => console.log(range)}
  unavailableDates={[{startDate: Date, endDate: Date}]}
/>
```

### LoanButton Component
```jsx
<LoanButton 
  bookId="book_id"
  isAuthenticated={true}
/>
```

---

## 📦 Redux Store Structure

```javascript
store.loan = {
  loans: [],                    // User's loans array
  unavailableDates: [],        // Book's unavailable dates
  loading: false,              // Loading state
  error: null,                 // Error message
  selectedLoan: null           // Currently selected loan
}
```

---

## 🛠️ Environment Setup

### Required Files
```
.env file must contain:
- MONGODB_URI (for backend)
- PORT (backend port)
- CLIENT_DEVELOPMENT_DOMAIN
- CLIENT_PRODUCTION_DOMAIN
```

### Token Storage
```javascript
// Frontend must store token as:
localStorage.setItem('authToken', token);
```

---

## ⚙️ Installation Steps

1. **Backend**
   ```bash
   cd backend
   npm install  # Ensure all dependencies installed
   npm run dev   # Start server
   ```

2. **Frontend**
   ```bash
   cd frontend
   npm install  # Ensure all dependencies installed
   npm start    # Start dev server
   ```

3. **Database**
   - Ensure MongoDB is running
   - Connection string in `.env` file

---

## 🧪 Quick Test

1. Login to app
2. Go to any book details page
3. Click "Loan This Book"
4. Select dates in calendar
5. Click "Confirm Loan"
6. See success message

---

## 🔍 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| "Unauthorized" error | Check localStorage has 'authToken' |
| Calendar not showing | Verify CSS files imported |
| No unavailable dates | Check API is returning loan data |
| Loan creation fails | Verify dates don't overlap existing loans |
| 404 on API calls | Ensure loan routes added to server.js |

---

## 📊 Data Flow Diagram

```
BookDetails Page
    ↓
[LoanButton Component]
    ↓
User clicks "Loan This Book"
    ↓
Modal opens + Calendar renders
    ↓
fetch(loanApiCall.getBookLoanDates)
    ↓
Redux dispatch(setUnavailableDates)
    ↓
Calendar displays with unavailable dates
    ↓
User selects dates
    ↓
User clicks "Confirm Loan"
    ↓
fetch(loanApiCall.createLoan)
    ↓
Backend validates & creates loan
    ↓
Success/Error response
    ↓
Redux dispatch(addLoan) or show error
    ↓
Calendar refreshes
```

---

## 🎯 Component Props

### LoanButton
```javascript
{
  bookId: String,              // Book MongoDB ID
  isAuthenticated: Boolean     // User logged in status
}
```

### Calendar
```javascript
{
  bookId: String,              // Book MongoDB ID
  onDateRangeSelect: Function, // (range) => {}
  unavailableDates: Array      // [{startDate, endDate}]
}
```

---

## 💡 Key Functions

### Frontend
```javascript
// Create loan
createLoan(bookId, loanDate, returnDate, notes)

// Get unavailable dates
getBookLoanDates(bookId)

// Check availability
checkBookAvailability(bookId, startDate, endDate)

// Get user loans
getUserLoans()

// Return book
returnBook(loanId)
```

### Backend
```javascript
// Create loan with validation
exports.createLoan

// Get book loan dates
exports.getBookLoanDates

// Get user loans
exports.getUserLoans

// Return book
exports.returnBook

// Check availability
exports.checkBookAvailability
```

---

## 🎨 Color Scheme

- 🟠 **Primary (Loan)**: `#f75f0e`
- 🟠 **Hover**: `#e55000`
- 🔴 **Unavailable**: `#ffcccc`
- ⚫ **Past**: `#e8e8e8`
- ⚪ **Background**: `#f5f5f5`

---

## 📱 Responsive Breakpoints

- Mobile: < 600px
- Tablet: 600px - 1200px
- Desktop: > 1200px

---

## 🔐 Authentication

All loan endpoints (except availability check) require:
```javascript
headers: {
  'Authorization': 'Bearer {token}',
  'Content-Type': 'application/json'
}
```

---

## ✨ Features at a Glance

| Feature | Status |
|---------|--------|
| Interactive Calendar | ✅ Complete |
| Date Range Selection | ✅ Complete |
| Availability Checking | ✅ Complete |
| Loan Creation | ✅ Complete |
| Book Returns | ✅ Complete |
| Error Handling | ✅ Complete |
| Mobile Responsive | ✅ Complete |
| Authentication | ✅ Complete |
| Documentation | ✅ Complete |

---

## 📞 Need Help?

1. Check **IMPLEMENTATION_GUIDE.md** for setup
2. See **LOAN_FEATURE_DOCUMENTATION.md** for details
3. Review code comments in components
4. Check browser console for errors

---

**Last Updated**: February 2026  
**Status**: ✅ Production Ready  
**Version**: 1.0.0
