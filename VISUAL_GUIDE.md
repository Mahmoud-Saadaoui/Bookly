# 📊 Loan Management System - Visual Guide

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      BOOKLY APPLICATION                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────────────┐              ┌────────────────────────┐  │
│  │  USER INTERFACE   │              │   DATA MANAGEMENT      │  │
│  │                   │              │                        │  │
│  │  BookDetails Page │──────────────│  Redux Store           │  │
│  │                   │              │  ├─ authSlice          │  │
│  │  LoanButton       │◄─────────────│  ├─ bookSlice          │  │
│  │  ├─ Calendar      │              │  ├─ favoriteSlice      │  │
│  │  └─ Modal         │              │  └─ loanSlice         │  │
│  │                   │              │                        │  │
│  └───────────────────┘              └────────────────────────┘  │
│           │                                       │               │
│           │                                       │               │
│           ▼                                       ▼               │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │           API CALLS & COMMUNICATION                     │    │
│  │                                                          │    │
│  │  ├─ loanApiCall.js                                      │    │
│  │  │  ├─ createLoan()                                     │    │
│  │  │  ├─ getBookLoanDates()                               │    │
│  │  │  ├─ getUserLoans()                                   │    │
│  │  │  ├─ returnBook()                                     │    │
│  │  │  └─ checkBookAvailability()                          │    │
│  │  │                                                       │    │
│  │  └─ Other API calls...                                  │    │
│  │                                                          │    │
│  └──────────────────────────┬───────────────────────────────┘   │
│                             │ HTTP Requests                      │
└─────────────────────────────┼──────────────────────────────────┘
                              │
                    ┌─────────▼──────────┐
                    │   BACKEND SERVER   │
                    │  (Express.js)      │
                    │                    │
                    │  ┌──────────────┐  │
                    │  │  Loan Routes │  │
                    │  │              │  │
                    │  │  POST   /    │  │
                    │  │  GET    /    │  │
                    │  │  PUT  /      │  │
                    │  │              │  │
                    │  └──────┬───────┘  │
                    │         │          │
                    │  ┌──────▼──────┐   │
                    │  │Loan          │   │
                    │  │Controller    │   │
                    │  └──────┬───────┘   │
                    │         │           │
                    └─────────┼───────────┘
                              │
                    ┌─────────▼────────┐
                    │   MONGODB        │
                    │                  │
                    │  ┌────────────┐  │
                    │  │ Loans      │  │
                    │  │ Collection │  │
                    │  └────────────┘  │
                    │                  │
                    └──────────────────┘
```

---

## User Flow Diagram

```
                    ┌──────────────────┐
                    │ USER ARRIVES AT  │
                    │ BOOK DETAILS     │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │ USER LOGGED IN?  │
                    └────┬─────────┬───┘
                         │         │
                    NO ◄─┘         └─► YES
                         │             │
         ┌───────────────────┐        │
         │ SHOW LOGIN PROMPT │        │
         └───────────────────┘        │
                                      │
                          ┌───────────▼──────────┐
                          │ SHOW "LOAN THIS      │
                          │ BOOK" BUTTON         │
                          └───────────┬──────────┘
                                      │
                          ┌───────────▼──────────┐
                          │ USER CLICKS BUTTON   │
                          └───────────┬──────────┘
                                      │
                          ┌───────────▼──────────┐
                          │ OPEN CALENDAR MODAL  │
                          └───────────┬──────────┘
                                      │
                     ┌────────────────▼────────────────┐
                     │ FETCH UNAVAILABLE DATES FROM API│
                     └────────────────┬────────────────┘
                                      │
                     ┌────────────────▼────────────────┐
                     │ DISPLAY CALENDAR WITH:          │
                     │ • Available dates (white)       │
                     │ • Unavailable dates (red)       │
                     │ • Today (orange)                │
                     │ • Past dates (disabled)         │
                     └────────────────┬────────────────┘
                                      │
                     ┌────────────────▼────────────────┐
                     │ USER SELECTS DATE RANGE         │
                     └────────────────┬────────────────┘
                                      │
                     ┌────────────────▼────────────────┐
                     │ USER CLICKS "CONFIRM LOAN"      │
                     └────────────────┬────────────────┘
                                      │
                     ┌────────────────▼────────────────┐
                     │ SEND LOAN REQUEST TO API        │
                     └────────────────┬────────────────┘
                                      │
                        ┌─────────────┴─────────────┐
                        │                           │
                   VALID ◄─────────────────────┬───► INVALID
                        │                      │
         ┌──────────────────┐      ┌──────────────────┐
         │ LOAN CREATED ✓   │      │ SHOW ERROR MSG   │
         └─────────┬────────┘      └──────────────────┘
                   │
         ┌─────────▼────────┐
         │ UPDATE CALENDAR  │
         │ SHOW SUCCESS MSG │
         │ CLOSE MODAL      │
         └──────────────────┘
