// app.js

require('dotenv').config(); // load .env

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const mongoose = require('mongoose');
const cors = require('cors');

// Routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var riskRouter = require('./routes/risk');   // ✅ NEW

// Create app instance
var app = express();

// ----------------- MongoDB Connection -----------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

// ----------------- Middlewares -----------------
app.use(logger('dev'));
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ----------------- Routes -----------------
app.use('/api', indexRouter);         // GET /api, /api/ping
app.use('/api/users', usersRouter);   // users route (if used)
app.use('/api/risk', riskRouter);     // ✅ POST /api/risk/check

// ----------------- 404 handler -----------------
app.use(function (req, res, next) {
  next(createError(404));
});

// ----------------- Error handler -----------------
app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({
    error: {
      message: err.message,
      status: err.status || 500,
    },
  });
});

module.exports = app;
