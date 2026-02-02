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

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ---------------- API Routes ----------------
app.use('/api/products', productsRoute); 
app.use('/api/orders', ordersRoute);
app.use('/api/users', usersRoute);
app.use('/api/contact', contactRoute);

app.get('/', (req, res) => {
  res.send('CREMAZE Backend is running');
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error", error: err.message });
});

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
