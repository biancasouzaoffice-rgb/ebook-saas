require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const auth = require('./middleware/auth');
const authController = require('./controllers/authController');
const convertController = require('./controllers/convertController');
const paymentController = require('./controllers/paymentController');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL);

// ROTAS
app.post('/register', authController.register);
app.post('/login', authController.login);
app.post('/convert', auth, convertController.convert);
app.post('/create-payment', auth, paymentController.createPayment);

module.exports = app;