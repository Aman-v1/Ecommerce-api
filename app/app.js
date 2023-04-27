import dotenv from 'dotenv';
import Stripe from 'stripe';
import express from 'express';
import dbConnect from '../config/dbConnect.js';
import { globalErrHandler, notFound } from '../middlewares/globalErrHandler.js';
import brandRoutes from '../routes/brandRoutes.js';
import categoryRoutes from '../routes/categoryRoutes.js';
import productRoutes from '../routes/productRoutes.js';
import userRoutes from '../routes/userRoutes.js';
import colorRoutes from '../routes/colorRoutes.js';
import reviewRoutes from '../routes/reviewRouter.js';
import orderRoutes from '../routes/ordersRouter.js';
import Order from '../models/Order.js';
import couponRoutes from '../routes/couponRoutes.js';

dotenv.config();

//db connection
dbConnect();
const app = express();

//Stripe webhook

const stripe = new Stripe(process.env.STRIPE_KEY);

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = 'whsec_f12a5ec36348c6de9b1fc97dd8def29caecdf86b68929f98af9d5105c625878d';

app.post('/webhook', express.raw({ type: 'application/json' }), async (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    console.log('event');
  } catch (err) {
    console.log('err', err.message);
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  if (event.type === 'checkout.session.completed') {
    //update the order
    const session = event.data.object;
    const { orderId } = session.metadata;
    const paymentStatus = session.payment_status;
    const paymentMethod = session.payment_method_types[0];
    const totalAmount = session.amount_total;
    const currency = session.currency;
    //find the order
    const order = await Order.findByIdAndUpdate(
      JSON.parse(orderId),
      {
        totalPrice: totalAmount / 100,
        currency,
        paymentMethod,
        paymentStatus,
      },
      {
        new: true,
      }
    );
  } else {
    return;
  }
  // Return a 200 response to acknowledge receipt of the event
  response.send();
});
//pass incoming data
app.use(express.json());

//routes
app.use('/api/v1/users/', userRoutes);
app.use('/api/v1/products/', productRoutes);
app.use('/api/v1/categories/', categoryRoutes);
app.use('/api/v1/brands/', brandRoutes);
app.use('/api/v1/colors/', colorRoutes);
app.use('/api/v1/reviews/', reviewRoutes);
app.use('/api/v1/orders/', orderRoutes);
app.use('/api/v1/coupons/', couponRoutes);

//err middleware
app.use(notFound);
app.use(globalErrHandler);

export default app;
