import mongoose from 'mongoose';
const Schema = mongoose.Schema;

//Gernerate random numbers for order no
const randomTxt = Math.random().toString(36).substring(7).toLocaleLowerCase();
const randomNumbers = Math.floor(1000 + Math.random() * 90000);

const OrderSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderItems: [
      {
        type: Object,
        required: true,
      },
    ],
    shippingAddress: {
      type: Object,
      required: true,
    },
    orderNumber: {
      type: String,
      required: true,
      default: randomTxt + randomNumbers,
    },
    paymentStatus: {
      type: String,
      required: true,
      default: 'Not Paid',
    },
    paymentMethod: {
      type: String,
      default: 'Not Specified',
    },
    totalPrice: {
      type: Number,
      default: 0.0,
    },
    currency: {
      type: String,
      default: 'Not Specified',
    },
    status: {
      type: String,
      default: 'pending',
      enum: ['pending', 'processing', 'shipped', 'delivered'],
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', OrderSchema);

export default Order;
