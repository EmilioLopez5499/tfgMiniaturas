import { Request, Response } from 'express';
import pool from '../db.js';

export async function recibirMensaje(req: Request, res: Response): Promise<void> {
  try {
    const { nombre, email, mensaje } = req.body;
    if (!nombre || !email || !mensaje) {
      res.status(400).json({ error: 'Todos los campos son obligatorios' });
      return;
    }
    const resultado = await pool.query(
      'INSERT INTO mensajes (nombre, email, mensaje) VALUES ($1, $2, $3) RETURNING *',
      [nombre, email, mensaje]
    );
    res.status(201).json({ ok: true, mensaje: resultado.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar el mensaje' });
  }
}