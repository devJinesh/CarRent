# 🚗 CarRent - Premium Car Rental Platform

> A modern, full-stack car rental management system built with Next.js, Node.js, and MongoDB. Experience seamless vehicle booking with an elegant dark-themed interface.

---

## ✨ Features

- 🎨 **Modern Dark UI** - Sleek, premium dark theme with electric cyan and vibrant violet accents
- 🚗 **Smart Car Browsing** - Filter by type, brand, transmission, and fuel type with toggle visibility
- 📅 **Intelligent Booking** - Real-time availability with double-booking prevention
- 🗓️ **Native Date Picker** - Simple HTML5 datetime inputs with DD/MM/YYYY HH:mm format
- 🔐 **Secure Authentication** - JWT-based auth with protected routes
- 💳 **Razorpay Integration** - Seamless payment processing
- 📄 **Professional Invoices** - Generate PDF invoices with company details
- 👨‍💼 **Admin Dashboard** - Complete car fleet management
- 📊 **Booking History** - Track all past and upcoming reservations with filters
- ⚡ **Real-time Updates** - Instant booking status notifications

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with app router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icon system
- **Axios** - HTTP client for API requests

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Secure authentication
- **Razorpay** - Payment gateway integration

### Security & Performance
- **Helmet.js** - HTTP headers security
- **Express Rate Limit** - API rate limiting
- **CORS** - Configurable cross-origin requests
- **bcrypt** - Password hashing

---

## 📁 Project Structure

```
consistent_cars/
├── client/              # Next.js Frontend
│   ├── app/            # App router pages
│   ├── components/     # Reusable components
│   │   ├── layout/    # Header, Footer
│   │   ├── sections/  # Hero, Services, Reviews
│   │   └── ui/        # DateTime picker, Loading
│   ├── lib/           # API client, auth, utilities
│   ├── hooks/         # Custom React hooks
│   ├── public/        # Static assets
│   └── styles/        # Global CSS
│
├── server/             # Express Backend
│   ├── Controllers/    # Business logic
│   ├── Models/         # MongoDB schemas
│   ├── Routes/         # API endpoints
│   ├── middleware/     # Auth, validation
│   └── Db/            # Database connection
│
└── code/               # Legacy React implementation
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18.18+ 
- **MongoDB** Atlas account or local instance
- **Razorpay** account for payments

### 1️⃣ Clone the Repository
```bash
git clone <your-repository-url>
cd consistent_cars
```

### 2️⃣ Setup Backend
```bash
cd server
npm install
```

Create `.env` file in `server/` directory:
```env
PORT=8000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
ALLOWED_ORIGINS=http://localhost:3000
CLIENT_URL=http://localhost:3000
SERVE_REACT=false
```

Start the backend:
```bash
npm start
```
Backend runs on **http://localhost:8000**

### 3️⃣ Setup Frontend
```bash
cd client
npm install
```

Create `.env` file in `client/` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

Start the frontend:
```bash
npm run dev
```
Frontend runs on **http://localhost:3000**

---

## 🌐 Deployment

### Backend (Render/Railway/Heroku)
**Build Command:**
```bash
npm install
```

**Start Command:**
```bash
npm start
```

**Environment Variables:**
- Set `NODE_ENV=production`
- Update `ALLOWED_ORIGINS` with frontend URL
- Update `CLIENT_URL` with frontend URL

### Frontend (Vercel/Render)
**Build Command:**
```bash
npm install && npm run build
```

**Start Command:**
```bash
npm run start
```

**Environment Variables:**
- Update `NEXT_PUBLIC_API_URL` with backend URL
- Add `NEXT_PUBLIC_RAZORPAY_KEY_ID`

---

## 🔒 Security Features

- ✅ JWT authentication with HTTP-only patterns
- ✅ Password hashing with bcrypt
- ✅ Rate limiting on API endpoints
- ✅ Helmet.js for security headers
- ✅ CORS configuration
- ✅ Input validation and sanitization

---

## 📝 API Endpoints

### Cars
- `GET /api/cars/` - Get all available cars
- `POST /api/cars/addcar` - Add new car (Admin)
- `PUT /api/cars/editcar` - Update car (Admin)
- `DELETE /api/cars/deletecar` - Delete car (Admin)

### Users
- `POST /api/users/login` - User login
- `POST /api/users/register` - User registration

### Bookings
- `POST /api/bookings/bookcar` - Create booking
- `GET /api/bookings/getallbookings` - Get user bookings
- `POST /api/bookings/verify-payment` - Verify Razorpay payment

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Author

**Jinkz**

<div align="center">
  
### ⭐ Star this repo if you find it helpful!

Built with ❤️ using Next.js, Node.js, and MongoDB

</div>
