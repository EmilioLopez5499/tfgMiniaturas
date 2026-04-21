import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import imagenesRouter from './routes/imagenes.js';
import contactoRouter from './routes/contacto.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/imagenes', imagenesRouter);
app.use('/api/contacto', contactoRouter);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});