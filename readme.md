# Bookly

> **Bookly** is a modern Library Management System built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

![Bookly](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)
![Node](https://img.shields.io/badge/Node.js-18.x-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-47A248?logo=mongodb)

---

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### User Features
- **Authentication**: Secure user registration and login with JWT
- **Book Discovery**: Browse and search through a collection of books with pagination
- **Book Ratings**: Rate books from 1 to 5 stars with comments
- **Favorites**: Add or remove books from your personal favorites list
- **Book Loans**: Borrow and return books with due date tracking

### Admin Features
- **Dashboard**: Complete admin panel for book management
- **CRUD Operations**: Add, edit, and delete books
- **Image Management**: Upload and manage book covers via Cloudinary

### Technical Features
- JWT-based authentication
- RESTful API design
- Pagination for better performance
- Cloudinary integration for image storage
- Redux Toolkit for state management
- CORS configuration for secure frontend-backend communication
- Health check endpoints for monitoring

---

## Technologies

| Component | Technology |
|-----------|-----------|
| **Frontend** | React.js 18.x, Redux Toolkit, React Router |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Authentication** | JWT (JSON Web Tokens) |
| **Image Storage** | Cloudinary |
| **Styling** | CSS3 |
| **Deployment** | Vercel (Frontend), Render (Backend) |

---

## Project Structure

```
Bookly/
├── backend/
│   ├── config/         # Database configuration
│   ├── controllers/    # Route controllers
│   ├── middlewares/    # Custom middlewares (auth, logging, etc.)
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── utils/          # Utility functions (logger, JWT, etc.)
│   ├── server.js       # Entry point
│   └── package.json
│
├── frontend/
│   ├── public/         # Static files
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── pages/      # Page components
│   │   ├── redux/      # Redux store and API calls
│   │   └── index.js    # Entry point
│   └── package.json
│
└── README.md
```

---

## Installation

### Prerequisites

- Node.js 18.x or higher
- MongoDB (local or Atlas account)
- npm or yarn package manager

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/Bookly.git
cd Bookly
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 4. Environment Configuration

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/bookly

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Client Domains (for CORS)
CLIENT_DEVELOPMENT_DOMAIN=http://localhost:3000
CLIENT_PRODUCTION_DOMAIN=https://your-frontend-domain.vercel.app

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 5. Run the Application

**Backend (Terminal 1):**
```bash
cd backend
npm run dev
```

**Frontend (Terminal 2):**
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5001`

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Backend server port | No (default: 5001) |
| `NODE_ENV` | Environment mode | No (default: development) |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `CLIENT_DEVELOPMENT_DOMAIN` | Frontend URL for development | Yes |
| `CLIENT_PRODUCTION_DOMAIN` | Frontend URL for production | Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register` | Register a new user |
| POST | `/api/users/login` | Login user |

### Books
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books` | Get all books (with pagination) |
| GET | `/api/books/:id` | Get a single book |
| POST | `/api/books` | Create a book (Admin only) |
| PUT | `/api/books/:id` | Update a book (Admin only) |
| DELETE | `/api/books/:id` | Delete a book (Admin only) |

### Favorites
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/favoriteList` | Get user's favorites |
| POST | `/api/favoriteList` | Add to favorites |
| DELETE | `/api/favoriteList/:id` | Remove from favorites |

### Loans
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/loans` | Get user's loans |
| POST | `/api/loans` | Borrow a book |
| PUT | `/api/loans/:id/return` | Return a book |

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | API health status with database check |
| GET | `/health/ready` | Readiness probe |
| GET | `/health/live` | Liveness probe |

---

## Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set the **Root Directory** to `frontend`
3. Add environment variables if needed
4. Deploy

### Backend (Render)

**Important:** Configure your Render Web Service with the following settings:

| Setting | Value |
|---------|-------|
| **Root Directory** | `backend` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |

Or create a `render.yaml` file at the root of your project:

```yaml
services:
  - type: web
    name: bookly-backend
    env: node
    buildCommand: cd backend && npm install
    startCommand: cd backend && node server.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
```

### Environment Variables on Render
Add all required environment variables in your Render dashboard:
- `MONGODB_URI`
- `JWT_SECRET`
- `CLIENT_DEVELOPMENT_DOMAIN`
- `CLIENT_PRODUCTION_DOMAIN`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

---

## Live Demo

- **Frontend**: [Bookly on Vercel](https://your-frontend-domain.vercel.app)
- **Backend API**: [Bookly API on Render](https://bookly-1rvp.onrender.com)
- **Health Check**: [Health Status](https://bookly-1rvp.onrender.com/health)

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## Author

**Mahmoud Saadaoui**

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

---

## License

This project is licensed under the ISC License.

---

<!-- For potential contributors:
## Troubleshooting

### Common Issues

1. **CORS Error**: Make sure your frontend domain is added in `CLIENT_DEVELOPMENT_DOMAIN` or `CLIENT_PRODUCTION_DOMAIN`
2. **MongoDB Connection**: Verify your `MONGODB_URI` is correct
3. **Image Upload Failed**: Check your Cloudinary credentials
4. **Health Check Returns 404**: Ensure the Root Directory on Render is set to `backend`
-->
