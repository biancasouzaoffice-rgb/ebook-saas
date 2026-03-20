const User = require('../models/User');

exports.convert = async (req, res) => {
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

  res.send('Conversão realizada (simulada)');
};