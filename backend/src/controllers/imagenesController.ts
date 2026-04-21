import { Request, Response } from 'express';
import pool from '../db.js';

export async function obtenerImagenes(_req: Request, res: Response): Promise<void> {
  try {
    const resultado = await pool.query('SELECT * FROM imagenes ORDER BY creado_en DESC');
    res.json(resultado.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las imágenes' });
  }
}

export async function subirImagen(req: Request, res: Response): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No se ha subido ninguna imagen' });
      return;
    }
    const { alt } = req.body;
    const src = `/uploads/${req.file.filename}`;
    const resultado = await pool.query(
      'INSERT INTO imagenes (src, alt) VALUES ($1, $2) RETURNING *',
      [src, alt]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al subir la imagen' });
  }
}