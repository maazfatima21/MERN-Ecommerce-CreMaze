require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// ---------------- Routes ----------------
const productsRoute = require('./routes/products'); 
const ordersRoute = require('./routes/orders');
const usersRoute = require('./routes/users');
const contactRoute = require('./routes/contact');

// ---------------- Middleware ----------------
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ---------------- Middleware ----------------

app.use(
  cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ---------------- API Routes ----------------
app.use('/api/products', productsRoute); 
app.use('/api/orders', ordersRoute);
app.use('/api/users', usersRoute);
app.use('/api/contact', contactRoute);

app.get('/', (req, res) => {
  res.send('CREMAZE Backend is running');
});

app.get('/api/health', (req, res) => {
  res.json({ message: "CreMaze API running" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
