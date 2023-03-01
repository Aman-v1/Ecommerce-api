import dotenv from 'dotenv';
import express from 'express';
import dbConnect from '../config/dbConnect.js';
import { globalErrHandler, notFound } from '../middlewares/globalErrHandler.js';
import productRoutes from '../routes/productRoutes.js';
import userRoutes from '../routes/userRoutes.js';

dotenv.config();

//db connection
dbConnect();
const app = express();

//pass incoming data
app.use(express.json());

//routes
app.use('/api/v1/users/', userRoutes);
app.use('/api/v1/products/', productRoutes);

//err middleware
app.use(notFound);
app.use(globalErrHandler);

export default app;