```

---

## Calendar Component State

```
                    ┌────────────────────────┐
                    │  CALENDAR COMPONENT    │
                    │      STATE             │
                    └────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
    │ currentDate  │  │selectedRange │  │hoveredDate   │
    │              │  │              │  │              │
    │ • Month      │  │ • start date │  │ • date being │
    │ • Year       │  │ • end date   │  │   hovered    │
    │              │  │              │  │              │
    │ Used for:    │  │ Used for:    │  │ Used for:    │
    │ • Rendering  │  │ • Tracking   │  │ • Range      │
    │   grid       │  │   selection  │  │   preview    │
    │ • Navigation │  │ • Displaying │  │ • Styling    │
    │              │  │   selection  │  │              │
    └──────────────┘  └──────────────┘  └──────────────┘
```

---

## Data Flow - Creating a Loan

```
Step 1: USER INTERACTION
┌──────────────────────────────┐
│ User selects dates in calendar
└──────────┬───────────────────┘
           │
Step 2: STATE MANAGEMENT
┌──────────────────────────────┐
│ selectedRange = {             │
│   start: Date,               │
│   end: Date                  │
│ }                            │
└──────────┬───────────────────┘
           │
Step 3: VALIDATION
┌──────────────────────────────┐
│ • start < end? ✓             │
│ • start in future? ✓         │
│ • dates available? ?         │
└──────────┬───────────────────┘
           │
Step 4: API CALL
┌──────────────────────────────┐
│ POST /api/loans              │
│ body: {                      │
│   bookId,                    │
│   loanDate,                  │
│   returnDate,                │
│   notes                      │
│ }                            │
└──────────┬───────────────────┘
           │
Step 5: BACKEND PROCESSING
┌──────────────────────────────┐
│ • Check auth ✓               │
│ • Validate dates ✓           │
│ • Check conflicts ✓          │
│ • Create Loan doc ✓          │
└──────────┬───────────────────┘
           │
Step 6: RESPONSE
┌──────────────────────────────┐
│ {                            │
│   success: true,             │
│   data: Loan object          │
│ }                            │
└──────────┬───────────────────┘
           │
Step 7: FRONTEND UPDATE
┌──────────────────────────────┐
│ • Show success message       │
│ • Refresh unavailable dates  │
│ • Close modal                │
│ • Update Redux store         │
└──────────────────────────────┘
```

---

## Loan Model Relationships

```
                    ┌─────────────────┐
                    │      LOAN       │
                    └────────┬────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
            ▼                ▼                ▼
    ┌────────────┐    ┌────────────┐    ┌──────────┐
    │   USER     │    │    BOOK    │    │  DATES   │
    ├────────────┤    ├────────────┤    ├──────────┤
    │ _id        │    │ _id        │    │ Start    │
    │ name       │    │ title      │    │ Return   │
    │ email      │    │ author     │    │ Actual   │
    │ isAdmin    │    │ image      │    │ Status   │
    └────────────┘    └────────────┘    └──────────┘
         ▲                   ▲
         │                   │
    Referenced by        Referenced by
    User field           Book field
    in Loan              in Loan
