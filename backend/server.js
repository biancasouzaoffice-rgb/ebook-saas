require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mercadopago = require('mercadopago');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL);

// MODEL
const User = mongoose.model('User', {
  email: String,
  password: String,
  plan: { type: String, default: 'free' },
  conversionsToday: { type: Number, default: 0 },
  lastConversionDate: String
});

// AUTH
function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send('Sem token');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).send('Token inválido');
  }
}

// REGISTER
app.post('/register', async (req, res) => {
  const hash = await bcrypt.hash(req.body.password, 10);
  const user = await User.create({
    email: req.body.email,
    password: hash
  });
  res.send(user);
});

// LOGIN
app.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Usuário não existe');

  const valid = await bcrypt.compare(req.body.password, user.password);
  if (!valid) return res.status(400).send('Senha errada');

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.send({ token });
});

// FREEMIUM
app.post('/convert', auth, async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user.plan === 'free') {
    const today = new Date().toDateString();

    if (user.lastConversionDate !== today) {
      user.conversionsToday = 0;
      user.lastConversionDate = today;
    }

    if (user.conversionsToday >= 3) {
      return res.status(403).send('Limite diário atingido');
    }

    user.conversionsToday++;
    await user.save();
  }

  res.send('Conversão feita (simulada)');
});

// MERCADO PAGO
mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

app.post('/create-payment', auth, async (req, res) => {
  const pref = await mercadopago.preferences.create({
    items: [{ title: 'Plano PRO', quantity: 1, unit_price: 19.9 }],
    metadata: { userId: req.user.id }
  });

  res.send({ url: pref.body.init_point });
});

// WEBHOOK (simples)
app.post('/webhook', (req, res) => {
  res.sendStatus(200);
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));