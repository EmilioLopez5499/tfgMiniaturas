import { Router } from 'express';
import { recibirMensaje } from '../controllers/contactoController';

const router = Router();

router.post('/', recibirMensaje);

export default router;