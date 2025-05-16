import  express from 'express';
import mongoose from 'mongoose';
import blogRoutes from './routes/blogroutes.js';
import authRoutes from './routes/authroutes.js';
const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/blogapp');

app.use('/api/blogs', blogRoutes);
app.use('/api/auth', authRoutes);

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
