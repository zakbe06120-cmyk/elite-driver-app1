const stripePackage = require('stripe');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Méthode non autorisée.' });

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return res.status(503).json({ error: 'Vérification du paiement indisponible.' });

  const sessionId = req.query && req.query.session_id;
  if (typeof sessionId !== 'string' || !sessionId || sessionId.length > 255) {
    return res.status(400).json({ error: 'Référence de paiement invalide.' });
  }

  try {
    const stripe = stripePackage(secretKey);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const metadata = session.metadata || {};
    const paid = session.payment_status === 'paid';

    return res.status(200).json({
      paid,
      trip: {
        depart: metadata.depart || '',
        arrivee: metadata.arrivee || '',
        service: metadata.service || 'Transfert',
        vehicleType: metadata.vehicleType || '',
        date: metadata.date || '',
        heure: metadata.heure || '',
        amount: Number(metadata.amount || session.amount_total / 100),
        baseAmount: Number(metadata.baseAmount || metadata.amount || session.amount_total / 100),
        discountAmount: Number(metadata.discountAmount || 0),
        welcomeOffer: metadata.welcomeOffer === 'true',
        ref: metadata.ref || session.client_reference_id || '',
        lang: metadata.lang === 'en' ? 'en' : 'fr',
      },
    });
  } catch (error) {
    console.error('Stripe Checkout session verification failed:', error);
    return res.status(404).json({ error: 'Ce paiement n’a pas pu être vérifié.' });
  }
};
