# 🍦 CreMaze - Premium Ice Cream E-Commerce Platform
A full-stack MERN (MongoDB, Express, React, Node.js) application for a premium ice cream business with user authentication, product management, order tracking, and admin dashboard.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Authentication](#authentication)
- [Key Features Explained](#key-features-explained)
- [Troubleshooting](#troubleshooting)


## ✨ Features

### User Features
- **User Authentication**: Secure registration and login with JWT tokens
- **Product Browsing**: View all available ice cream products with detailed information
- **Shopping Cart**: Add/remove items, manage quantities
- **Checkout**: Complete order with shipping address and payment method selection
- **Order History**: Track all orders with status updates (Pending, Preparing, Out for Delivery, Delivered, Cancelled)
- **Profile Management**: Update personal information and addresses
- **Reorder**: Quickly reorder previous items

### Admin Features
- **Product Management**: Create, update, delete products with image uploads
- **Order Management**: View all orders, update status, cancel/restore orders
- **Message Management**: Receive and manage customer contact form submissions
- **Admin Dashboard**: Access admin-only routes with role-based protection
- **Order Analytics**: Track order status transitions (Pending → Delivered/Cancelled)

### General Features
- **Contact Form**: Send messages with email notifications
- **Email Notifications**: Confirmation emails for contact submissions
- **Search & Filter**: Find products easily

## 🛠 Tech Stack

### Frontend
- **React  & Vite** - UI library, Fast build tool
- **React Router DOM 7.9.6** - Client-side routing
- **Redux Toolkit 2.11.0** - State management
- **Axios 1.13.2** - HTTP client
- **React Icons 5.5.0** - Icon library
- **React Toastify 11.0.5** - Toast notifications

### Backend
- **Node.js & Express 5.1.0** - Server framework
- **MongoDB 9.0.0** - NoSQL database
- **Mongoose 9.0.0** - MongoDB ODM
- **JWT (jsonwebtoken 9.0.2)** - Authentication
- **bcryptjs 3.0.3** - Password hashing
- **Multer 2.0.2** - File upload handling
- **Nodemailer 7.0.12** - Email service
- **CORS** - Cross-origin resource sharing

---

## 📁 Project Structure

```
MERN Fullstack project/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema (auth, profile)
│   │   ├── Product.js       # Product schema
│   │   ├── Order.js         # Order schema (with status management)
│   │   └── Contact.js       # Contact messages schema
│   ├── routes/
│   │   ├── users.js         # Auth & profile routes
│   │   ├── products.js      # Product CRUD routes
│   │   ├── orders.js        # Order management routes
│   │   └── contact.js       # Contact form routes
│   ├── middleware/
│   │   └── auth.js          # JWT & admin protection
│   ├── utils/
│   │   ├── generateToken.js # JWT token generation
│   │   └── sendEmail.js     # Email service
│   ├── uploads/             # Product image storage
│   ├── server.js            # Express server setup
│   ├── package.json         # Backend dependencies
│   └── .env                 # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx       # Navbar + Footer wrapper
│   │   │   ├── Navbar.jsx       # Navigation component
│   │   │   ├── Footer.jsx       # Footer component
│   │   │   ├── ProductCard.jsx  # Product card display
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Landing page
│   │   │   ├── Products.jsx     # Product listing
│   │   │   ├── ProductPage.jsx  # Product details
│   │   │   ├── Login.jsx        # Login/Register
│   │   │   ├── Cart.jsx         # Shopping cart
│   │   │   ├── Checkout.jsx     # Order checkout
│   │   │   ├── OrderPlaced.jsx  # Order confirmation
│   │   │   ├── MyOrders.jsx     # Order history
│   │   │   ├── Profile.jsx      # User profile
│   │   │   ├── Contact.jsx      # Contact form
│   │   │   ├── About.jsx        # About page
│   │   │   ├── AdminProduct.jsx # Admin product management
│   │   │   ├── AdminOrders.jsx  # Admin order 
│   │   │   ├── AdminMessages.jsx# Admin messages view
│   │   │   ├── ProtectedRoute.jsx # Route protection HOC
│   │   ├── context/
│   │   │   └── ProductContext.jsx # Product global state
│   │   ├── redux/
│   │   │   ├── store.js        # Redux store
│   │   │   ├── productSlice.js # Product state
│   │   │   └── userSlice.js    # User state
│   │   ├── api/
│   │   │   └── axios.js        # Axios instance config
│   │   ├── styles/             # CSS files
│   │   ├── App.jsx             # Root component
│   │   └── main.jsx            # Entry point
│   ├── package.json            # Frontend dependencies
│   ├── vite.config.js          # Vite configuration
│   ├── .env                    # Environment variables
│   └── index.html              # HTML template
│
├── package.json                # Root package.json
└── README.md                   # This file
```

---

## 🚀 Installation

### Prerequisites
- **Node.js** (v16+) and **npm**
- **MongoDB** (local or MongoDB Atlas cloud)
- **Git**

### Clone Repository
```bash
git clone <repository-url>
cd "MERN Fullstack project"
```

### Backend Setup
```bash
cd backend
npm install
```

### Frontend Setup
```bash
cd frontend
npm install
```

---

## 🔐 Environment Variables

### Backend (.env)

PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/cremaze?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

### Frontend (.env)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_API_URL=http://localhost:5000

## ▶️ Running the Project

### Start Backend Server
```bash
cd backend
node server.js
```
Server runs on: **http://localhost:5000**

### Start Frontend Development Server
```bash
cd frontend
npm run dev
```
Frontend runs on: **http://localhost:5173**

### Build for Production
```bash
# Frontend
cd frontend
npm run build

# Output in frontend/dist/
```
## 📸 Screenshots

### Home Page
![Home Page](screenshots/home.jpg)

### Login and Myorder
![Loginandmyorder](screenshots/login%20and%20myorder.jpg)

### Products Page
![Products Page](screenshots/products.jpg)

### Contact Page
![contact Page](screenshots/contact.jpg)

### About
![About](screenshots/about.jpg)

### Cart
![Cart Page](screenshots/cart.jpg)

### Admin pages
![Admin](screenshots/Admin.jpg)


---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Routes (`/api/users`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | ❌ | Register new user |
| POST | `/login` | ❌ | Login user |
| PUT | `/profile` | ✅ | Update user profile |

### Products Routes (`/api/products`)
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/` | ❌ | - | Get all products |
| GET | `/:id` | ❌ | - | Get product by ID |
| POST | `/` | ✅ | Admin | Create product |
| PUT | `/:id` | ✅ | Admin | Update product |
| DELETE | `/:id` | ✅ | Admin | Delete product |

### Orders Routes (`/api/orders`)
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/` | ✅ | - | Create order |
| GET | `/myorders` | ✅ | - | Get user's orders |
| GET | `/` | ✅ | Admin | Get all orders |
| GET | `/:id` | ✅ | - | Get order details |
| PUT | `/:id/deliver` | ✅ | Admin | Mark as delivered |
| PUT | `/:id/cancel` | ✅ | Admin | Cancel order |
| PUT | `/:id/restore` | ✅ | Admin | Restore cancelled order |

### Contact Routes (`/api/contact`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/send` | ❌ | Send contact message |
| GET | `/` | ✅ | Get all messages (admin) |

---

## 🗄️ Database Schema

### User Model
```javascript
{
  firstname: String (required),
  lastname: String (required),
  email: String (unique, required),
  password: String (hashed, required),
  phone: String,
  address: String,
  isAdmin: Boolean (default: false),
  timestamps: true
}
```

### Product Model
```javascript
{
  name: String (required),
  description: String,
  price: Number (required),
  category: String (default: "General"),
  image: String (filename),
  countInStock: Number (default: 0),
  isActive: Boolean (default: true),
  timestamps: true
}
```

### Order Model
```javascript
{
  user: ObjectId (ref: User, required),
  orderItems: [
    {
      name: String,
      qty: Number,
      price: Number,
      image: String,
      product: ObjectId (ref: Product)
    }
  ],
  shippingAddress: { address, city, postalCode, country },
  paymentMethod: String,
  paymentResult: { id, status, update_time, email_address },
  totalPrice: Number,
  taxPrice: Number,
  shippingPrice: Number,
  isPaid: Boolean,
  paidAt: Date,
  deliveredAt: Date,
  cancelledAt: Date,
  orderStatus: String enum ["Placed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"],
  timestamps: true
}
```

### Contact Model
```javascript
{
  name: String (required),
  email: String (required),
  phone: String,
  message: String (required),
  isRead: Boolean (default: false),
  isArchived: Boolean (default: false),
  timestamps: true
}
```

---

## 🔑 Authentication

### JWT Token Flow
1. User registers/logs in with email and password
2. Server validates credentials and generates JWT token
3. Token is stored in localStorage (frontend)
4. Token is sent with API requests in Authorization header: `Bearer <token>`
5. Server middleware (`protect`) verifies token
6. Admin routes require both `protect` and `admin` middleware

### Protected Routes
- User routes: `/cart`, `/checkout`, `/order-placed`, `/my-orders`, `/profile`
- Admin routes: `/add-product`, `/admin-orders`, `/admin-messages`
- Route protection prevents unauthorized access and redirects to login

---

## 🎯 Key Features Explained

### Order Status Management
Orders follow a strict state machine:
- **Placed** → Initial state when order is created
- **Preparing** → Admin updates to this
- **Out for Delivery** → Admin updates to this
- **Delivered** → Final state, cannot be cancelled after this
- **Cancelled** → Cannot be delivered once cancelled

**Illegal transitions are prevented**:
- ❌ Cannot cancel a delivered order
- ❌ Cannot deliver a cancelled order

### Image Uploads
- Products can have images uploaded via multipart form
- Images stored in `backend/uploads/` directory
- Served via static route: `/uploads/filename`
- Validation: Only JPEG, JPG, PNG, GIF allowed
- File size managed by multer configuration

### Email Notifications
- Contact form submissions send confirmation emails
- Uses Nodemailer with Gmail SMTP
- Non-blocking (errors don't fail the request)
- Customizable email templates in `sendEmail.js`

### State Management
- **Redux**: Global state for products and user
- **Context API**: Product listing context
- **localStorage**: User session persistence (token, user data)

---

### JWT Token Expired
- Token expires after 30 days
- User is automatically logged out
- Redirect to login page occurs via axios interceptor

### Image Upload Fails
- Ensure `/backend/uploads/` directory exists
- Check file is valid image format (JPEG, JPG, PNG, GIF)
- Verify multer configuration in products.js

### CORS Errors
- Frontend URL must match CORS origin in server.js
- Default: `http://localhost:5173`
- Change if frontend runs on different port

### Email Not Sending
- Verify EMAIL_USER and EMAIL_PASS in .env
- Use App-Specific Password for Gmail (not regular password)
- Check email has less restrictive security settings

---

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Redux Toolkit Guide](https://redux-toolkit.js.org/)
- [JWT Authentication](https://jwt.io/)
- [Mongoose Documentation](https://mongoosejs.com/)



---

**Last Updated**: February 5, 2026
**Version**: 1.0.0
