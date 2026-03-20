const mercadopago = require('mercadopago');

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