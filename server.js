import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import typeRouter from './routes/typeRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import businessRouter from './routes/businessRoute.js';
const app = express();
app.use(express.json());
app.use(cors());
dotenv.config

app.listen(process.env.PORT, () => {
console.log(`listening on port ${process.env.PORT}`);
})

app.use('/type', typeRouter);
app.use('/admin', adminRouter);
app.use('/business', businessRouter);