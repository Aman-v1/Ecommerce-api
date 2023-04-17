import dotenv from 'dotenv';
import express from 'express';
import dbConnect from '../config/dbConnect.js';
import { globalErrHandler, notFound } from '../middlewares/globalErrHandler.js';
import brandRoutes from '../routes/brandRoutes.js';
import categoryRoutes from '../routes/categoryRoutes.js';
import productRoutes from '../routes/productRoutes.js';
import userRoutes from '../routes/userRoutes.js';
import colorRoutes from '../routes/colorRoutes.js';
import reviewRoutes from '../routes/reviewRouter.js';

dotenv.config();

//db connection
dbConnect();
const app = express();

//pass incoming data
app.use(express.json());

//routes
app.use('/api/v1/users/', userRoutes);
app.use('/api/v1/products/', productRoutes);
app.use('/api/v1/categories/', categoryRoutes);
app.use('/api/v1/brands/', brandRoutes);
app.use('/api/v1/colors/', colorRoutes);
app.use('/api/v1/reviews/', reviewRoutes);
//err middleware
app.use(notFound);
app.use(globalErrHandler);

export default app;
