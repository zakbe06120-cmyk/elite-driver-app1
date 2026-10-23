const stripePackage = require('stripe');

const APP_URL = 'https://elite-driver-app1.vercel.app';
const ROUTE_PRICES = new Map([
  ['Saint-Jean-Cap-Ferrat|Aéroport de Nice', 70],
  ['Beaulieu-sur-Mer|Aéroport de Nice', 70],
  ['Villefranche-sur-Mer|Aéroport de Nice', 50],
  ['Monaco|Aéroport de Nice', 100],
  ['Aéroport de Nice|Saint-Tropez', 280],
]);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée.' });

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return res.status(503).json({ error: 'Le paiement est momentanément indisponible. Veuillez nous contacter pour réserver.' });
  }

  const { amount, service, depart, arrivee, vehicleType, date, heure, ref, baseAmount, discountAmount, welcomeOffer, lang } = req.body || {};
  const basePrice = ROUTE_PRICES.get(depart + '|' + arrivee);
  const requestedAmount = Number(amount);
  const allowedAmounts = basePrice ? [basePrice, Math.round(basePrice * 0.85 * 100) / 100] : [];

  if (!basePrice || !Number.isFinite(requestedAmount) || !allowedAmounts.includes(requestedAmount)) {
    return res.status(400).json({ error: 'Le tarif de ce trajet est invalide. Veuillez recommencer la réservation.' });
  }

  try {
    const stripe = stripePackage(secretKey);
    const vehicleDescription = vehicleType ? ' — ' + vehicleType : '';
    const returnOrigin = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(req.headers.origin || '')
      ? req.headers.origin
      : APP_URL;
    const tripMetadata = {
      depart: String(depart),
      arrivee: String(arrivee),
      service: String(service || 'Transfert'),
      vehicleType: String(vehicleType || ''),
      date: String(date || ''),
      heure: String(heure || ''),
      amount: String(requestedAmount),
      baseAmount: String(baseAmount || requestedAmount),
      discountAmount: String(discountAmount || 0),
      welcomeOffer: String(welcomeOffer === true),
      ref: String(ref || ''),
      lang: lang === 'en' ? 'en' : 'fr',
    };
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Elite Driver Azur Riviera — ' + (service || 'Transfert'),
            description: depart + ' → ' + arrivee + vehicleDescription,
          },
          unit_amount: Math.round(requestedAmount * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      client_reference_id: tripMetadata.ref || undefined,
      metadata: tripMetadata,
      payment_intent_data: { metadata: tripMetadata },
      success_url: returnOrigin + '/?payment=success&session_id={CHECKOUT_SESSION_ID}',
      cancel_url: returnOrigin + '/?payment=cancelled&session_id={CHECKOUT_SESSION_ID}',
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe Checkout session creation failed:', error);
    return res.status(502).json({ error: 'Stripe n’a pas pu démarrer le paiement. Veuillez réessayer ou nous contacter.' });
  }
};
