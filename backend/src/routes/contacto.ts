import { Router } from 'express';
import { recibirMensaje } from '../controllers/contactoController.js';

const router = Router();

router.post('/', recibirMensaje);

export default router;