import express from 'express';
import cors from 'cors';
import { errorMiddleware } from './middleware/errorMiddleware.js';
//import helmet from "helmet";

import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

//API Routes
app.use('/users', userRoutes);
app.use('/products', productRoutes);

app.use(errorMiddleware);

export default app;