```

---

## Calendar Color Legend

```
┌────────────────────────────────────────────┐
│         CALENDAR DATE COLORS               │
├────────────────────────────────────────────┤
│                                            │
│  ⬜ White/Light Gray                       │
│     → Available for selection               │
│     → Future date                           │
│                                            │
│  🟠 Orange                                 │
│     → Today                                 │
│     → Selected/In Range                    │
│                                            │
│  🔴 Red/Pink                               │
│     → UNAVAILABLE                          │
│     → Book already loaned                  │
│     → Cannot select                        │
│                                            │
│  ⚫ Dark Gray                               │
│     → Past date                             │
│     → Cannot select (in past)              │
│                                            │
│  ✨ Light Orange                           │
│     → Hover range preview                  │
│     → Between start and hovered date       │
│                                            │
└────────────────────────────────────────────┘
```

---

## Component Hierarchy

```
BookDetails Page
│
├─── Header
├─── Book Info Section
├─── Ratings
├─── Buttons Row
│    ├─── Add to Favorites Button
│    └─── Add Review Button
│
├─── Reviews Section
│
└─── LoanButton Component 👈 NEW
     │
     ├─── Loan Button
     │
     └─── Modal (when open)
          │
          ├─── Modal Header
          │    ├─── Title "Select Loan Dates"
          │    └─── Close Button
          │
          ├─── Calendar Component 👈 NEW
          │    ├─── Header
          │    │    ├─── Previous Month Button
          │    │    ├─── Month/Year Display
          │    │    └─── Next Month Button
          │    │
          │    ├─── Weekday Headers
          │    │    └─── Sun, Mon, Tue...
          │    │
          │    ├─── Days Grid
          │    │    └─── Day Cells (color-coded)
          │    │
          │    └─── Legend
          │         ├─── Today
          │         ├─── Selected
          │         └─── Unavailable
          │
          ├─── Messages
          │    ├─── Error Message (if any)
          │    └─── Success Message (if any)
          │
          └─── Footer
               ├─── Cancel Button
               └─── Confirm Button
```

---

## Redux State Management

```
┌────────────────────────────────────────────┐
│         REDUX STORE                        │
├────────────────────────────────────────────┤
│                                            │
│  store = {                                 │
│    auth: { ... },          ← Existing      │
│    book: { ... },          ← Existing      │
│    favorites: { ... },     ← Existing      │
│                                            │
│    loan: {  👈 NEW                         │
│      loans: [],                            │
│      unavailableDates: [],                 │
│      loading: false,                       │
│      error: null,                          │
│      selectedLoan: null                    │
│    }                                       │
│  }                                         │
│                                            │
└────────────────────────────────────────────┘

ACTIONS:
  • setUnavailableDates()
  • setUserLoans()
  • addLoan()
  • updateLoanStatus()
  • setSelectedLoan()
  • setLoading()
  • setError()
  • clearError()
```

---

## API Request/Response Flow

```
FRONTEND                              BACKEND
    │                                    │
    │─── POST /api/loans ──────────────►│
    │    {bookId, dates...}              │
    │                                    │
    │                           ┌────────┴──────┐
    │                           │ 1. Auth check │
    │                           │ 2. Validate   │
    │                           │ 3. Check DB   │
    │                           │ 4. Create doc │
    │                           │ 5. Send back  │
    │                           └────────┬──────┘
    │◄───────────── 201 Created ────────│
    │    {success, data: Loan}           │
    │                                    │
    │─── GET /api/loans/book/:id ──────►│
    │                                    │
    │                           ┌────────┴──────┐
    │                           │ Query DB for  │
    │                           │ active loans  │
    │                           └────────┬──────┘
    │◄───────────── 200 OK ─────────────│
    │    {success, data: dates}          │
    │                                    │
```

---

## Error Handling Flow

```
┌──────────────┐
│ USER ACTION  │
└──────┬───────┘
       │
       ▼
┌─────────────────────┐
│ VALIDATION          │
└────┬────────────────┘
     │
     ├─► VALID ─────► CREATE/SUBMIT
     │                    │
     │                    ▼
     │              ┌──────────────┐
     │              │ API REQUEST  │
     │              └────┬─────────┘
     │                   │
     │                   ├─► SUCCESS ─► SHOW SUCCESS MSG
     │                   │
     │                   └─► ERROR ────► SHOW ERROR MSG
     │
     └─► INVALID ─► SET ERROR STATE ─► DISPLAY ERROR
                        │
                        └─► USER CAN RETRY
```

---

**Visual diagrams created to help understand the system architecture and data flow!**
