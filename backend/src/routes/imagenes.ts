import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { obtenerImagenes, subirImagen } from '../controllers/imagenesController';

const router = Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (_req, file, cb) => {
    const nombre = Date.now() + path.extname(file.originalname);
    cb(null, nombre);
  }
});

const upload = multer({ storage });

router.get('/', obtenerImagenes);
router.post('/', upload.single('imagen'), subirImagen);

export default router;