import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface RequestConUsuario extends Request {
  usuario?: { id: number; rol: string };
}

export function verificarToken(req: RequestConUsuario, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Acceso denegado, token no proporcionado' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number; rol: string };
    req.usuario = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

export function soloAdmin(req: RequestConUsuario, res: Response, next: NextFunction): void {
  if (!req.usuario || (req.usuario.rol !== 'pintor' && req.usuario.rol !== 'superadmin')) {
    res.status(403).json({ error: 'Acceso denegado, permisos insuficientes' });
    return;
  }
  next();
}