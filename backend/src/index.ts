import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import imagenesRouter from './routes/imagenes';
import contactoRouter from './routes/contacto';
import authRouter from './routes/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: ['http://localhost:8080', 'http://127.0.0.1:8080'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/imagenes', imagenesRouter);
app.use('/api/contacto', contactoRouter);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.use('/api/auth', authRouter);