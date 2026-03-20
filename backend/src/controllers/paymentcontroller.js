const mercadopago = require('mercadopago');

mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
});

exports.createPayment = async (req, res) => {
  const pref = await mercadopago.preferences.create({
    items: [
      {
        title: 'Plano PRO',
        quantity: 1,
        unit_price: 19.9
      }
    ],
    metadata: {
      userId: req.user.id
    }
  });

  res.send({ url: pref.body.init_point });
};
