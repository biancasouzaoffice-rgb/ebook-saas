const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const hash = await bcrypt.hash(req.body.password, 10);

  const user = await User.create({
    email: req.body.email,
    password: hash
  });

  res.send(user);
};

exports.login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(400).send('Usuário não existe');

  const valid = await bcrypt.compare(req.body.password, user.password);

  if (!valid) return res.status(400).send('Senha errada');

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.send({ token });
};